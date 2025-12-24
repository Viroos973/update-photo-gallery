const request = require('supertest');
const path = require('path');
const fs = require('fs');

jest.mock('../db'); // <-- мок БД

const app = require('../app');

describe('PhotoGallery API', () => {

    // создаём папку для изображений перед тестами
    beforeAll(() => {
        const dir = path.join(__dirname, '../public/images');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    test('GET / should return index page', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('PhotoGallery');
        expect(res.text).toContain('0.1.0');
    });

    test('GET /all should return list of images', async () => {
        const res = await request(app).get('/all');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('name');
    });

    test('POST /new should upload image', async () => {
        const res = await request(app)
            .post('/new')
            .field('name', 'Test image')
            .field('description', 'Uploaded via test')
            .field('author', 'Jest')
            .attach('image', path.join(__dirname, 'test-image.jpg'));

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/\.jpg|\.png/);
    });

});
