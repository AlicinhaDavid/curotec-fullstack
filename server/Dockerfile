FROM node:20
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --omit=dev && \
    npx prisma generate

COPY dist ./dist
COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

EXPOSE 3001

CMD ["./entrypoint.sh"]
