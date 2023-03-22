import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ReactQueryProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const ReactQuery = ({ children }: ReactQueryProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQuery;
