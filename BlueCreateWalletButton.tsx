import React, { useCallback } from 'react';
import { useConnect } from 'wagmi';
import { CoinbaseWalletLogo } from './CoinbaseWalletLogo';

const buttonStyles = {
  background: '#0052FF',
  color: '#fff',
  border: 'none',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '200px',
  height: '50px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '18px',
  borderRadius: '10px',
  cursor: 'pointer',
};

export function BlueCreateWalletButton() {
  const { connectors, connect } = useConnect();

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === 'coinbaseWalletSDK'
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);

  return (
    <button style={buttonStyles} onClick={createWallet}>
      <CoinbaseWalletLogo />
      Create Wallet
    </button>
  );
}

