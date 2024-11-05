# Usa a imagem oficial do Node.js como base
FROM node
# Define o diretório de trabalho
WORKDIR /app
# Copia os arquivos package.json e package-lock.json (caso exista) para otimizar o cache de dependências
COPY package.json package-lock.json ./
# Instala o Angular CLI versão 14 globalmente
RUN npm install -g @angular/cli@14
# Instala as dependências do projeto
RUN npm install
# Copia o restante dos arquivos para o contêiner
COPY . .
# Compila a aplicação Angular em modo de produção
RUN ng build --configuration=production
# Expõe a porta 80 para a aplicação em produção
EXPOSE 80
# Servidor HTTP para servir arquivos estáticos
RUN npm install -g http-server
# Comando padrão para iniciar o servidor HTTP na porta 80 com os arquivos de build
CMD ["http-server", "dist", "-p", "80"]
