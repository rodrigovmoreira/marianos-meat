import { Box, Heading, Input, Textarea, Button, VStack, Field, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function AdminEditor() {
  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [status, setStatus] = useState({ loading: false, message: "", type: "" });

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, message: "Salvando...", type: "info" });

    try {
      // Usando a variável de ambiente do Vite!
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, resumo, conteudo })
      });

      if (response.ok) {
        setStatus({ loading: false, message: "✅ Publicação criada com sucesso!", type: "success" });
        // Limpa o formulário
        setTitulo(""); setResumo(""); setConteudo("");
      } else {
        setStatus({ loading: false, message: "❌ Erro ao salvar publicação.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, message: "❌ Falha na conexão com o servidor.", type: "error" });
    }
  };

  return (
    <Box p={8} bg="black" color="white" minH="100vh" maxW="2xl" mx="auto">
      <Heading mb={6} color="red.500">Editor Rápido de Publicações</Heading>
      
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