let fs = require('fs');
let express = require('express');
let db = require("../db");
let router = express.Router();
let { v4: uuidv4 } = require('uuid');

function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    })
}

/* GET index page */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'PhotoGallery', version: "0.1.0"});
});

/* POST new image */
router.post('/new', async function (req, res, next) {
    console.log('Request fields:', req.body);
    console.log('Request files:', Object.getOwnPropertyNames(req.files));

    if (!req.files['image']) {
        res.sendStatus(400).send('image required');
        return;
    }

    const extension = "." + req.files['image'].path.split('.')[1];
    const fileName = uuidv4() + extension;
    const imageDataString = await streamToString(req.files['image']);

    const dir = './public/images';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    await fs.writeFileSync('./public/images/' + fileName, imageDataString);

    try {
        const query = 'INSERT INTO data (name, description, author, path) VALUES (?, ?, ?, ?)';
        const values = [
            req.body.name || null,
            req.body.description || null,
            req.body.author || null,
            fileName
        ];

        db.connection.query(query, values, (err, rows) => {
            if (err) throw err;

            console.log(rows);
        });
    } catch (err) {
        res.sendStatus(500).send(err.toString());
        return;
    }

    res.send(fileName);
});

/* GET all images */
router.get('/all', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const query = 'SELECT * FROM data ORDER BY id DESC LIMIT ? OFFSET ?';
    db.connection.query(query, [limit, offset], (err, rows) => {
        if (err) {
            console.error('DB error:', err);
            return res.status(500).send('Database error');
        }
        res.json(rows);
    });
});

/* GET /stats — аналитика проекта */
router.get('/stats', (req, res) => {
    const queries = {
        totalImages: 'SELECT COUNT(*) AS total_images FROM data',
        avgPerAuthor: `
      SELECT AVG(author_count) AS avg_images_per_author FROM (
        SELECT COUNT(*) AS author_count FROM data GROUP BY author
      ) AS counts
    `,
        last24h: `
      SELECT COUNT(*) AS images_last_24h FROM data 
      WHERE date >= NOW() - INTERVAL 1 DAY
    `,
        topAuthor: `
      SELECT author, COUNT(*) AS total FROM data
      GROUP BY author ORDER BY total DESC LIMIT 1
    `,
        latestUploads: `
      SELECT name, path, author, date FROM data
      ORDER BY date DESC LIMIT 5
    `
    };

    db.connection.query(queries.totalImages, (err, totalResult) => {
        if (err) return res.status(500).send('Database error');

        const totalImages = totalResult[0].total_images;

        db.connection.query(queries.avgPerAuthor, (err, avgResult) => {
            if (err) return res.status(500).send('Database error');

            const avgImagesPerAuthor = parseFloat(avgResult[0].avg_images_per_author || 0);

            db.connection.query(queries.last24h, (err, last24hResult) => {
                if (err) return res.status(500).send('Database error');

                const imagesLast24h = last24hResult[0].images_last_24h;

                db.connection.query(queries.topAuthor, (err, topAuthorResult) => {
                    if (err) return res.status(500).send('Database error');

                    const topAuthor = topAuthorResult[0] || { author: null, total: 0 };

                    db.connection.query(queries.latestUploads, (err, latestResult) => {
                        if (err) return res.status(500).send('Database error');

                        res.json({
                            total_images: totalImages,
                            avg_images_per_author: avgImagesPerAuthor,
                            images_last_24h: imagesLast24h,
                            top_author: topAuthor,
                            latest_uploads: latestResult
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
