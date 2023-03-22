import { Flex } from '@chakra-ui/react';

import Web3Button from '@/components/Web3Button';

const Header = () => {
  return (
    <Flex
      as="header"
      width="full"
      align="center"
      py={4}
      px={10}
      zIndex="1"
      borderBottom="1px solid rgba(0, 0, 0, 0.1)"
    >
      <Flex marginLeft="auto" gap={10} alignItems="center">
        <Web3Button />
      </Flex>
    </Flex>
  );
};

export default Header;
