FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY .env .env

# 각각 스키마를 지정해서 prisma generate 실행
RUN npx prisma generate --schema=./prisma-user/schema.prisma
RUN npx prisma generate --schema=./prisma-log/schema.prisma

RUN npm run build

CMD ["npm", "start"]
