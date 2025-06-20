# Etapa 1: Construcción de la aplicación React
FROM node:20.9.0-alpine AS build

WORKDIR /frontendAppML
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar el build al directorio de Nginx
COPY --from=build /frontendAppML/build /usr/share/nginx/html

# (Opcional) Si usas React Router, sobreescribe configuración NGINX para rutas
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto esperado por CapRover
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
