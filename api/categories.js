export default function handler(req, res) {
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
}
