const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const stream = require('stream');
const util = require('util');

const pipeline = util.promisify(stream.pipeline);

const getVideoCaptions = async (videoPath) => {
    const readStream = fs.createReadStream(videoPath);
    let chunkNumber = 0;

    for await (const chunk of readStream) {
        const formData = new FormData();
        formData.append('images', chunk, {
            filename: `video_chunk_${chunkNumber}.mp4`,
            contentType: 'video/mp4'
        });

        try {
            const response = await axios.post('https://api.openai.com/v1/visual-captions', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer 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`,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });

            console.log(`Chunk ${chunkNumber} captions:`, response.data);
        } catch (error) {
            console.error(`Error getting captions for chunk ${chunkNumber}:`, error);
        }

        chunkNumber++;
    }
};

module.exports = getVideoCaptions;
