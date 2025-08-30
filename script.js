class FuturisticNewsApp {
    constructor() {
        this.apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';
        this.currentCategory = 'general';
        this.currentQuery = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTimeDisplay();
        this.setupScrollAnimations();
        this.setupAdvancedSearch();
        this.loadTopHeadlines();
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const categoryTiles = document.querySelectorAll('.category-tile');

        searchBtn.addEventListener('click', () => this.handleSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        categoryTiles.forEach(tile => {
            tile.addEventListener('click', (e) => this.handleCategoryClick(e));
        });
    }

    setupTimeDisplay() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            
            const timeElement = document.getElementById('currentTime');
            if (timeElement) {
                timeElement.textContent = `${dateString} ${timeString}`;
            }
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        this.cardObserver = observer;
    }

    setupAdvancedSearch() {
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;

        // Advanced search suggestions
        const suggestions = [
            'breaking news',
            'technology trends',
            'climate change',
            'artificial intelligence',
            'cryptocurrency',
            'space exploration',
            'global politics',
            'renewable energy',
            'cybersecurity',
            'medical breakthroughs'
        ];

        let currentSuggestion = 0;
        
        const rotatePlaceholder = () => {
            if (document.activeElement !== searchInput) {
                searchInput.placeholder = `Search for ${suggestions[currentSuggestion]}...`;
                currentSuggestion = (currentSuggestion + 1) % suggestions.length;
            }
        };

        setInterval(rotatePlaceholder, 3000);

        // Real-time search validation
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value;
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    this.validateSearchTerm(query);
                }, 300);
            }
        });
    }

    validateSearchTerm(query) {
        const searchWrapper = document.querySelector('.search-wrapper');
        const validTerms = ['news', 'breaking', 'world', 'politics', 'tech', 'science', 'health', 'sports', 'business'];
        const isValid = validTerms.some(term => query.toLowerCase().includes(term));
        
        if (isValid) {
            searchWrapper.style.borderColor = 'var(--accent-emerald)';
        } else {
            searchWrapper.style.borderColor = 'var(--border-subtle)';
        }
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
                this.updateSectionTitle(`Search Results for "${query}"`);
                
                // Auto-scroll to results section
                setTimeout(() => {
                    document.querySelector('.news-section').scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 100);
            } else {
                this.showError(data.errors ? data.errors.join(', ') : 'Search failed');
            }
        } catch (error) {
            this.showError('Network error. Please check your connection and try again.');
        }

        this.hideLoading();
    }

    handleCategoryClick(e) {
        const tile = e.currentTarget;
        const category = tile.dataset.category;
        this.currentCategory = category;
        this.currentQuery = '';
        
        // Update active state with smooth transition
        document.querySelectorAll('.category-tile').forEach(t => {
            t.classList.remove('active');
        });
        tile.classList.add('active');

        // Clear search
        document.getElementById('searchInput').value = '';
        
        // Update section title
        const categoryName = tile.querySelector('.category-name').textContent;
        this.updateSectionTitle(`${categoryName} News`);
        
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
            this.showError('Network error. Please check your connection and try again.');
        }

        this.hideLoading();
    }

    updateSectionTitle(title) {
        const sectionTitle = document.querySelector('.news-section .section-title');
        if (sectionTitle) {
            sectionTitle.textContent = title;
        }
    }

    displayNews(articles) {
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = '';

        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: var(--text-secondary);">
                    <i class="fas fa-newspaper" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <h3>No articles found</h3>
                    <p>Try adjusting your search terms or browse a different category.</p>
                </div>
            `;
            return;
        }

        articles.forEach((article, index) => {
            const newsCard = this.createAdvancedNewsCard(article);
            newsContainer.appendChild(newsCard);
            
            // Observe for scroll animations
            if (this.cardObserver) {
                this.cardObserver.observe(newsCard);
            }
        });
    }

    createAdvancedNewsCard(article) {
        const card = document.createElement('article');
        card.className = 'news-card';
        
        const publishedDate = new Date(article.publishedAt);
        const timeAgo = this.getTimeAgo(publishedDate);
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        // Create card content with enhanced structure
        card.innerHTML = `
            ${article.image ? `
                <div class="news-image-container">
                    <img src="${article.image}" alt="${article.title}" onerror="this.parentElement.style.display='none'">
                </div>
            ` : ''}
            <div class="news-card-content">
                <h3>${this.truncateText(article.title, 100)}</h3>
                <p>${this.truncateText(article.description || '', 150)}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">
                    Read Full Article
                    <i class="fas fa-external-link-alt" style="font-size: 0.75rem; margin-left: 0.5rem;"></i>
                </a>
                <div class="news-meta">
                    <div class="news-source">
                        <i class="fas fa-globe" style="font-size: 0.75rem; margin-right: 0.25rem;"></i>
                        ${article.source.name}
                    </div>
                    <time class="news-date" datetime="${article.publishedAt}" title="${formattedDate}">
                        ${timeAgo}
                    </time>
                </div>
            </div>
        `;

        // Add enhanced hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            const img = card.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.05)';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            const img = card.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });

        return card;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + '...';
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('error').classList.add('hidden');
        
        // Add loading animation to news container
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.style.opacity = '0.5';
        newsContainer.style.pointerEvents = 'none';
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        
        // Remove loading state from news container
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.style.opacity = '1';
        newsContainer.style.pointerEvents = 'auto';
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>
            ${message}
        `;
        errorDiv.classList.remove('hidden');
        document.getElementById('loading').classList.add('hidden');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
}

// Enhanced page interactions
document.addEventListener('DOMContentLoaded', () => {
    const app = new FuturisticNewsApp();

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter');
    if (newsletterForm) {
        const input = newsletterForm.querySelector('input');
        const button = newsletterForm.querySelector('button');
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const email = input.value.trim();
            
            if (email && email.includes('@')) {
                button.textContent = 'Subscribed!';
                button.style.background = 'var(--accent-emerald)';
                input.value = '';
                
                setTimeout(() => {
                    button.textContent = 'Subscribe';
                    button.style.background = 'var(--gradient-accent)';
                }, 3000);
            } else {
                input.style.borderColor = 'var(--accent-red)';
                setTimeout(() => {
                    input.style.borderColor = 'var(--border-subtle)';
                }, 2000);
            }
        });
    }

    // Smooth scrolling for footer links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const header = document.querySelector('header');
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Advanced search enhancements
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Add search history
        let searchHistory = JSON.parse(localStorage.getItem('newsSearchHistory') || '[]');
        
        searchInput.addEventListener('focus', () => {
            if (searchHistory.length > 0) {
                // Could add dropdown with search history here
            }
        });
        
        // Save successful searches
        const originalHandleSearch = app.handleSearch;
        app.handleSearch = function() {
            const query = document.getElementById('searchInput').value.trim();
            if (query && !searchHistory.includes(query)) {
                searchHistory.unshift(query);
                searchHistory = searchHistory.slice(0, 10); // Keep last 10 searches
                localStorage.setItem('newsSearchHistory', JSON.stringify(searchHistory));
            }
            return originalHandleSearch.call(this);
        };
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            if (document.activeElement === searchInput) {
                searchInput.blur();
                searchInput.value = '';
            }
        }
    });
});