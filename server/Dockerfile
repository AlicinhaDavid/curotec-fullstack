FROM node:20
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --omit=dev && \
    npx prisma generate

COPY dist ./dist

EXPOSE 3001

CMD ["node", "dist/index.js"]
