module.exports = {
    connection: {
        query: jest.fn((sql, values, cb) => {
            // Если values не переданы (старый стиль вызова), смещаем аргументы
            if (typeof cb === 'undefined') {
                cb = values;
                values = [];
            }

            // Проверяем SELECT
            if (sql.toUpperCase().startsWith('SELECT')) {
                cb(null, [
                    {
                        id: 1,
                        name: 'Test',
                        description: 'Test desc',
                        author: 'Tester',
                        path: 'test.jpg'
                    }
                ]);
            } else {
                // Для всех остальных SQL просто возвращаем пустой массив
                cb(null, []);
            }
        }),
        connect: jest.fn()
    }
};
