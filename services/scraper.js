const { default: Axios } = require('axios')
const cheerio = require('cheerio')

async function fetchVideoData(url) {

    const options = {
        method: 'GET',
        url: 'https://tiktok-scraper7.p.rapidapi.com/',
        params: {
          url: url,
          hd: '1'
        },
        headers: {
          'x-rapidapi-key': '4cb2825676msh2da4631e1c5193dp17ecd0jsn899e185b11d1',
          'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com'
        }
      };

    try {
        // First request to get cookies and token
        const initialResponse = await Axios.get('https://ttdownloader.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(initialResponse.data);
        const cookies = initialResponse.headers['set-cookie'];
        const token = $('#token').attr('value');
        
        if (!token) {
            throw new Error('Token not found');
        }

        // Second request - POST to /search/ endpoint (verified from your screenshot)
        const downloadResponse = await Axios.post('https://ttdownloader.com/search/', 
            new URLSearchParams({
                url: url,
                format: '',
                token: token
            }), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': cookies.join('; '),
                    'Referer': 'https://ttdownloader.com/',
                    'Origin': 'https://ttdownloader.com',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            }
        );

        const resultPage = cheerio.load(downloadResponse.data);
        const response = await Axios.request(options);
        
        const result = {
         nowm: resultPage('div.result:contains("No watermark") .download-link').attr('href'),
         wm: resultPage('div.result:contains("Watermark") .download-link').attr('href'),
         audio: resultPage('div.result:contains("Audio only") .download-link').attr('href')
         };
        
        if (!result.nowm && !result.wm && !result.audio) {
            // Fallback check for alternative selectors
            result.nowm = resultPage('a[href*="video"]').first().attr('href');
            result.wm = resultPage('a[href*="video"]').eq(1).attr('href');
            
            if (!result.nowm) {
                throw new Error('No download links found in response');
            }
        }
        console.log('success');
        console.log(response.data.data.title);
        return {
            videoUrl: result.nowm,
            description: response.data.data.title
        };
        
    } catch (error) {
        console.error('Error in tiktokdownload:', error);
        throw new Error(`Failed to fetch TikTok: ${error.message}`);
    }
}

module.exports = { fetchVideoData };
