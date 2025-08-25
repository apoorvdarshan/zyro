# zyro.news

A modern, responsive news website powered by the GNews API. Features real-time news search and category-based browsing with a clean, professional interface.

## Features

- **Real-time News Search**: Search for specific news topics and keywords
- **Category Navigation**: Browse news by categories (General, World, Business, Technology, etc.)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean design with smooth animations and hover effects
- **Fast Loading**: Optimized API calls with loading states and error handling

## Live Demo

[View Live Site](your-render-url-here)

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **API**: GNews API for news data
- **Deployment**: Render (backend) + GitHub Pages (frontend)

## Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/zyro-news.git
cd zyro-news
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```
GNEWS_API_KEY=your_gnews_api_key_here
PORT=3000
```

4. **Start the development server**
```bash
npm start
```
or for auto-restart during development:
```bash
npm run dev
```

5. **Open your browser**
Visit `http://localhost:3000`

## Deployment on Render

1. **Connect your GitHub repository** to Render
2. **Set environment variables** in Render dashboard:
   - `GNEWS_API_KEY`: Your GNews API key
3. **Deploy**: Render will automatically build and deploy your app

## API Endpoints

- `GET /api/search?q={query}` - Search news articles
- `GET /api/top-headlines?category={category}` - Get top headlines by category
- `GET /api/categories` - Get available news categories

## Project Structure

```
├── index.html          # Main HTML file
├── style.css           # Responsive CSS styles
├── script.js           # Frontend JavaScript
├── server.js           # Node.js backend server
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (not in repo)
├── .gitignore         # Git ignore file
└── README.md          # Project documentation
```

## News Categories

- General
- World
- Business
- Technology
- Entertainment
- Sports
- Science
- Health

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## API Credits

This project uses the [GNews API](https://gnews.io/) for fetching news data.

## Author

Your Name - [GitHub](https://github.com/yourusername)

---

⭐ Star this repo if you found it helpful!