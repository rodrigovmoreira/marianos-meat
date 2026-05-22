import { Box, Button, Container, Heading, SimpleGrid, Text, Image, VStack, HStack, Link } from "@chakra-ui/react"
import { FaPhoneAlt, FaPaperPlane, FaMapMarkerAlt, FaBookOpen } from "react-icons/fa"
import { Link as RouterLink } from "react-router-dom"

const products = [
  { id: 1, name: "Picanha", price: "R$ 89,90", img: "/images/picanha.png" },
  { id: 2, name: "Contrafilé", price: "R$ 64,90", img: "/images/contrafile.png" },
  { id: 3, name: "Linguiça Toscana", price: "R$ 24,90", img: "/images/linguica.png" },
]

const features = [
  { icon: FaPhoneAlt, title: "SAC", desc: "(11) 96290-3775" },
  { icon: FaPaperPlane, title: "Entrega", desc: "Consulte sua região" },
  { icon: FaMapMarkerAlt, title: "Localização", desc: "Veja no mapa" },
]

const recipes = [
  { title: "Picanha Invertida no Sal Grosso", time: "40 min" },
  { title: "Cupim Assado Lento", time: "4 horas" },
  { title: "Linguiça Recheada Especial", time: "30 min" },
]

const blogPosts = [
  { title: "Como escolher a picanha perfeita para o seu churrasco", date: "Abr 21, 2026" },
  { title: "5 Dicas de tempero para carnes bovinas", date: "Abr 18, 2026" },
  { title: "A importância da maturação da carne", date: "Abr 15, 2026" },
]

export default function Home() {
  const handleOrder = (product: string) => {
    const message = `Olá, vi no site e gostaria de pedir: ${product}`;
    window.open(`https://wa.me/5511962903775?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <Container maxW="container.lg" pb={10}>
      <VStack gap={12} align="stretch">

        {/* Seção de Serviços (SAC, Entrega, Local) */}
        <SimpleGrid columns={[1, 3]} gap={6}>
          {features.map((f, i) => (
            <HStack key={i} bg="white" p={4} borderRadius="lg" shadow="sm" align="center" gap={4}>
              <Box color="red.600" fontSize="2xl">
                <f.icon />
              </Box>
              <VStack align="start" gap={0}>
                <Text fontWeight="bold" color="gray.800">{f.title}</Text>
                <Text fontSize="sm" color="gray.600">{f.desc}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>

        {/* Produtos */}
        <VStack gap={8} align="stretch">
          <Heading size="3xl" textAlign="center" color="white">Produtos em Destaque</Heading>
          <SimpleGrid columns={[1, 2, 3]} gap={6}>
            {products.map((item) => (
              <Box key={item.id} bg="white" p={4} borderRadius="lg" shadow="md" _hover={{ transform: "scale(1.02)" }} transition="transform 0.2s">
                <Image src={item.img} borderRadius="md" mb={4} alt={item.name} h="200px" w="100%" objectFit="cover" />
                <Heading size="md" mb={2} color="gray.800">{item.name}</Heading>
                <Text fontSize="xl" fontWeight="bold" color="green.600" mb={4}>{item.price} <Text as="span" fontSize="sm" color="gray.500">/ 1kg</Text></Text>
                <Button width="100%" colorPalette="green" onClick={() => handleOrder(item.name)}>Peça agora</Button>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Seção Receitas */}
        <Box bg="white" p={8} borderRadius="lg" shadow="sm">
          <Heading size="lg" mb={6} color="gray.800">Receitas do Bruno Mariano</Heading>
          <SimpleGrid columns={[1, 3]} gap={6}>
            {recipes.map((recipe, i) => (
              <Box key={i} p={5} borderWidth="1px" borderRadius="md" shadow="sm" bg="gray.50">
                <Box color="red.500" fontSize="2xl" mb={3}>
                  <FaBookOpen />
                </Box>
                <Heading size="sm" mb={2} color="gray.800">{recipe.title}</Heading>
                <Text fontSize="sm" color="gray.500">Tempo de preparo: {recipe.time}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Seção Blog */}
        <Box bg="white" p={8} borderRadius="lg" shadow="sm">
          <Heading size="lg" mb={6} color="gray.800">Dicas e Notícias do Mundo Animal</Heading>
          <SimpleGrid columns={[1, 3]} gap={6}>
            {blogPosts.map((post, idx) => (
              <VStack key={idx} align="start" gap={2}>
                <Text color="gray.500" fontSize="sm">{post.date}</Text>
                <Text fontWeight="bold" fontSize="lg" color="gray.800">{post.title}</Text>
                <Link asChild color="red.600" fontWeight="bold">
                  <RouterLink to="/blog">Ler mais →</RouterLink>
                </Link>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>

      </VStack>
    </Container>
  )
}