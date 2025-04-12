
# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for efficient caching
COPY package*.json ./

# Install dependencies - using npm install instead of npm ci to update lock file
RUN npm install --quiet

# Copy the application code
COPY . .

# Defina argumentos de build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Defina argumentos de build
ARG VITE_MSAL_TENANT_ID
ARG VITE_MSAL_CLIENT_ID

# Exponha como variáveis de ambiente
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

ENV VITE_MSAL_TENANT_ID=$VITE_MSAL_TENANT_ID
ENV VITE_MSAL_CLIENT_ID=$VITE_MSAL_CLIENT_ID


# Crie .env manualmente a partir dos argumentos
# Criação do .env com log no terminal
RUN echo "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" > .env && \
    echo "VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY" >> .env && \
    echo "VITE_MSAL_TENANT_ID=$VITE_MSAL_TENANT_ID" >> .env && \
    echo "VITE_MSAL_CLIENT_ID=$VITE_MSAL_CLIENT_ID" >> .env && \
    echo "📝 Conteúdo final do .env:" && \
    cat .env


# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Create directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /var/run \
    && chmod -R 755 /var/run

# Copy custom nginx config
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Make sure all files are owned by nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Switch to non-root nginx user
USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
