FROM node:20-alpine

WORKDIR /usr/src/app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código (inclui prisma/schema.prisma)
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]