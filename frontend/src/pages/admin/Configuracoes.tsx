import { Box, Heading, Stack, Text } from '@chakra-ui/react';

export default function Configuracoes() {
  return (
    <Stack gap={4}>
      <Box>
        <Heading size="lg">Configurações</Heading>
        <Text color="gray.400" fontSize="sm">
          Área reservada para tema, cores e ferramentas administrativas (roadmaps 3 e 4).
        </Text>
      </Box>

      <Box bg="gray.900" borderWidth="1px" borderColor="gray.800" rounded="lg" p={6}>
        <Text color="gray.300" fontSize="sm">
          Nada configurável por aqui ainda. Assim que os próximos roadmaps entrarem, as opções aparecem neste painel.
        </Text>
      </Box>
    </Stack>
  );
}
