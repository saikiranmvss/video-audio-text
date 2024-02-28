const express = require('express');
const getVideoCaptions = require('./getVideoCaptions');

const app = express();

app.use(express.static('public'));
app.get('/', async (req, res) => {
    const captions = await getVideoCaptions('test6.mp4'); // Replace with your video file
    res.render('index', { captions });
});

const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
