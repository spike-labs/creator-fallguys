import { Flex, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Flex as="footer" width="full" pb={4} pt={8} px={4}>
      <Text fontSize="12px" color="#00000066">
        © {new Date().getFullYear()} Spike
      </Text>
    </Flex>
  );
};

export default Footer;
