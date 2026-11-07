import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Box, Button, Flex, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { FiEdit3, FiExternalLink, FiHome, FiLogOut, FiSettings, FiUserCheck } from 'react-icons/fi';

import { useAuth } from '../context/auth-context';

const links = [
  { label: 'Visão Geral', to: '/admin', icon: FiHome, end: true },
  { label: 'Aprovações', to: '/admin/aprovacoes', icon: FiUserCheck },
  { label: 'Blog', to: '/admin/blog', icon: FiEdit3 },
  { label: 'Configurações', to: '/admin/configuracoes', icon: FiSettings },
];

export default function AdminLayout() {
  const { user, access, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <Flex minH="100vh" bg="gray.950" color="white" direction={{ base: 'column', md: 'row' }}>
      <Box
        as="aside"
        w={{ base: 'full', md: '264px' }}
        bg="gray.900"
        borderRightWidth={{ base: 0, md: '1px' }}
        borderBottomWidth={{ base: '1px', md: 0 }}
        borderColor="gray.800"
        p={{ base: 4, md: 6 }}
      >
        <Stack gap={6} h="full">
          <Box>
            <Heading size="md" color="red.500">
              Mariano's Meat
            </Heading>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wider">
              Painel administrativo
            </Text>
          </Box>

          <Stack as="nav" gap={1}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: isActive ? '#fff' : '#a0aec0',
                  background: isActive ? 'rgba(229, 62, 62, 0.18)' : 'transparent',
                })}
              >
                <link.icon />
                {link.label}
              </NavLink>
            ))}
          </Stack>

          <Stack gap={3} mt="auto" borderTopWidth="1px" borderColor="gray.800" pt={4}>
            <Box>
              <Text fontSize="sm" fontWeight="semibold" lineClamp={1}>
                {user?.name ?? user?.email ?? 'Usuário'}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {access?.role === 'super_admin' ? 'Super Admin' : 'Editor'}
              </Text>
            </Box>

            <HStack gap={2}>
              <Button size="xs" variant="outline" onClick={() => navigate('/')}>
                <FiExternalLink />
                Ver site
              </Button>
              <Button size="xs" variant="ghost" colorPalette="red" onClick={handleSignOut}>
                <FiLogOut />
                Sair
              </Button>
            </HStack>
          </Stack>
        </Stack>
      </Box>

      <Box as="main" flex="1" p={{ base: 5, md: 10 }}>
        <Outlet />
      </Box>
    </Flex>
  );
}
