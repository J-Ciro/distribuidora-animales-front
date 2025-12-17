# Multistage Dockerfile para construir y servir el frontend React
FROM node:20-alpine AS build
WORKDIR /app

# Recibe la URL del API desde docker-compose (build args)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copiar dependencias primero para cache
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copiar código y compilar
COPY . .
RUN npm run build

# Servir con nginx
FROM nginx:stable-alpine
# Config para SPA (evitar 404 al refrescar rutas como /registro)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
