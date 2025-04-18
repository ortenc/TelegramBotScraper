const ffmpeg = require('fluent-ffmpeg');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/videoProcessing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a schema for logging video processing details
const videoSchema = new mongoose.Schema({
  originalFile: String,
  outputFile: String,
  processingOptions: Object,
  metadata: Object,
  status: String,
  timestamp: { type: Date, default: Date.now }
});

const VideoLog = mongoose.model('VideoLog', videoSchema);

// Function to process video
const processVideo = (inputFile, outputFile, options) => {
  return new Promise((resolve, reject) => {
    let ffmpegCommand = ffmpeg(inputFile);

    // Apply processing options if provided
    if (options.resize) {
      ffmpegCommand = ffmpegCommand.size(options.resize);
    }

    if (options.crop) {
      ffmpegCommand = ffmpegCommand.crop(options.crop);
    }

    if (options.metadata) {
      ffmpegCommand = ffmpegCommand.outputOptions([
        `-metadata title=${options.metadata.title}`,
        `-metadata author=${options.metadata.author}`
      ]);
    }

    // Process the video
    ffmpegCommand
      .output(outputFile)
      .on('end', () => {
        console.log(`Video processing complete: ${outputFile}`);
        resolve(outputFile);
      })
      .on('error', (err) => {
        console.error(`Error processing video: ${err.message}`);
        reject(err);
      })
      .run();
  });
};

// Function to log processing details into MongoDB
const logProcessing = async (inputFile, outputFile, options, status) => {
  const log = new VideoLog({
    originalFile: inputFile,
    outputFile: outputFile,
    processingOptions: options,
    status: status,
  });

  await log.save();
  console.log('Log saved to database!');
};

// Function to process all videos in a folder
const processAllVideos = async (inputFolder, outputFolder, options) => {
  try {
    const files = fs.readdirSync(inputFolder);

    for (const file of files) {
      const inputFile = path.join(inputFolder, file);
      const outputFile = path.join(outputFolder, `processed_${file}`);

      if (fs.lstatSync(inputFile).isFile()) {
        console.log(`Processing video: ${file}`);
        
        try {
          await processVideo(inputFile, outputFile, options);
          logProcessing(inputFile, outputFile, options, 'success');
        } catch (err) {
          logProcessing(inputFile, outputFile, options, 'failed');
        }
      }
    }
  } catch (err) {
    console.error('Error processing videos:', err);
  }
};

// Example processing options
const processingOptions = {
  resize: '1280x720',
  crop: 'out_w=640:h=480:x=10:y=10',
  metadata: {
    title: 'Processed Video',
    author: 'Ortenc'
  }
};

// Process all videos in the unspoofedvideos folder
const inputFolder = './videos/unSpoofedVideos';
const outputFolder = './videos/spoofedVideos';

processAllVideos(inputFolder, outputFolder, processingOptions);
