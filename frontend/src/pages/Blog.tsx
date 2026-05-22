import { Box, Heading, SimpleGrid, Text, Card, Button, Spinner, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Tipagem para ajudar o TypeScript a entender nosso dado
interface Post {
  _id: string;
  titulo: string;
  slug: string;
  resumo: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPosts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/posts`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPosts();
  }, []);

  return (
    <Box p={8} bg="black" color="white" minH="100vh">
      <Heading mb={6} borderBottom="2px solid" borderColor="red.600" pb={2}>
        Blog Mariano's Meat
      </Heading>
      
      {loading ? (
        <Center py={10}><Spinner color="red.500" size="xl" /></Center>
      ) : posts.length === 0 ? (
        <Text color="gray.400">Nenhuma publicação encontrada. Crie a primeira no painel!</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {posts.map((post) => (
            <Card.Root key={post._id} bg="gray.950" border="1px solid" borderColor="gray.800">
              <Card.Body gap="2">
                <Card.Title color="white">{post.titulo}</Card.Title>
                <Card.Description color="gray.400">{post.resumo}</Card.Description>
              </Card.Body>
              <Card.Footer display="flex" justifyContent="flex-end">
                <Button asChild size="sm" variant="outline" colorPalette="red">
                  <Link to={`/blog/${post.slug}`}>Ler Publicação</Link>
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}