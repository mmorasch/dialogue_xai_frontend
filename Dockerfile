FROM node:20-alpine3.17
RUN npm install -g pnpm
ADD . /app
WORKDIR /app
RUN rm -rf node_modules
RUN pnpm install
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "run", "preview", "--host"]