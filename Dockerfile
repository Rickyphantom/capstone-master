FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 📌 prisma generate를 빌드 직전에 한 번 더
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npm run build

CMD ["npm", "start"]
