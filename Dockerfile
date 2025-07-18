# Etapa 1: Construcción de la aplicación React
FROM node:22.2.0-alpine AS build

WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar el build al directorio de Nginx
COPY --from=build /frontend/dist /usr/share/nginx/html

# (Opcional) Si usas React Router, sobreescribe configuración NGINX para rutas
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto esperado por CapRover
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



# Para desplegar en CapRover, asegúrate de que el puerto 80 esté expuesto
# y que la configuración de CapRover esté apuntando a este contenedor.

# docker build -t my-react-app .
# docker run -p 3080:80 my-react-app


# Para ver log en CapRover:
# docker service logs srv-captain--ml-agua-frontend --since 60m --follow