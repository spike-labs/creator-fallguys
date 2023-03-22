import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
// import { bsc } from 'wagmi/chains';
import { EthereumClient, modalConnectors } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';

interface WagmiConfigProviderProps {
  children: React.ReactNode;
}

// Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID)
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable');

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const Sepolia = {
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: {
      http: ['https://ethereum-sepolia.blockpi.network/v1/rpc/public'],
    },
    default: {
      http: ['https://ethereum-sepolia.blockpi.network/v1/rpc/public	'],
    },
  },
  blockExplorers: {
    etherscan: { name: 'sepolia', url: 'https://sepolia.etherscan.io/' },
    default: { name: 'sepolia', url: 'https://sepolia.etherscan.io/' },
  },
};

const { provider, chains } = configureChains([Sepolia], [publicProvider()]);

const connectors = modalConnectors({
  projectId,
  appName: 'Spike Web3 Game',
  version: '1',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const explorerAllowList = [
  // Metamask
  'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
];

export const ethereumClient = new EthereumClient(wagmiClient, chains);

export const DefaultWeb3Modal = () => {
  return (
    <Web3Modal
      projectId={projectId}
      ethereumClient={ethereumClient}
      explorerAllowList={explorerAllowList}
    />
  );
};

export const WagmiConfigProvider = ({ children }: WagmiConfigProviderProps) => {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>;
};
