import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/api';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions();
        setTransactions(response);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id} className="mb-2">
            <span className="font-semibold">ICD Code:</span> {transaction.icdCode}, 
            <span className="font-semibold"> Patient ID:</span> {transaction.patientId}, 
            <span className="font-semibold"> Transaction Hash:</span> {transaction.transactionHash}, 
            <span className="font-semibold"> Visit Type:</span> {transaction.visitType}, 
            <span className="font-semibold"> Visit Category:</span> {transaction.visitCategory}, 
            <span className="font-semibold"> Complexity:</span> {transaction.complexity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsList;
