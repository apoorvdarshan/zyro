const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

async function fetchFromGNews(endpoint, params = {}) {
    const url = new URL(`${GNEWS_BASE_URL}/${endpoint}`);
    url.searchParams.append('apikey', GNEWS_API_KEY);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, value);
        }
    });

    const response = await fetch(url.toString());
    return {
        success: response.ok,
        status: response.status,
        data: await response.json()
    };
}

export default async function handler(req, res) {
    if (!GNEWS_API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

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

    try {
        const result = await fetchFromGNews('top-headlines', params);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch headlines' });
    }
}
