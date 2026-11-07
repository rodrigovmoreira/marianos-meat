import { Box, Heading, Input, Textarea, Button, VStack, Field, Text } from "@chakra-ui/react";
import { useState } from "react";
import { api, getApiErrorMessage } from "../lib/api";

export default function AdminEditor() {
  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [status, setStatus] = useState({ loading: false, message: "", type: "" });

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, message: "Salvando...", type: "info" });

    try {
      // `api` já injeta o token do Squamata-Login no header Authorization.
      await api.post("/posts", { titulo, resumo, conteudo });

      setStatus({ loading: false, message: "✅ Publicação criada com sucesso!", type: "success" });
      // Limpa o formulário
      setTitulo(""); setResumo(""); setConteudo("");
    } catch (error) {
      setStatus({ loading: false, message: `❌ ${getApiErrorMessage(error, "Erro ao salvar publicação.")}`, type: "error" });
    }
  };

  return (
    <Box w="full" maxW="2xl">
      <Heading mb={2} color="red.500">Editor Rápido de Publicações</Heading>
      <Text mb={6} color="gray.400" fontSize="sm">
        A publicação entra no ar imediatamente após salvar.
      </Text>
      
      {status.message && (
        <Text mb={4} color={status.type === "error" ? "red.400" : "green.400"} fontWeight="bold">
          {status.message}
        </Text>
      )}

      <form onSubmit={handleSalvar}>
        <VStack gap={4} align="stretch">
          <Field.Root>
            <Field.Label color="gray.300">Título do Artigo</Field.Label>
            <Input bg="gray.900" border="1px solid" borderColor="gray.700" value={titulo} onChange={(e) => setTitulo(e.target.value)} required disabled={status.loading} />
          </Field.Root>

          <Field.Root>
            <Field.Label color="gray.300">Resumo (Aparece no Card)</Field.Label>
            <Input bg="gray.900" border="1px solid" borderColor="gray.700" value={resumo} onChange={(e) => setResumo(e.target.value)} required disabled={status.loading} />
          </Field.Root>

          <Field.Root>
            <Field.Label color="gray.300">Conteúdo do Post</Field.Label>
            <Textarea rows={8} bg="gray.900" border="1px solid" borderColor="gray.700" value={conteudo} onChange={(e) => setConteudo(e.target.value)} required disabled={status.loading} />
          </Field.Root>

          <Button type="submit" colorPalette="red" mt={4} loading={status.loading}>
            Publicar no Blog
          </Button>
        </VStack>
      </form>
    </Box>
  );
}