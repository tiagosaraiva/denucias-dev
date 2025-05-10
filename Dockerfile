# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for efficient caching
COPY package*.json ./

# Install dependencies and type definitions
RUN npm install --quiet && \
    npm install @radix-ui/react-select \
    npm install @radix-ui/react-dialog \
    tailwind-merge \
    npm install --save-dev @types/recharts

# Copy the application code
COPY . .

# Defina argumentos de build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Defina argumentos de build
ARG VITE_MSAL_TENANT_ID
ARG VITE_MSAL_CLIENT_ID

ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

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
FROM nginx:alpine

# Remove default nginx configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create necessary directories and set permissions
RUN mkdir -p /var/run/nginx && \
    chown -R nginx:nginx /var/run/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to nginx user
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
