import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Button, Center, Heading, Spinner, Stack, Text } from '@chakra-ui/react';

import { useAuth } from '../context/auth-context';
import { getApiErrorMessage, requestAccess } from '../lib/api';

const FullScreen = ({ children }: { children: ReactNode }) => (
  <Center minH="100vh" bg="gray.950" color="white" px={6}>
    <Box maxW="lg" w="full" textAlign="center">
      {children}
    </Box>
  </Center>
);

interface StatusScreenProps {
  title: string;
  description: string;
  action?: ReactNode;
}

const StatusScreen = ({ title, description, action }: StatusScreenProps) => (
  <FullScreen>
    <Stack gap={4} align="center">
      <Heading size="lg">{title}</Heading>
      <Text color="gray.300">{description}</Text>
      {action}
    </Stack>
  </FullScreen>
);

/**
 * Cenário "token válido, sem cadastro": registra a solicitação automaticamente
 * (a rota é idempotente no backend) e recarrega o estado.
 */
const SolicitarAcesso = () => {
  const { refresh } = useAuth();
  const [state, setState] = useState<'enviando' | 'erro'>('enviando');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    const solicitar = async () => {
      try {
        await requestAccess();
        if (!ativo) return;
        await refresh();
      } catch (error) {
        if (!ativo) return;
        setState('erro');
        setMessage(getApiErrorMessage(error, 'Não foi possível registrar sua solicitação de acesso.'));
      }
    };

    void solicitar();

    return () => {
      ativo = false;
    };
  }, [refresh]);

  if (state === 'erro') {
    return <StatusScreen title="Não foi possível solicitar acesso" description={message ?? ''} />;
  }

  return (
    <FullScreen>
      <Stack gap={4} align="center">
        <Spinner size="xl" color="red.500" />
        <Heading size="md">Registrando sua solicitação de acesso…</Heading>
        <Text color="gray.400" fontSize="sm">
          Você será avisado assim que um administrador aprovar seu acesso.
        </Text>
      </Stack>
    </FullScreen>
  );
};

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Barreira das rotas administrativas. Cenários:
 * 1. sem token      → /login (que redireciona para o SSO)
 * 2. sem cadastro   → solicitação automática → tela de análise
 * 3. pendente       → tela de análise
 * 4. rejeitado      → tela de contato
 * 5. desativado     → tela de conta inativa
 * 6. aprovado       → painel
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { token, access, loading, error, refresh } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <FullScreen>
        <Stack gap={4} align="center">
          <Spinner size="xl" color="red.500" />
          <Text color="gray.400">Validando seu acesso…</Text>
        </Stack>
      </FullScreen>
    );
  }

  if (error) {
    return (
      <StatusScreen
        title="Falha ao validar seu acesso"
        description={error}
        action={<Button colorPalette="red" onClick={() => void refresh()}>Tentar novamente</Button>}
      />
    );
  }

  if (!access) return <Navigate to="/login" replace />;

  if (!access.registered) return <SolicitarAcesso />;

  if (access.isActive === false) {
    return (
      <StatusScreen
        title="Sua conta está desativada"
        description="Fale com o administrador do Mariano's Meat para reativar o acesso."
      />
    );
  }

  if (access.status === 'pendente') {
    return (
      <StatusScreen
        title="Seu acesso está em análise"
        description="A solicitação foi enviada e aguarda aprovação de um administrador."
        action={
          <Button variant="outline" onClick={() => void refresh()}>
            Atualizar status
          </Button>
        }
      />
    );
  }

  if (access.status === 'rejeitado') {
    return (
      <StatusScreen
        title="Solicitação não aprovada"
        description="Seu pedido de acesso foi recusado. Se acredita que houve um engano, entre em contato com a equipe."
      />
    );
  }

  if (!access.canAccessPanel) {
    return (
      <StatusScreen
        title="Acesso ainda não liberado"
        description="Seu usuário não tem permissão para acessar o painel administrativo."
      />
    );
  }

  return <>{children}</>;
}
