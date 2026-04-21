import {
  Box, Button, Container, Heading, SimpleGrid, Text, Image, VStack, HStack, Link, IconButton, Separator, Stack
} from "@chakra-ui/react"
import {
  FaInstagram, FaFacebook, FaWhatsapp, FaPhoneAlt, FaPaperPlane, FaMapMarkerAlt, FaBookOpen
} from "react-icons/fa"

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

function App() {
  const handleOrder = (product: string) => {
    // Se for contato geral, usa a mensagem específica pedida
    const message = product === "Contato geral"
      ? "olá, quero comprar carnes de qualidade"
      : `Olá, vi no site e gostaria de pedir: ${product}`;

    window.open(`https://wa.me/5511962903775?text=${encodeURIComponent(message)}`, "_blank");
  }

  const navLinks = ["Início", "Carnes", "Receitas", "Blog", "Contato"];

  return (
    <Box minH="100vh" bg="#813532ff">
      {/* Header Premium */}
      <Box 
        as="header" 
        position="sticky" 
        top={0} 
        zIndex={50} 
        bg="rgba(255, 255, 255, 0.9)" 
        backdropFilter="blur(12px)" 
        borderBottom="1px solid" 
        borderColor="gray.100"
        shadow="sm" 
        mb={8}
        transition="all 0.3s"
      >
        <Container maxW="container.lg" py={{ base: 3, md: 4 }}>
          <HStack justify="space-between" align="center">
            
            {/* Logo com interação */}
            <Link href="#" _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
              <Image 
                src="/images/Marianos-meat-logo.png" 
                h={{ base: "70px", md: "85px" }} 
                alt="Mariano's Meat Logo" 
              />
            </Link>

            {/* Navegação Desktop */}
            <HStack gap={8} display={{ base: "none", md: "flex" }}>
              {navLinks.map((link) => (
                <Link 
                  key={link} 
                  fontWeight="semibold" 
                  fontSize="sm"
                  color="gray.600"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  _hover={{ color: "red.600", textDecoration: "none" }}
                  transition="color 0.2s"
                >
                  {link}
                </Link>
              ))}
            </HStack>

            {/* Ações: Redes Sociais e Botão Principal (CTA) */}
            <HStack gap={4}>
              {/* Redes sociais ocultas em telas muito pequenas para focar no CTA */}
              <HStack gap={1} display={{ base: "none", sm: "flex" }}>
                <Link href="https://www.instagram.com/brugmariano/" target="_blank" rel="noopener noreferrer">
                  <IconButton aria-label="Instagram" variant="ghost" color="gray.500" _hover={{ color: "red.500", bg: "gray.50" }} rounded="full">
                    <FaInstagram />
                  </IconButton>
                </Link>
                <Link href="https://www.facebook.com/viviih.oliveira.1" target="_blank" rel="noopener noreferrer">
                  <IconButton aria-label="Facebook" variant="ghost" color="gray.500" _hover={{ color: "blue.500", bg: "gray.50" }} rounded="full">
                    <FaFacebook />
                  </IconButton>
                </Link>
              </HStack>

              {/* CTA Destacado */}
              <Button 
                colorPalette="green" 
                size={{ base: "sm", md: "md" }}
                rounded="full"
                shadow="md"
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.2s"
                onClick={() => handleOrder("Contato geral")}
              >
                <FaWhatsapp />
                <Text display={{ base: "none", md: "block" }}>
                  Fazer Pedido
                </Text>
              </Button>
            </HStack>

          </HStack>
        </Container>
      </Box>

      {/* Conteúdo Principal */}
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
                  <Text fontWeight="bold">{f.title}</Text>
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
                  <Heading size="md" mb={2}>{item.name}</Heading>
                  <Text fontSize="xl" fontWeight="bold" color="green.600" mb={4}>{item.price} <Text as="span" fontSize="sm" color="gray.500">/ 1kg</Text></Text>
                  <Button width="100%" colorPalette="green" onClick={() => handleOrder(item.name)}>Peça agora</Button>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Seção Receitas */}
          <Box bg="white" p={8} borderRadius="lg" shadow="sm">
            <Heading size="lg" mb={6}>Receitas do Bruno Mariano</Heading>
            <SimpleGrid columns={[1, 3]} gap={6}>
              {recipes.map((recipe, i) => (
                <Box key={i} p={5} borderWidth="1px" borderRadius="md" shadow="sm" bg="gray.50">
                  <Box color="red.500" fontSize="2xl" mb={3}>
                    <FaBookOpen />
                  </Box>
                  <Heading size="sm" mb={2}>{recipe.title}</Heading>
                  <Text fontSize="sm" color="gray.500">Tempo de preparo: {recipe.time}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Seção Blog */}
          <Box bg="white" p={8} borderRadius="lg" shadow="sm">
            <Heading size="lg" mb={6}>Dicas e Notícias do Mundo Animal</Heading>
            <SimpleGrid columns={[1, 3]} gap={6}>
              {blogPosts.map((post, idx) => (
                <VStack key={idx} align="start" gap={2}>
                  <Text color="gray.500" fontSize="sm">{post.date}</Text>
                  <Text fontWeight="bold" fontSize="lg">{post.title}</Text>
                  <Link color="red.600" fontWeight="bold">Ler mais →</Link>
                </VStack>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>

      {/* Footer */}
      <Box as="footer" bg="gray.950" color="gray.400" py={{ base: 12, md: 16 }}>
        <Container maxW="container.lg">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={10} mb={12}>

            {/* Coluna 1: Branding & Missão */}
            <VStack align="start" gap={4}>
              <Heading size="md" color="white" fontWeight="bold">
                Mariano's Meat
              </Heading>
              <Text fontSize="sm" lineHeight="tall">
                Levando a tradição e a excelência dos melhores cortes diretamente para a sua mesa. Qualidade premium para o seu churrasco.
              </Text>
              <HStack gap={4}>
                <Link href="https://www.instagram.com/brugmariano/" target="_blank" rel="noopener noreferrer" _hover={{ color: "red.500" }}>
                  <FaInstagram size="20px" />
                </Link>
                <Link href="https://www.facebook.com/viviih.oliveira.1" target="_blank" rel="noopener noreferrer" _hover={{ color: "blue.400" }}>
                  <FaFacebook size="20px" />
                </Link>
                <Link onClick={() => handleOrder("Contato geral")} cursor="pointer" _hover={{ color: "green.400" }}>
                  <FaWhatsapp size="20px" />
                </Link>
              </HStack>
            </VStack>

            {/* Coluna 2: Navegação */}
            <VStack align="start" gap={4}>
              <Heading size="xs" color="white" textTransform="uppercase" letterSpacing="wider">
                Explorar
              </Heading>
              <VStack align="start" gap={2}>
                {navLinks.map((link) => (
                  <Link
                    key={link}
                    fontSize="sm"
                    _hover={{ color: "red.500", textDecoration: "none" }}
                    transition="color 0.2s"
                  >
                    {link}
                  </Link>
                ))}
              </VStack>
            </VStack>

            {/* Coluna 3: Contato Profissional */}
            <VStack align="start" gap={4}>
              <Heading size="xs" color="white" textTransform="uppercase" letterSpacing="wider">
                Fale Conosco
              </Heading>
              <VStack align="start" gap={3}>
                <HStack gap={3}>
                  <Box color="red.500"><FaPhoneAlt size="14px" /></Box>
                  <Text fontSize="sm">(11) 96290-3775</Text>
                </HStack>
                <HStack gap={3}>
                  <Box color="red.500"><FaPaperPlane size="14px" /></Box>
                  <Text fontSize="sm">contato@marianosmeat.com.br</Text>
                </HStack>
              </VStack>
            </VStack>

            {/* Coluna 4: Localização/Horário */}
            <VStack align="start" gap={4}>
              <Heading size="xs" color="white" textTransform="uppercase" letterSpacing="wider">
                Atendimento
              </Heading>
              <Text fontSize="sm">
                Segunda a Sábado: 08h às 20h<br />
                Domingo: 08h às 14h
              </Text>
              <HStack gap={3} color="red.500" fontWeight="bold" fontSize="sm">
                <FaMapMarkerAlt />
                <Link _hover={{ color: "white" }}>Ver no Mapa</Link>
              </HStack>
            </VStack>

          </SimpleGrid>

          <Separator borderColor="whiteAlpha.200" mb={8} />

          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            fontSize="xs"
            color="gray.500"
          >
            <Text>© 2026 Mariano's Meat. Todos os direitos reservados.</Text>
            <HStack gap={6}>
              <Link _hover={{ color: "white" }}>Privacidade</Link>
              <Link _hover={{ color: "white" }}>Termos de Uso</Link>
            </HStack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default App