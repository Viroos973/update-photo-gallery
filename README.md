# PhotoGallery

Простое веб-приложение-фотогалерея на NodeJS с поддержкой загрузки изображений и просмотра всех фото.

## Стек технологий

- NodeJS (Express)
- MySQL
- Pug (шаблонизатор)
- express-form-data (для загрузки файлов)
- Jest + Supertest (юнит-тесты)
- k6 (нагрузочные тесты)

## Структура проекта

````
node-app/
├── app.js # Основная конфигурация Express
├── bin/
│ └── www # Скрипт запуска сервера
├── routes/
│ └── index.js # Основные роуты
├── public/
│ └── images/ # Загруженные изображения
├── views/
│ └── index.pug # Главная страница
├── db.js # Настройки БД
├── tests/
│ ├── index.test.js
│ └── load/
│   ├── loadtest.js
│   ├── upload-test.js
│   └── test-image.jpg
| └── test-image.jpg
├── package.json
└── README.md
````


## Локальный запуск

*Примеры команд указаны для Windows PowerShell. Для Linux/macOS используйте аналоги.*

1. Ставим БД MySQL (любой версии) для своей ОС (тык), запускаем и проверяем работоспособность
2. Устанавливаем npm и nodejs (hard way)
3. ... или ставим триалку WebStorm, которая сама поставит всё необходимое (easy way)
4. Меняем креды в файле db.js, чтобы они соответствовали вашим 
5. Загоняем в БД скрипт init.sql для создания таблиц по умолчанию
6. Создайте папку для хранения изображений 
7. Ставим зависимости командой  $ npm install
8. Запускаем приложение командой  $ npm start

## API

1. Главная страница
   - GET /
      - Возвращает HTML-страницу с названием PhotoGallery и версией.
2. Получение всех изображений
   - GET /all
     - Возвращает JSON массив всех загруженных изображений.
     ```json
     [
        {
            "id": 1,
            "name": "Sunset",
            "description": "Nice view",
            "author": "Alex",
            "path": "uuid.jpg"
        }
     ]
     ```
3. Загрузка нового изображения
    - POST /new
        - Content-Type: multipart/form-data
        - | Поле        | Тип  | Описание                      |
          | ----------- | ---- | ----------------------------- |
          | image       | File | Файл изображения (.jpg, .png) |
          | name        | Text | Название изображения          |
          | description | Text | Описание изображения          |
          | author      | Text | Автор изображения             |
        - Ответ: имя сохранённого файла (```<uuid>```.jpg)
        - Ошибки:
            - 400 — если поле image отсутствует
            - 500 — внутренняя ошибка сервера или БД

      4. Получение всей статистики
          - GET /stats
              - Возвращает JSON со всей статистикой по проекту
            ```json
            {
              "total_images": 42,
              "avg_images_per_author": 3.5,
              "images_last_24h": 7,
              "top_author": {
                  "author": "Alice",
                  "total": 10
              },
              "latest_uploads": [
                   {
                       "name": "Photo 1",
                       "path": "abc.jpg",
                       "author": "Bob",
                       "created_at": "2025-12-24T12:34:56Z" 
                   }
              ]
            }
            ```

## Тестирование

1. Юнит-тесты (Jest + Supertest)
    - ```powershell
      npm test
      ```
    - Проверяются:
        - GET ```/``` возвращает HTML
        - GET ```/all``` возвращает JSON
        - POST ```/new``` загружает файл и возвращает имя

2. Нагрузочные тесты (k6)
    - GET нагрузка:
        - ```powershell
          k6 run tests\load\loadtest.js
          ```
    - POST нагрузка (Windows-совместимая):
        - ```powershell
          k6 run tests\load\upload-test.js
          ```
    - Собираются метрики:
        - RPS (requests per second)
        - Latency (p95, p99)
        - Error rate

## Дополнительно

API доступен по адресу http://localhost:3000