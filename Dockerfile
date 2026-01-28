# High Concept Game - Dockerfile para EasyPanel
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove arquivos padrão
RUN rm -rf ./*

# Copia arquivos diretamente (sem build)
COPY index.html .
COPY css/ ./css/
COPY js/ ./js/

# Copia nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
