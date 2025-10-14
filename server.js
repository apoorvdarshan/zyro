const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

// Validate API key on startup
if (!GNEWS_API_KEY) {
    console.error('❌ GNEWS_API_KEY is not set in environment variables');
    console.error('Please create a .env file with GNEWS_API_KEY=your_api_key');
    process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

async function fetchFromGNews(endpoint, params = {}) {
    const url = new URL(`${GNEWS_BASE_URL}/${endpoint}`);
    url.searchParams.append('apikey', GNEWS_API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, value);
        }
    });

    try {
        const response = await fetch(url.toString());
        const data = await response.json();
        
        return {
            success: response.ok,
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error('GNews API Error:', error);
        return {
            success: false,
            status: 500,
            data: { errors: ['Network error occurred'] }
        };
    }
}

app.get('/api/search', async (req, res) => {
    const {
        q,
        lang = 'en',
        country,
        max = 100,
        sortby = 'publishedAt',
        page = 1
    } = req.query;

    if (!q) {
        return res.status(400).json({
            errors: { q: 'Search query is required' }
        });
    }

    const params = {
        q,
        lang,
        max: Math.min(parseInt(max), 100),
        sortby,
        page: parseInt(page)
    };

    if (country) {
        params.country = country;
    }

    const result = await fetchFromGNews('search', params);
    
    res.status(result.status).json(result.data);
});

app.get('/api/top-headlines', async (req, res) => {
    const {
        category = 'general',
        lang = 'en',
        country = 'us',
        max = 100,
        page = 1
    } = req.query;

    const params = {
        category,
        lang,
        country,
        max: Math.min(parseInt(max), 100),
        page: parseInt(page)
    };

    const result = await fetchFromGNews('top-headlines', params);
    
    res.status(result.status).json(result.data);
});

app.get('/api/categories', (req, res) => {
    res.json({
        categories: [
            'general',
            'world',
            'nation',
            'business',
            'technology',
            'entertainment',
            'sports',
            'science',
            'health'
        ]
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GNews API integration ready`);
});