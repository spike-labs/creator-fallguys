import { chakra, Flex, Text, Divider, Heading, Box } from '@chakra-ui/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface ModuleCardProps {
  name?: string;
  description?: string;
  openTransition?: boolean;
  extraArea?: React.ReactNode;
  onClick?: () => void;
}

const ModuleCard = chakra(
  ({
    name,
    description,
    openTransition,
    extraArea,
    onClick,
    ...rest
  }: ModuleCardProps) => {
    const transition = openTransition ? 'transform 250ms' : 'none';
    const hoverTransform = openTransition ? 'translateY(-10px)' : 'none';
    const cursor = openTransition ? 'pointer' : 'default';

    return (
      <Flex
        direction={'column'}
        borderRadius={'16px'}
        bg={'#F0F3F6'}
        p={6}
        cursor={cursor}
        // boxShadow="rgba(0, 0, 0, 0.05) 0px 10px 20px"
        transition={transition}
        _hover={{ transform: hoverTransform }}
        zIndex={2}
        onClick={onClick}
        {...rest}
      >
        <Box>
          {name && (
            <>
              <Heading
                className={inter.className}
                size="md"
                textTransform="capitalize"
                minH={16}
              >
                {name}
              </Heading>

              <Divider color={'#0000001A'} mb={6} />
            </>
          )}

          {description && (
            <Text fontSize={'14px'} color={'#00000066'}>
              Description: {description}
            </Text>
          )}
        </Box>

        {extraArea}
      </Flex>
    );
  },
);

export default ModuleCard;
