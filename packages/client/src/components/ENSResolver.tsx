import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

const ENSResolver = ({ address }) => {
  const [ensName, setEnsName] = useState('');

  useEffect(() => {
    const resolveENSName = async () => {
      if (ethers.utils.isAddress(address)) {
        // Connect to the Ethereum mainnet
        const provider = new ethers.providers.JsonRpcProvider(
          import.meta.env.VITE_ETH_PROVIDER || '',
        );

        try {
          const name = await provider.lookupAddress(address);
          setEnsName(name);
        } catch (error) {
          console.error('Error resolving ENS name:', error);
        }
      }
    };

    resolveENSName();
  }, [address]);

  const displayedText = ensName || address.toString().slice(0, 20) + '...';

  return (
    <a
      href={`https://optimistic.etherscan.io/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline text-blue-500"
    >
      {displayedText}
    </a>
  );
};

export default ENSResolver;
