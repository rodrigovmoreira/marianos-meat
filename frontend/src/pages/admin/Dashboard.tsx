import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import { useAuth } from '../../context/auth-context';
import { api } from '../../lib/api';

const Card = ({ titulo, valor, descricao }: { titulo: string; valor: string; descricao: string }) => (
  <Box bg="gray.900" borderWidth="1px" borderColor="gray.800" rounded="lg" p={5}>
    <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wider">
      {titulo}
    </Text>
    <Text fontSize="2xl" fontWeight="bold" mt={1}>
      {valor}
    </Text>
    <Text fontSize="sm" color="gray.400" mt={1}>
      {descricao}
    </Text>
  </Box>
);

export default function AdminDashboard() {
  const { user, access } = useAuth();
  const navigate = useNavigate();
  const [pendentes, setPendentes] = useState<string>('—');

  useEffect(() => {
    // O total de pendentes é exclusivo do super admin; editor apenas não vê o cartão.
    if (access?.role !== 'super_admin') return;

    let ativo = true;

    const carregar = async () => {
      try {
        const { data } = await api.get<{ pendentes: unknown[] }>('/admins/pendentes');
        if (ativo) setPendentes(String(data.pendentes.length));
      } catch {
        if (ativo) setPendentes('—');
      }
    };

    void carregar();

    return () => {
      ativo = false;
    };
  }, [access?.role]);

  return (
    <Stack gap={8}>
      <Box>
        <Heading size="lg">Visão geral</Heading>
        <Text color="gray.400" fontSize="sm">
          Bem-vindo, {user?.name ?? user?.email ?? 'usuário'}.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Card
          titulo="Seu perfil"
          valor={access?.role === 'super_admin' ? 'Super Admin' : 'Editor'}
          descricao="Papel definido pelo administrador do tenant."
        />
        {access?.role === 'super_admin' && (
          <Card titulo="Aguardando aprovação" valor={pendentes} descricao="Solicitações na fila de acesso." />
        )}
        <Card titulo="Blog" valor="Publicações" descricao="Crie e revise os artigos do site." />
      </SimpleGrid>

      <Stack direction={{ base: 'column', sm: 'row' }} gap={3}>
        {access?.role === 'super_admin' && (
          <Button colorPalette="red" onClick={() => navigate('/admin/aprovacoes')}>
            Gerenciar aprovações
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate('/admin/blog')}>
          Criar publicação
        </Button>
      </Stack>
    </Stack>
  );
}
