const express= require('express');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

const ffmpeg = require('fluent-ffmpeg');
const fs = require("fs");
const OpenAI = require("openai");
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();

app.use('/videos', express.static(path.join(__dirname, 'videos'), { 
  setHeaders: (res, filePath) => {
      res.setHeader('Content-Type', 'video/mp4'); // Adjust the Content-Type as needed
  }
}));

app.use('/audios', express.static(path.join(__dirname, 'audios'), { 
  setHeaders: (res, filePath) => {
      res.setHeader('Content-Type', 'audio/mpeg'); // Adjust the Content-Type as needed
  }
}));

app.set('view engine','ejs');
app.use(fileUpload());
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/audios', express.static(path.join(__dirname, 'audios')));


app.get('/',async(req,res)=>{
    res.render('index');
})

app.post('/videoUpload',async(req,res)=>{
  ffmpeg.setFfmpegPath(ffmpegPath);
  const inputFilePath = req.files.video;
  const destinationPath='videos/'+inputFilePath.name;

  let filename = req.files.video.name.split('.')[0];

  inputFilePath.mv(destinationPath,async(err,res)=>{
    
  })


  const outputFilePath = 'audios/'+filename+'.mp3';
console.log(destinationPath);
  ffmpeg(destinationPath)
    .noVideo()
    .output(outputFilePath)
    .on('end', () => {
      
      const apiKey = "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";

      const openai = new OpenAI({ apiKey });
      
      async function main() {
        try {
          const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream("audios/"+filename+".mp3"),
            model: "whisper-1",
            response_format: "verbose_json",
            timestamp_granularities: ["segment"],
            timestamps: true  
          });

      let videoTag = "<video controls id='videoTag'><source id='videoSource' type='video/mp4' src=../"+destinationPath+">Your browser does not support the video tag.</video>";

      res.json({ videoTag: videoTag, audioPath: '../' + outputFilePath, transcription: transcription });

        } catch (error) {
          console.error("Error:", error.message);
        }
      }
      
      main();

    })
    .on('error', (err) => {
      console.error('Error:', err.message);
    })
    .run();

})


app.listen('9595')