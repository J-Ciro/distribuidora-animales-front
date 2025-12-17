# Multistage Dockerfile para construir y servir el frontend React
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json y package-lock.json para aprovechar cache
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copiar el resto del código y construir
COPY . .
RUN npm run build

# Servir con nginx en etapa final
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
