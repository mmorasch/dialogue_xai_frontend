FROM node:20-alpine3.17
ADD . /app
WORKDIR /app
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview", "--host"]