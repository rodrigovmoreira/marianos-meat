import { BrowserRouter, Routes, Route, Link as RouterLink } from "react-router-dom"
import { Box, Button, Container, Heading, SimpleGrid, Text, Image, VStack, HStack, Link, IconButton, Separator, Stack } from "@chakra-ui/react"
import { FaInstagram, FaFacebook, FaWhatsapp, FaPhoneAlt, FaPaperPlane } from "react-icons/fa"

// Importando as Páginas
import Home from "./pages/Home"
import Blog from "./pages/Blog"
import PostView from "./pages/PostView"
import AdminEditor from "./pages/AdminEditor"

export default function App() {
  const handleOrder = (product: string) => {
    const message = product === "Contato geral"
      ? "Olá, quero comprar carnes de qualidade"
      : `Olá, vi no site e gostaria de pedir: ${product}`;
    window.open(`https://wa.me/5511962903775?text=${encodeURIComponent(message)}`, "_blank");
  }

  const navLinks = [
    { name: "Início", path: "/" },
    { name: "Carnes", path: "/Carnes" },
    { name: "Receitas", path: "/Receitas" },
    { name: "Blog", path: "/blog" },
    { name: "Contato", path: "/contato" }
  ];

  return (
    <BrowserRouter>
      <Box minH="100vh" bg="#813532ff">
        
        {/* ================= HEADER GLOBAL ================= */}
        <Box as="header" position="sticky" top={0} zIndex={50} bg="rgba(255, 255, 255, 0.9)" backdropFilter="blur(12px)" borderBottom="1px solid" borderColor="gray.100" shadow="sm" mb={8} transition="all 0.3s">
          <Container maxW="container.lg" py={{ base: 3, md: 4 }}>
            <HStack justify="space-between" align="center">
              
              <Link asChild _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
                <RouterLink to="/">
                  <Image src="/images/Marianos-meat-logo.png" h={{ base: "70px", md: "85px" }} alt="Mariano's Meat Logo" />
                </RouterLink>
              </Link>

              <HStack gap={8} display={{ base: "none", md: "flex" }}>
                {navLinks.map((link) => (
                  <Link key={link.name} asChild fontWeight="semibold" fontSize="sm" color="gray.600" textTransform="uppercase" letterSpacing="wider" _hover={{ color: "red.600", textDecoration: "none" }} transition="color 0.2s">
                    <RouterLink to={link.path}>{link.name}</RouterLink>
                  </Link>
                ))}
              </HStack>

              <HStack gap={4}>
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

                <Button colorPalette="green" size={{ base: "sm", md: "md" }} rounded="full" shadow="md" _hover={{ transform: "translateY(-2px)", shadow: "lg" }} transition="all 0.2s" onClick={() => handleOrder("Contato geral")}>
                  <FaWhatsapp />
                  <Text display={{ base: "none", md: "block" }}>Fazer Pedido</Text>
                </Button>
              </HStack>
            </HStack>
          </Container>
        </Box>

        {/* ================= ÁREA DINÂMICA (ROTAS) ================= */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<PostView />} />
          <Route path="/admin/blog" element={<AdminEditor />} />
        </Routes>

        {/* ================= FOOTER GLOBAL ================= */}
        <Box as="footer" bg="gray.950" color="gray.400" py={{ base: 12, md: 16 }} mt={10}>
          <Container maxW="container.lg">
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={10} mb={12}>
              <VStack align="start" gap={4}>
                <Heading size="md" color="white" fontWeight="bold">Mariano's Meat</Heading>
                <Text fontSize="sm" lineHeight="tall">Levando a tradição e a excelência dos melhores cortes diretamente para a sua mesa.</Text>
              </VStack>

              <VStack align="start" gap={4}>
                <Heading size="xs" color="white" textTransform="uppercase" letterSpacing="wider">Navegação</Heading>
                <VStack align="start" gap={2}>
                  {navLinks.map((link) => (
                    <Link key={link.name} asChild fontSize="sm" _hover={{ color: "red.500", textDecoration: "none" }}>
                      <RouterLink to={link.path}>{link.name}</RouterLink>
                    </Link>
                  ))}
                </VStack>
              </VStack>

              <VStack align="start" gap={4}>
                <Heading size="xs" color="white" textTransform="uppercase" letterSpacing="wider">Fale Conosco</Heading>
                <VStack align="start" gap={3}>
                  <HStack gap={3}><Box color="red.500"><FaPhoneAlt size="14px" /></Box><Text fontSize="sm">(11) 96290-3775</Text></HStack>
                  <HStack gap={3}><Box color="red.500"><FaPaperPlane size="14px" /></Box><Text fontSize="sm">contato@marianosmeat.com.br</Text></HStack>
                </VStack>
              </VStack>

              <VStack align="start" gap={4}>
                <Heading size="xs" color="white" textTransform="uppercase" letterSpacing="wider">Atendimento</Heading>
                <Text fontSize="sm">Seg a Sáb: 08h às 20h<br />Dom: 08h às 14h</Text>
              </VStack>
            </SimpleGrid>
            <Separator borderColor="whiteAlpha.200" mb={8} />
            <Stack direction={{ base: "column", md: "row" }} justify="space-between" align="center" fontSize="xs" color="gray.500">
              <Text>© 2026 Mariano's Meat. Todos os direitos reservados.</Text>
            </Stack>
          </Container>
        </Box>
      </Box>
    </BrowserRouter>
  )
}