# Usa uma imagem oficial e super leve do Node.js
FROM node:20-alpine

# Define a pasta de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependência ANTES do código fonte
# (Isso otimiza o build: o Docker só reinstala os pacotes se o package.json mudar)
COPY package*.json ./

# Instala as bibliotecas (Express, Mongoose, Cors)
RUN npm install

# Agora copia o restante do código (o server.js)
COPY . .

# Expõe a porta que configuramos no server.js
EXPOSE 3000

# O comando que o container vai rodar ao iniciar
CMD ["node", "server.js"]