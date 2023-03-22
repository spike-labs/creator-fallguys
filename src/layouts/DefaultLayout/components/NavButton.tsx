import { As, Button, ButtonProps, HStack, Icon, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface NavButtonProps extends ButtonProps {
  icon: As;
  label: string;
  href: string;
}

const NavButton = (props: NavButtonProps) => {
  const { icon, label, href, ...buttonProps } = props;

  const router = useRouter();

  return (
    <Button
      variant="ghost"
      justifyContent="start"
      {...buttonProps}
      color="#A6ABC8"
      _active={{ color: '#000000', backgroundColor: '#0000000F' }}
      _hover={{ backgroundColor: '#0000000F' }}
      onClick={() => router.push(href)}
      isActive={router.pathname.split('/')[1] === href.split('/')[1]}
    >
      <HStack spacing="3" pr={10}>
        <Icon as={icon} boxSize="6" />
        <Text>{label}</Text>
      </HStack>
    </Button>
  );
};

export default NavButton;
