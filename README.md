# Telegram Bot Scraper 🤖

A Node.js Telegram bot that downloads and processes videos from TikTok URLs s, with MongoDB storage.

## Features ✨
- 📥 Downloads videos from TikTok URLs
- ✂️ Processes uploaded videos (resize, crop, metadata) -> seperate script oustide the telegram bot
- 💾 Stores video metadata in MongoDB
- 🔄 Stream-based processing (no local file storage)

## Prerequisites 📋
- Node.js v22+
- MongoDB 
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)

## Setup 🛠️
1. Clone the repo:
   ```bash
   git clone https://github.com/ortenc/TelegramBotScraper.git
   cd TelegramBotScraper
2. use docker (suggested if in mac)
3. rapidapi used for tiktok scraping you can open a new account and use the free trial to get a new api or use the api key in the code i left for convenience
4. set up a telegram bot via the botfather and use the api key given by botfather
5. install all the dependencies via npm
6. use docker-compose up --build to implement the containers based on the image i provided
7. should be good to go

## How to use it 
- Pretty simple you just visit the bot you have created via the bot father after you have put on the env file the bot token api you can visit the bot and jsut pass the tik tok url you want to scrape and after the process is done the bot will also provide with a download video file
- The spoofing script has to be executed locally in the machine so in one console put the db up and the other execute the spoofVIdeo.js (manually insert some videos in the ./videos/unSpoofedVideos) and after the script is done the details will be written in the mongo db 
