import type { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Flex direction="row" h="full">
      <Sidebar />
      <Flex direction="column" flex={1}>
        <Header />
        <Flex flex="1" direction="column" justify="between" overflowY={'auto'}>
          <Box as="main" flex={1}>
            {children}
          </Box>
          <Footer />
        </Flex>
      </Flex>
    </Flex>
  );
};

export const LayoutWithoutSidebar = ({ children }: LayoutProps) => {
  return (
    <Flex direction="row" h="full">
      <Flex direction="column" flex={1}>
        <Header />
        <Flex flex="1" direction="column" justify="between" overflowY={'auto'}>
          <Box as="main" flex={1}>
            {children}
          </Box>
          <Footer />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;
