import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Center, Heading, Spinner, Stack, Text } from '@chakra-ui/react';

import { useAuth } from '../context/auth-context';
import { buildSsoLoginUrl } from '../lib/sso';

/**
 * Página de login do Mariano's Meat.
 * Não existe formulário local: a autenticação é delegada ao Squamata-Login (ADR 003).
 */
export default function Login() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/admin', { replace: true });
      return;
    }

    window.location.replace(buildSsoLoginUrl('/admin'));
  }, [token, navigate]);

  return (
    <Center minH="100vh" bg="gray.950" color="white" px={6}>
      <Stack gap={4} align="center">
        <Spinner size="xl" color="red.500" />
        <Heading size="md">Redirecionando para o login Squamata…</Heading>
        <Text color="gray.400" fontSize="sm" textAlign="center" maxW="md">
          A autenticação do ecossistema é centralizada no Squamata-Login. Você será trazido de volta ao painel
          automaticamente.
        </Text>
      </Stack>
    </Center>
  );
}
