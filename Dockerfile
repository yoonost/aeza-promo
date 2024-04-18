FROM node:18-alpine
WORKDIR /home
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8235
CMD [ "node", "build/main" ]