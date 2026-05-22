import { Box, Heading, Text, Button, Spinner, Center } from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Post {
  titulo: string;
  conteudo: string;
  dataCriacao: string;
}

export default function PostView() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarPost = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/posts/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } catch (error) {
        console.error("Erro ao buscar o post:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarPost();
  }, [slug]);

  if (loading) return <Center h="100vh" bg="black"><Spinner color="red.500" size="xl" /></Center>;
  
  if (!post) return (
    <Box p={8} bg="black" color="white" minH="100vh" textAlign="center">
      <Heading>Post não encontrado 🥩</Heading>
      <Button asChild mt={4} colorPalette="red"><Link to="/blog">Voltar</Link></Button>
    </Box>
  );

  return (
    <Box p={8} bg="black" color="white" minH="100vh">
      <Box maxW="4xl" mx="auto">
        <Button asChild size="sm" variant="ghost" mb={6}>
          <Link to="/blog">← Voltar para o Blog</Link>
        </Button>
        
        <Heading size="2xl" mb={2} color="red.500">{post.titulo}</Heading>
        <Text color="gray.500" fontSize="sm" mb={8}>
          Publicado em: {new Date(post.dataCriacao).toLocaleDateString('pt-BR')}
        </Text>

        <Text color="gray.300" fontSize="lg" lineHeight="tall" whiteSpace="pre-wrap">
          {post.conteudo}
        </Text>
      </Box>
    </Box>
  );
}