# Imagen base de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para compilar)
RUN npm ci

# Copiar código fuente
COPY . .

# Crear directorio de uploads si no existe
RUN mkdir -p src/uploads

# Compilar TypeScript
RUN npm run build

# Remover devDependencies después de compilar
RUN npm prune --production

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
