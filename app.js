/**
 * WebFlyx - Movie Collection Web Application
 * Main JavaScript file for data fetching, filtering, and UI interactions
 */

// Global state management
const appState = {
    movies: {
        titles: [],
        classics: []
    },
    quotes: [],
    currentFilter: 'all',
    searchQuery: ''
};

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Main initialization function
 */
async function initializeApp() {
    showLoading(true);
    
    try {
        // Fetch all data in parallel
        await Promise.all([
            fetchTitles(),
            fetchClassics(),
            fetchQuotes()
        ]);
        
        // Set up event listeners
        setupEventListeners();
        
        // Initial render
        renderMovies();
        renderQuotes();
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showError(error.message || 'Failed to load movie data. Please refresh the page and try again.');
    } finally {
        showLoading(false);
    }
}

/**
 * Fetch and parse titles.md file
 */
async function fetchTitles() {
    try {
        const response = await fetch('titles.md');
        if (!response.ok) {
            throw new Error(`Failed to fetch titles.md: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        
        // Parse markdown list items
        const lines = text.split('\n');
        const titles = lines
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.trim().replace(/^-\s*/, ''))
            .filter(title => title.length > 0);
        
        appState.movies.titles = titles.map(title => ({
            title,
            type: 'titles'
        }));
        
        console.log(`Loaded ${titles.length} titles from titles.md`);
    } catch (error) {
        console.error('Error fetching titles:', error);
        throw new Error('Unable to load movie titles. Please check your internet connection and try again.');
    }
}

/**
 * Fetch and parse classics.csv file
 */
async function fetchClassics() {
    try {
        const response = await fetch('classics.csv');
        if (!response.ok) {
            throw new Error(`Failed to fetch classics.csv: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        
        // Parse CSV
        const lines = text.split('\n');
        const classics = [];
        
        // Skip header row and process data rows
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.length === 0) continue;
            
            // Parse CSV line - simple CSV parser that handles basic comma-separated values
            // This works for the current data format where fields don't contain commas
            const parts = line.split(',').map(part => part.trim());
            
            if (parts.length >= 3) {
                classics.push({
                    title: parts[0],
                    director: parts[1],
                    year: parts[2],
                    type: 'classics'
                });
            }
        }
        
        appState.movies.classics = classics;
        console.log(`Loaded ${classics.length} classics from classics.csv`);
    } catch (error) {
        console.error('Error fetching classics:', error);
        throw new Error('Unable to load classic movies. Please check your internet connection and try again.');
    }
}

/**
 * Fetch and parse quote files from quotes directory
 */
async function fetchQuotes() {
    const quoteFiles = ['dune.md', 'starwars.md'];
    
    for (const file of quoteFiles) {
        try {
            const response = await fetch(`quotes/${file}`);
            const text = await response.text();
            
            // Parse markdown list items
            const lines = text.split('\n');
            const quotes = lines
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().replace(/^-\s*/, ''))
                .map(quote => quote.replace(/^[""]|[""]$/g, ''))
                .filter(quote => quote.length > 0);
            
            // Extract source name from filename (e.g., 'dune.md' -> 'Dune')
            const source = file.replace('.md', '')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            quotes.forEach(quote => {
                appState.quotes.push({ text: quote, source });
            });
            
            console.log(`Loaded ${quotes.length} quotes from ${file}`);
        } catch (error) {
            console.error(`Error fetching quotes from ${file}:`, error);
        }
    }
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.toLowerCase();
        renderMovies();
    });
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Update active state
            filterTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update filter and re-render
            appState.currentFilter = e.target.dataset.filter;
            renderMovies();
        });
    });
}

/**
 * Render movies based on current filter and search query
 */
function renderMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    const noResults = document.getElementById('noResults');
    
    // Get filtered movies
    let movies = getFilteredMovies();
    
    // Clear grid
    moviesGrid.innerHTML = '';
    
    // Show/hide no results message
    if (movies.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }
    
    // Render movie cards
    movies.forEach((movie, index) => {
        const card = createMovieCard(movie, index);
        moviesGrid.appendChild(card);
    });
}

/**
 * Get filtered movies based on current filter and search query
 */
function getFilteredMovies() {
    let movies = [];
    
    // Apply collection filter
    if (appState.currentFilter === 'all') {
        movies = [...appState.movies.titles, ...appState.movies.classics];
    } else if (appState.currentFilter === 'titles') {
        movies = [...appState.movies.titles];
    } else if (appState.currentFilter === 'classics') {
        movies = [...appState.movies.classics];
    }
    
    // Apply search filter
    if (appState.searchQuery) {
        movies = movies.filter(movie => 
            movie.title.toLowerCase().includes(appState.searchQuery)
        );
    }
    
    return movies;
}

/**
 * Create a movie card element
 */
function createMovieCard(movie, index) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.style.animationDelay = `${(index % 5) * 0.05}s`;
    
    const title = document.createElement('h3');
    title.className = 'movie-title';
    title.textContent = movie.title;
    
    const info = document.createElement('div');
    info.className = 'movie-info';
    
    // Add director and year for classics
    if (movie.type === 'classics') {
        if (movie.director) {
            const director = document.createElement('div');
            director.className = 'movie-detail';
            director.innerHTML = `<strong>Director:</strong> ${movie.director}`;
            info.appendChild(director);
        }
        
        if (movie.year) {
            const year = document.createElement('div');
            year.className = 'movie-detail';
            year.innerHTML = `<strong>Year:</strong> ${movie.year}`;
            info.appendChild(year);
        }
    }
    
    // Add collection badge
    const badge = document.createElement('span');
    badge.className = `movie-badge ${movie.type}`;
    badge.textContent = movie.type === 'titles' ? 'Modern' : 'Classic';
    
    card.appendChild(title);
    card.appendChild(info);
    card.appendChild(badge);
    
    return card;
}

/**
 * Render quotes
 */
function renderQuotes() {
    const quotesGrid = document.getElementById('quotesGrid');
    quotesGrid.innerHTML = '';
    
    appState.quotes.forEach(quote => {
        const card = createQuoteCard(quote);
        quotesGrid.appendChild(card);
    });
}

/**
 * Create a quote card element
 */
function createQuoteCard(quote) {
    const card = document.createElement('div');
    card.className = 'quote-card';
    
    const text = document.createElement('p');
    text.className = 'quote-text';
    text.textContent = quote.text;
    
    const source = document.createElement('div');
    source.className = 'quote-source';
    source.textContent = `— ${quote.source}`;
    
    card.appendChild(text);
    card.appendChild(source);
    
    return card;
}

/**
 * Show/hide loading state
 */
function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    loadingState.style.display = show ? 'block' : 'none';
}

/**
 * Show error message
 */
function showError(message) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}
