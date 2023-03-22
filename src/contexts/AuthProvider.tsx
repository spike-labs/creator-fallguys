import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

interface AuthProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProps) => {
  const account = useAccount();
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsConnected(account.isConnected);
    if (!account.isConnected) {
      router.replace('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.isConnected]);

  return <>{(isConnected || router.pathname === '/login') && children}</>;
};

export default AuthProvider;
