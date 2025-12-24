import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 5,
    duration: '30s',
};

const BASE_URL = 'http://localhost:3000';

export default function () {

    // Относительный путь к файлу, который лежит рядом с этим скриптом
    const filePath = __ENV.TEST_IMAGE || './test-image.jpg';

    // POST multipart/form-data
    const payload = {
        name: 'Load test',
        description: 'Uploaded via k6',
        author: 'k6',
        // Простейший способ: указываем файл как объект
        image: http.file(filePath, 'test-image.jpg', 'image/jpeg'),
    };

    const res = http.post(`${BASE_URL}/new`, payload);

    check(res, {
        'upload status 200': (r) => r.status === 200,
    });
}
