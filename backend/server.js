const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');
const winston = require('winston');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const authMiddleware = require('./authMiddleware');
const errorHandler = require('./errorHandler');
const logger = require('./logger');
const Transaction = require('./models/Transaction');
const { sendTransactionNotification } = require('./notifications');
const { CoinbaseWalletSDK } = require('@coinbase/wallet-sdk');
const { LocalStorage } = require('node-localstorage');
const { ethers } = require('ethers'); // Ensure this import is correct

// Initialize localStorage for Node.js
global.localStorage = new LocalStorage('./scratch');

// Initialize Coinbase Wallet SDK
const coinbaseWallet = new CoinbaseWalletSDK({
  appName: 'Billing Dog',
  appLogoUrl: '/Users/shardingdog/billingdog/public/billingdog_logo.png', // Replace with your app's logo URL
  darkMode: false
});
const ethereum = coinbaseWallet.makeWeb3Provider(process.env.COINBASE_RPC_URL, 1);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(authMiddleware);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  logger.info('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
  logger.error('Error connecting to MongoDB', error);
});

// Ethers.js provider and contract
const provider = new ethers.providers.JsonRpcProvider(process.env.COINBASE_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [ /* ABI items here */ ];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// API Routes
app.post('/submit-transaction', async (req, res, next) => {
  const { icdCode, patientId, visitType, visitCategory, complexity, email } = req.body;
  try {
    const txData = {
      icdCode,
      patientId,
      from: wallet.address,
      to: contractAddress,
      data: contract.interface.encodeFunctionData('recordBilling', [icdCode, patientId])
    };
    const paymasterResponse = await sendWithPaymaster(txData);
    const signedTx = paymasterResponse.signedTx;
    const bundlerResponse = await sendWithBundler(signedTx);
    const newTransaction = new Transaction({ icdCode, patientId, transactionHash: bundlerResponse.txHash, visitType, visitCategory, complexity });
    await newTransaction.save();
    sendTransactionNotification(email, icdCode, patientId, bundlerResponse.txHash);
    res.status(200).send('Transaction successful');
  } catch (error) {
    logger.error('Transaction failed', error);
    res.status(500).send({ error: 'Transaction failed', details: error.message });
    next(error);
  }
});

app.post('/api/payments', async (req, res, next) => {
  try {
    const paymentData = req.body;
    logger.info('Received Coinbase webhook:', paymentData);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

app.use('/support', require('./supportRoutes'));
app.use('/pricing', require('./pricingRoutes'));
app.use('/patients', require('./patientRoutes'));
app.use('/billing', require('./billingRoutes'));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../build')));

// Catch-all handler to return React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});