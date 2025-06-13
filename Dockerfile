# Estágio 1: Build da aplicação Angular
FROM node:18-slim AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala o Angular CLI e as dependências do projeto
RUN npm install -g @angular/cli@14.0.7
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Compila a aplicação para produção
RUN ng build --configuration production

# Estágio 2: Servir a aplicação com Nginx
FROM nginx:stable-alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o arquivo de configuração customizado (que vamos criar a seguir)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados da aplicação do estágio de build
COPY --from=build /app/dist/diaria /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
