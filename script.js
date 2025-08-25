class NewsApp {
    constructor() {
        this.apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';
        this.currentCategory = 'general';
        this.currentQuery = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTopHeadlines();
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const categoryBtns = document.querySelectorAll('.category-btn');

        searchBtn.addEventListener('click', () => this.handleSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryClick(e));
        });
    }

    async handleSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) {
            this.showError('Please enter a search term');
            return;
        }

        this.currentQuery = query;
        this.showLoading();
        
        try {
            const response = await fetch(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (response.ok) {
                this.displayNews(data.articles);
            } else {
                this.showError(data.errors ? data.errors.join(', ') : 'Search failed');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        }

        this.hideLoading();
    }

    handleCategoryClick(e) {
        const category = e.target.dataset.category;
        this.currentCategory = category;
        this.currentQuery = '';
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        document.getElementById('searchInput').value = '';
        this.loadTopHeadlines();
    }

    async loadTopHeadlines() {
        this.showLoading();
        
        try {
            const response = await fetch(`${this.apiUrl}/top-headlines?category=${this.currentCategory}`);
            const data = await response.json();
            
            if (response.ok) {
                this.displayNews(data.articles);
            } else {
                this.showError(data.errors ? data.errors.join(', ') : 'Failed to load headlines');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        }

        this.hideLoading();
    }

    displayNews(articles) {
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = '';

        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = '<p class="no-results">No articles found.</p>';
            return;
        }

        articles.forEach(article => {
            const newsCard = this.createNewsCard(article);
            newsContainer.appendChild(newsCard);
        });
    }

    createNewsCard(article) {
        const card = document.createElement('div');
        card.className = 'news-card';
        
        const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        card.innerHTML = `
            ${article.image ? `<img src="${article.image}" alt="${article.title}" onerror="this.style.display='none'">` : ''}
            <div class="news-card-content">
                <h3>${article.title}</h3>
                <p>${article.description || ''}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">Read More</a>
                <div class="news-meta">
                    <span class="news-source">${article.source.name}</span>
                    <span class="news-date">${publishedDate}</span>
                </div>
            </div>
        `;

        return card;
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('error').classList.add('hidden');
        document.getElementById('newsContainer').innerHTML = '';
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        document.getElementById('loading').classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NewsApp();
});