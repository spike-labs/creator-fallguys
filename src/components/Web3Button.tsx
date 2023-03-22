import { useEffect, useState } from 'react';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';
import clsx from 'clsx';

const Web3Button = () => {
  const account = useAccount();
  const { open } = useWeb3Modal();

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(account.isConnected);
  }, [account.isConnected]);

  const btnStyles = clsx(
    'btn-outline btn-sm btn',
    'rounded-full border-[#00000066]',
    'hover:border-transparent hover:bg-[#0000000F] hover:text-[#000000]',
  );

  return (
    <>
      {isConnected ? (
        <button className={btnStyles} onClick={() => open()}>
          {account.address &&
            `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
        </button>
      ) : (
        <button className={btnStyles} onClick={() => open()}>
          Connect Wallet
        </button>
      )}
    </>
  );
};

export default Web3Button;
