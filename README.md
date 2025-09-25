# zyro.news

A modern news platform that combines a polished front-end with a lightweight Node.js proxy to surface real-time headlines from the GNews API. The project showcases a glassmorphism-inspired UI, category-based browsing, and search across global news sources.

## Live Site

- Production: [www.zyro.news](https://www.zyro.news)

## Features

- **Global Coverage** – Browse curated categories including World, Business, Technology, Sports, and more.
- **Instant Search** – Query the GNews API for breaking stories with pagination, sorting, and locale filters.
- **Responsive UI** – Tailored layouts for desktop, tablet, and mobile, enhanced with subtle audio/visual effects.
- **Newsletter Placeholder** – Newsletter prompts are intentionally disabled while the email service is under construction.
- **SEO Friendly** – Rich meta tags, sitemap, and structured data for discoverability.

## Tech Stack

- **Frontend:** HTML5, CSS3 (custom design system), Vanilla JavaScript
- **Backend:** Node.js, Express.js, Fetch API
- **API Provider:** [GNews API](https://gnews.io/)
- **Tooling:** Nodemon (development), Render (backend deploy), GitHub Pages (static hosting)

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A valid GNews API key (free tier available)

### Local Setup

```bash
# clone the repository
git clone https://github.com/yourusername/zyro-news.git
cd zyro-news

# install dependencies
npm install
```

Create a `.env` file in the project root:

```
GNEWS_API_KEY=your_gnews_api_key
PORT=3000
```

Start the server:

```bash
npm start      # start the Express proxy
# or
npm run dev    # start with nodemon + hot reload
```

Visit [http://localhost:3000](http://localhost:3000) to explore the UI. The Express server serves static assets and proxies requests to the GNews API so your key stays server-side.

## Project Structure

```
zyro/
├── index.html               # Landing page and primary UI
├── style.css                # Design system and responsive layouts
├── script.js                # Front-end interactions (search, filters, UI effects)
├── newsletter-placeholder.js# Temporary handler for newsletter forms
├── server.js                # Express server + GNews proxy endpoints
├── about.html               # Company overview & mission
├── careers.html             # Internship listings and CTA
├── contact.html             # Contact methods (email-based)
├── advertise.html           # Advertising overview
├── privacy.html             # Privacy policy
├── terms.html               # Terms of service
├── cookies.html             # Cookie policy
├── sitemap.html / sitemap.xml# Navigation helpers for users/bots
├── package.json             # Scripts and dependencies
├── package-lock.json
└── .env                      # Environment configuration (ignored in git)
```

## API Proxy Endpoints

All endpoints are served from the Express server and forward to the GNews API with the configured key.

- `GET /api/search` – Search articles with query, pagination, sort, and locale parameters.
- `GET /api/top-headlines` – Retrieve top headlines by category, country, and language.
- `GET /api/categories` – Static list of supported news categories.

Review `server.js` for parameter handling, request limits, and error responses.

## Deployment Notes

- **Backend:** Deploy `server.js` to Render (or any Node-friendly host). Ensure the `GNEWS_API_KEY` environment variable is set in the host dashboard.
- **Frontend:** Static files (`index.html`, assets) can be served from GitHub Pages. Update the `CNAME` if you use a custom domain.

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m "Add amazing feature"`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a pull request describing your updates.

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.

## Credits

- News data provided by the [GNews API](https://gnews.io/).
- UI inspiration from contemporary glassmorphism trends.

If you build something with zyro.news or spot an improvement, feel free to open an issue or pull request!
