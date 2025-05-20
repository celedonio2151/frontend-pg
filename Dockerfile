# Etapa 1: Construcción de la aplicación en Node
FROM node:20.9.0-alpine AS build

# Establece el directorio de trabajo
WORKDIR /frontendAppML

# Copia el archivo package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código de la aplicación en el contenedor
COPY . .

# Construye la aplicación de React
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia el build de la etapa anterior al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 5173
EXPOSE 5173

# Sobrescribe el archivo de configuración por defecto de Nginx para escuchar en el puerto 5173
RUN sed -i 's/listen       80;/listen       5173;/g' /etc/nginx/conf.d/default.conf

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
