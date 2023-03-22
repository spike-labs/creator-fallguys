import { Flex, Stack, useColorModeValue } from '@chakra-ui/react';
import { RiShoppingCartFill } from 'react-icons/ri';
import { HiViewGrid } from 'react-icons/hi';

import NavButton from './components/NavButton';
import Logo from './components/Logo';

const Sidebar = () => {
  return (
    <Flex as="aside" minH="full" pos="sticky" top={0}>
      <Flex
        flex="1"
        boxShadow={useColorModeValue('sm', 'sm-dark')}
        borderRight="1px solid rgba(0, 0, 0, 0.1)"
        maxW={{ base: 'full' }}
        py={{ base: '6', sm: '8' }}
        px={{ base: '4' }}
      >
        <Stack justify="space-between" spacing="1">
          <Stack spacing={{ base: '5', sm: '20' }} shouldWrapChildren>
            <Logo />

            <Stack spacing="6">
              <NavButton label="Library" icon={HiViewGrid} href="/" />
              <NavButton
                label="Market"
                icon={RiShoppingCartFill}
                href="/market"
              />
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
