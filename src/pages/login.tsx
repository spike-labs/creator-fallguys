import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

import { LayoutWithoutSidebar } from '@/layouts/DefaultLayout';

const Page = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <>
      <Head>
        <title>Spike Web3 Game - Login</title>
        <meta name="description" content="Spike Web3 Game - Login" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex h-full flex-col items-center justify-center">
        Immediately bind the wallet to log in
      </div>
    </>
  );
};

Page.layout = LayoutWithoutSidebar;

export default Page;
