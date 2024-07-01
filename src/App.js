import React from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionsList from './components/TransactionsList';
import './index.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <header className="bg-blue-600 w-full py-6">
        <h1 className="text-3xl text-white font-bold text-center">BillingDog</h1>
      </header>
      <main className="w-full max-w-4xl mt-8">
        <TransactionForm />
        <TransactionsList />
      </main>
    </div>
  );
};

export default App;
