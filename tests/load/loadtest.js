import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 10 },   // прогрев
        { duration: '1m', target: 50 },    // рабочая нагрузка
        { duration: '30s', target: 100 },  // пик
        { duration: '30s', target: 0 },    // спад
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% < 500ms
        http_req_failed: ['rate<0.01'],   // <1% ошибок
    },
};

const BASE_URL = 'http://localhost:3000';

export default function () {

    // GET /
    let res1 = http.get(`${BASE_URL}/`);
    check(res1, {
        'GET / status 200': (r) => r.status === 200,
    });

    // GET /all
    let res2 = http.get(`${BASE_URL}/all`);
    check(res2, {
        'GET /all status 200': (r) => r.status === 200,
    });

    sleep(1);
}
