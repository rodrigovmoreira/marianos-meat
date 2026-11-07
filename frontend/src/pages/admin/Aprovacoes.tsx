import { useEffect, useState } from 'react';
import { Box, Button, Center, HStack, Heading, SimpleGrid, Spinner, Stack, Text } from '@chakra-ui/react';

import { api, getApiErrorMessage } from '../../lib/api';

interface AdminRow {
  _id: string;
  email: string | null;
  nome: string | null;
  loginSubject: string | null;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  role: 'super_admin' | 'editor';
  createdAt: string;
}

const formatarData = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export default function Aprovacoes() {
  const [pendentes, setPendentes] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      try {
        const { data } = await api.get<{ pendentes: AdminRow[] }>('/admins/pendentes');
        if (!ativo) return;
        setPendentes(data.pendentes);
        setErro(null);
      } catch (error) {
        if (!ativo) return;
        setErro(getApiErrorMessage(error, 'Não foi possível carregar as solicitações pendentes.'));
      } finally {
        if (ativo) setLoading(false);
      }
    };

    void carregar();

    return () => {
      ativo = false;
    };
  }, [reloadKey]);

  const recarregar = () => {
    setLoading(true);
    setErro(null);
    setReloadKey((key) => key + 1);
  };

  const decidir = async (id: string, status: 'aprovado' | 'rejeitado') => {
    setProcessando(id);
    setErro(null);

    try {
      await api.patch(`/admins/${id}/status`, { status });
      setReloadKey((key) => key + 1);
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível atualizar o acesso.'));
    } finally {
      setProcessando(null);
    }
  };

  return (
    <Stack gap={6}>
      <HStack justify="space-between" align="flex-end" wrap="wrap" gap={3}>
        <Box>
          <Heading size="lg">Aprovações</Heading>
          <Text color="gray.400" fontSize="sm">
            Pessoas que já entraram pelo Squamata-Login e aguardam liberação de acesso.
          </Text>
        </Box>
        <Button variant="outline" size="sm" onClick={recarregar} loading={loading}>
          Atualizar
        </Button>
      </HStack>

      {erro && (
        <Box bg="red.900" borderWidth="1px" borderColor="red.700" rounded="md" p={4}>
          <Text fontSize="sm">{erro}</Text>
        </Box>
      )}

      {loading ? (
        <Center py={16}>
          <Spinner color="red.500" size="lg" />
        </Center>
      ) : pendentes.length === 0 ? (
        <Box bg="gray.900" borderWidth="1px" borderColor="gray.800" rounded="lg" p={8} textAlign="center">
          <Text color="gray.300">Nenhuma solicitação pendente no momento.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, xl: 2 }} gap={4}>
          {pendentes.map((admin) => (
            <Box key={admin._id} bg="gray.900" borderWidth="1px" borderColor="gray.800" rounded="lg" p={5}>
              <Stack gap={3}>
                <Box>
                  <Text fontWeight="semibold">{admin.nome ?? admin.email ?? admin.loginSubject}</Text>
                  <Text fontSize="sm" color="gray.400">
                    {admin.email ?? admin.loginSubject ?? 'sem e-mail no token'}
                  </Text>
                </Box>

                <Text fontSize="xs" color="gray.500">
                  Solicitado em {formatarData(admin.createdAt)}
                </Text>

                <HStack gap={2}>
                  <Button
                    size="sm"
                    colorPalette="green"
                    loading={processando === admin._id}
                    disabled={processando !== null && processando !== admin._id}
                    onClick={() => void decidir(admin._id, 'aprovado')}
                  >
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    colorPalette="red"
                    variant="outline"
                    loading={processando === admin._id}
                    disabled={processando !== null && processando !== admin._id}
                    onClick={() => void decidir(admin._id, 'rejeitado')}
                  >
                    Rejeitar
                  </Button>
                </HStack>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
