import React, { useState } from 'react';
import { submitTransaction, searchICDCodes } from '../services/api';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

const TransactionForm = () => {
  const [diagnosis, setDiagnosis] = useState('');
  const [icdCode, setIcdCode] = useState('');
  const [patientId, setPatientId] = useState('');
  const [visitType, setVisitType] = useState('telemedicine');
  const [visitCategory, setVisitCategory] = useState('new');
  const [complexity, setComplexity] = useState(1);
  const [icdCodeSuggestions, setIcdCodeSuggestions] = useState([]);
  const [error, setError] = useState(null);

  // Initialize Coinbase Wallet SDK
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: 'BillingDog',
    appLogoUrl: '/Users/shardingdog/billingdog/public/billingdog_logo.png', // Replace with your app's logo URL
    darkMode: false
  });
  const ethereum = coinbaseWallet.makeWeb3Provider('https://sepolia.infura.io/v3/8333494b07dd472b8a57f008d76d8790', 1);

  const handleDiagnosisChange = async (e) => {
    const value = e.target.value;
    setDiagnosis(value);

    if (value.length > 2) {
      try {
        const suggestions = await searchICDCodes(value);
        setIcdCodeSuggestions(suggestions);
      } catch (err) {
        setError('Failed to fetch ICD codes. Please try again later.');
        console.error('Error fetching ICD codes:', err);
      }
    } else {
      setIcdCodeSuggestions([]);
    }
  };

  const handleIcdCodeSelect = (code) => {
    setIcdCode(code);
    setIcdCodeSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitTransaction({
        icdCode,
        patientId,
        visitType,
        visitCategory,
        complexity,
      });
      console.log('Transaction submitted:', response);

      // Perform payment with Coinbase Wallet
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const transactionParameters = {
        to: '0xRecipientAddress', // Replace with the recipient's address
        from: accounts[0],
        value: '0x29a2241af62c0000', // Replace with the amount in wei
        gasPrice: '0x09184e72a000', // Customize as per your requirement
        gas: '0x2710', // Customize as per your requirement
      };

      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log('Payment successful with txHash:', txHash);
    } catch (err) {
      setError('Transaction failed. Please try again.');
      console.error('Error submitting transaction:', err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Submit a Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Diagnosis</label>
          <input
            type="text"
            value={diagnosis}
            onChange={handleDiagnosisChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {icdCodeSuggestions.length > 0 && (
            <ul className="bg-white border rounded w-full mt-2">
              {icdCodeSuggestions.map((suggestion) => (
                <li
                  key={suggestion.code}
                  onClick={() => handleIcdCodeSelect(suggestion.code)}
                  className="py-2 px-4 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion.code} - {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">ICD Code</label>
          <input
            type="text"
            value={icdCode}
            onChange={(e) => setIcdCode(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Patient ID</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Visit Type</label>
          <select
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="inpatient">Inpatient</option>
            <option value="outpatient">Outpatient</option>
            <option value="telemedicine">Telemedicine</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Visit Category</label>
          <select
            value={visitCategory}
            onChange={(e) => setVisitCategory(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="new">New Patient</option>
            <option value="follow-up">Follow-up</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Complexity</label>
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value={1}>Low Complexity</option>
            <option value={2}>Medium Complexity</option>
            <option value={3}>High Complexity</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        <div className="flex items-center justify-between">
          <button

            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
