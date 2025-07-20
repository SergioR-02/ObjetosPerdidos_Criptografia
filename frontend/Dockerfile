# Etapa de construcción
FROM node:18-alpine as build

WORKDIR /app

# Agregar ARGs para las variables de entorno de build
ARG VITE_RECAPTCHA_SITE_KEY
ARG VITE_API_BASE_URL

# Setear las variables de entorno para el build
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
