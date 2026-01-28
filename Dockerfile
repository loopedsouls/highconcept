# High Concept Game - Dockerfile para EasyPanel
# Serve arquivos estáticos com Nginx

FROM nginx:alpine

# Metadados
LABEL maintainer="High Concept Game"
LABEL description="Jogo de sobrevivência burocrática distópica"

# Remove configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia arquivos do jogo
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

# Configuração customizada do nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Porta padrão
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Nginx em foreground
CMD ["nginx", "-g", "daemon off;"]
