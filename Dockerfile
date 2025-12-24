# Используем официальный Node.js образ
FROM node:20-alpine

# Рабочая директория в контейнере
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json (для ускорения сборки)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем весь проект
COPY . .

# Создаём папку для загруженных изображений
RUN mkdir -p public/images

# Экспонируем порт приложения
EXPOSE 3000

# Запуск приложения
CMD ["npm", "start"]
