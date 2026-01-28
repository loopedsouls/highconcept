# High Concept Game - Dockerfile para EasyPanel
# Build multi-stage com Node + Nginx

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json
COPY package.json ./

# Instala dependências
RUN npm install

# Copia arquivos do projeto
COPY . .

# Executa build
RUN npm run build

# Stage 2: Serve com Nginx
FROM nginx:alpine

# Remove configuração padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia arquivos buildados
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
