require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const { fetchVideoData } = require('./services/scraper');
const { spoofVideo } = require('./spoof/spoofVideo');
const Video = require('./models/Video');
const spoofedVideo = require('./models/SpoofedVideo');
const { default: Axios } = require('axios');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(" Connected to MongoDB"))
  .catch(err => console.error(" MongoDB connection error:", err));

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, "Send me a TikTok or Instagram video URL jepi ortenc !");
});

bot.on('message', async msg => {
  const url = msg.text;

  if(!url){
    console.log('this is not a link');
    return;
  }

  if (url.includes('tiktok.com') || url.includes('instagram.com')) {
    try {
      const { videoUrl, description } = await fetchVideoData(url);
      await bot.sendMessage(msg.chat.id, "⏳ Processing your video...");
      const videoDoc = new Video({ platform: 'TikTok', videoUrl, description });
      await videoDoc.save();

      const response = await Axios.get(videoUrl, {
        responseType: 'arraybuffer', // Get raw binary data
      });
      
      await bot.sendVideo(msg.chat.id, response.data, { caption: description });
    } catch (error) {
      console.error(error);
      bot.sendMessage(msg.chat.id, 'Failed to fetch the video.');
    }
  }
});

// bot.on('video', async (msg) => {
//     const chatId = msg.chat.id;
//     const fileId = msg.video.file_id;
  
//     try {
//       // 1. Get file path from Telegram
//       const file = await bot.getFile(fileId);
//       const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
  
//       // 2. Download the actual video
//       const videoResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
//       const videoBuffer = Buffer.from(videoResponse.data);
  
//       // 3. Process it
//       const processedBuffer = await spoofVideo(videoBuffer);
  
//       // 4. Send it back
//       await bot.sendVideo(chatId, processedBuffer, {
//         caption: "Here's your spoofed video!",
//         supports_streaming: true,
//       });
  
//     } catch (err) {
//       console.error("Video processing error:", err);
//       await bot.sendMessage(chatId, "Oops! Something went wrong with the video.");
//     }
//   });

// bot.on('video', async (msg) => {
//     try {
//       const chatId = msg.chat.id;
//       const fileId = msg.video.file_id;
//       const userId = msg.from.id;
      
//       await bot.sendMessage(chatId, "⏳ Processing your video...");
      
//       // 1. Get file from Telegram
//       const fileStream = await bot.getFileStream(fileId);
//       const chunks = [];
      
//       for await (const chunk of fileStream) {
//         chunks.push(chunk);
//       }
      
//       const videoBuffer = Buffer.concat(chunks);
      
//       // 2. Process video
//       const processedBuffer = await spoofVideo(videoBuffer);
//       console.log('doubt');
//       // 3. Save processing data to MongoDB
//       const spoofedDoc = new spoofedVideo({
//         originalFileId: fileId,
//         userId: userId,
//         processingParams: {
//           resolution: '640x320',
//           crop: '640x320 from 640x360',
//           metadata: { title: 'SPOOFED_VIDEO' }
//         }
//       });
//       console.log('confirm');
//       await spoofedDoc.save();
      
//       // 4. Send back processed video
//       await bot.sendVideo(chatId, processedBuffer, {
//         caption: 'Here\'s your spoofed video!',
//         supports_streaming: true
//       });
      
//     } catch (error) {
//       console.error('Video processing error:', error);
//       bot.sendMessage(msg.chat.id, '❌ Error processing video. Please try again.');
//     }
//   });
