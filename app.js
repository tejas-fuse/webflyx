/**
 * WebFlyx - Book Discovery & Reading Web Application
 * Main JavaScript file for data fetching, book search, filtering, and UI interactions
 */

// Global state management
const appState = {
    books: {
        titles: [],
        classics: [],
        searchResults: []
    },
    quotes: [],
    currentFilter: 'all',
    searchQuery: '',
    pdfOnlyFilter: false,
    isSearching: false
};

// API Configuration
const API_CONFIG = {
    openLibrary: {
        search: 'https://openlibrary.org/search.json',
        covers: 'https://covers.openlibrary.org/b',
        works: 'https://openlibrary.org/works'
    }
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
        renderBooks();
        renderQuotes();
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showError(error.message || 'Failed to load book data. Please refresh the page and try again.');
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
        
        appState.books.titles = titles.map(title => ({
            title,
            type: 'titles',
            source: 'local'
        }));
        
        console.log(`Loaded ${titles.length} titles from titles.md`);
    } catch (error) {
        console.error('Error fetching titles:', error);
        throw new Error('Unable to load book titles. Please check your internet connection and try again.');
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
            
            // Parse CSV line
            const parts = line.split(',').map(part => part.trim());
            
            if (parts.length >= 3) {
                classics.push({
                    title: parts[0],
                    author: parts[1],
                    year: parts[2],
                    type: 'classics',
                    source: 'local'
                });
            }
        }
        
        appState.books.classics = classics;
        console.log(`Loaded ${classics.length} classics from classics.csv`);
    } catch (error) {
        console.error('Error fetching classics:', error);
        throw new Error('Unable to load classic books. Please check your internet connection and try again.');
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
            if (!response.ok) {
                console.warn(`Could not load quotes from ${file}: ${response.status} ${response.statusText}`);
                continue; // Skip this file and continue with others
            }
            const text = await response.text();
            
            // Parse markdown list items
            const lines = text.split('\n');
            const quotes = lines
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().replace(/^-\s*/, ''))
                .map(quote => quote.replace(/^[""]|[""]$/g, ''))
                .filter(quote => quote.length > 0);
            
            // Extract source name from filename (e.g., 'dune.md' -> 'Dune', 'star-wars.md' -> 'Star Wars')
            const source = file.replace('.md', '')
                .split(/[-_\s]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            quotes.forEach(quote => {
                appState.quotes.push({ text: quote, source });
            });
            
            console.log(`Loaded ${quotes.length} quotes from ${file}`);
        } catch (error) {
            console.warn(`Error fetching quotes from ${file}:`, error);
            // Continue loading other files even if one fails
        }
    }
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const pdfOnlyFilter = document.getElementById('pdfOnlyFilter');
    
    // Search on button click
    searchButton.addEventListener('click', () => {
        performSearch();
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // PDF filter
    pdfOnlyFilter.addEventListener('change', (e) => {
        appState.pdfOnlyFilter = e.target.checked;
        renderBooks();
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
            renderBooks();
        });
    });
    
    // Modal close handlers
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const bookModal = document.getElementById('bookModal');
    
    modalClose.addEventListener('click', () => closeModal());
    modalOverlay.addEventListener('click', () => closeModal());
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookModal.style.display !== 'none') {
            closeModal();
        }
    });
}

/**
 * Perform book search using Open Library API
 */
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        return;
    }
    
    appState.searchQuery = query;
    appState.isSearching = true;
    showLoading(true);
    
    try {
        const response = await fetch(
            `${API_CONFIG.openLibrary.search}?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,isbn,subject,publisher,ebook_access,has_fulltext`
        );
        
        if (!response.ok) {
            throw new Error('Search request failed');
        }
        
        const data = await response.json();
        
        // Transform API results to our book format
        appState.books.searchResults = data.docs.map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
            year: book.first_publish_year || 'N/A',
            coverUrl: book.cover_i ? `${API_CONFIG.openLibrary.covers}/id/${book.cover_i}-M.jpg` : null,
            isbn: book.isbn ? book.isbn[0] : null,
            subjects: book.subject ? book.subject.slice(0, 3) : [],
            publisher: book.publisher ? book.publisher[0] : null,
            hasPdf: book.ebook_access === 'public' || book.has_fulltext,
            key: book.key,
            type: 'search',
            source: 'api'
        }));
        
        // Switch to search results filter
        appState.currentFilter = 'search';
        document.querySelector('[data-filter="search"]').classList.add('active');
        document.querySelectorAll('.filter-tab:not([data-filter="search"])').forEach(tab => {
            tab.classList.remove('active');
        });
        
        renderBooks();
        
    } catch (error) {
        console.error('Error searching books:', error);
        showError('Failed to search books. Please check your internet connection and try again.');
    } finally {
        showLoading(false);
        appState.isSearching = false;
    }
}

/**
 * Render books based on current filter and search query
 */
function renderBooks() {
    const booksGrid = document.getElementById('booksGrid');
    const noResults = document.getElementById('noResults');
    
    // Get filtered books
    let books = getFilteredBooks();
    
    // Clear grid
    booksGrid.innerHTML = '';
    
    // Show/hide no results message
    if (books.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }
    
    // Render book cards
    books.forEach((book, index) => {
        const card = createBookCard(book, index);
        booksGrid.appendChild(card);
    });
}

/**
 * Get filtered books based on current filter and search query
 */
function getFilteredBooks() {
    let books = [];
    
    // Apply collection filter
    if (appState.currentFilter === 'all') {
        books = [...appState.books.titles, ...appState.books.classics, ...appState.books.searchResults];
    } else if (appState.currentFilter === 'titles') {
        books = [...appState.books.titles];
    } else if (appState.currentFilter === 'classics') {
        books = [...appState.books.classics];
    } else if (appState.currentFilter === 'search') {
        books = [...appState.books.searchResults];
    }
    
    // Apply PDF filter
    if (appState.pdfOnlyFilter) {
        books = books.filter(book => book.hasPdf);
    }
    
    return books;
}

/**
 * Create a book card element
 */
function createBookCard(book, index) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.style.animationDelay = `${(index % 5) * 0.05}s`;
    
    // Cover container
    const coverContainer = document.createElement('div');
    coverContainer.className = 'book-cover-container';
    
    if (book.coverUrl) {
        const cover = document.createElement('img');
        cover.className = 'book-cover';
        cover.src = book.coverUrl;
        cover.alt = `${book.title} cover`;
        cover.loading = 'lazy';
        cover.onerror = () => {
            coverContainer.innerHTML = '<div class="book-cover-placeholder">📚</div>';
        };
        coverContainer.appendChild(cover);
    } else {
        coverContainer.innerHTML = '<div class="book-cover-placeholder">📚</div>';
    }
    
    // Title
    const title = document.createElement('h3');
    title.className = 'book-title';
    title.textContent = book.title;
    
    // Author
    const author = document.createElement('div');
    author.className = 'book-author';
    author.textContent = book.author || 'Unknown Author';
    
    // Info section
    const info = document.createElement('div');
    info.className = 'book-info';
    
    // Add year for all books
    if (book.year) {
        const year = document.createElement('div');
        year.className = 'book-detail';
        year.textContent = `Published: ${book.year}`;
        info.appendChild(year);
    }
    
    // Add subjects for API books
    if (book.subjects && book.subjects.length > 0) {
        const subjects = document.createElement('div');
        subjects.className = 'book-detail';
        subjects.textContent = book.subjects.join(', ');
        info.appendChild(subjects);
    }
    
    // Badges
    const badges = document.createElement('div');
    badges.className = 'book-badges';
    
    // Type badge
    const typeBadge = document.createElement('span');
    typeBadge.className = `book-badge ${book.type}`;
    if (book.type === 'titles') {
        typeBadge.textContent = 'Modern';
    } else if (book.type === 'classics') {
        typeBadge.textContent = 'Classic';
    } else if (book.type === 'search') {
        typeBadge.className = 'book-badge search-result';
        typeBadge.textContent = 'Online';
    }
    badges.appendChild(typeBadge);
    
    // PDF badge
    if (book.hasPdf) {
        const pdfBadge = document.createElement('span');
        pdfBadge.className = 'book-badge pdf-available';
        pdfBadge.textContent = 'PDF Available';
        badges.appendChild(pdfBadge);
    }
    
    // Actions (for API books with PDF)
    if (book.source === 'api') {
        const actions = document.createElement('div');
        actions.className = 'book-actions';
        
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'book-action-btn primary';
        detailsBtn.textContent = 'Details';
        detailsBtn.onclick = (e) => {
            e.stopPropagation();
            showBookDetails(book);
        };
        actions.appendChild(detailsBtn);
        
        if (book.hasPdf && book.key) {
            const readBtn = document.createElement('a');
            readBtn.className = 'book-action-btn';
            readBtn.textContent = 'Read Online';
            readBtn.href = `https://openlibrary.org${book.key}`;
            readBtn.target = '_blank';
            readBtn.rel = 'noopener noreferrer';
            readBtn.onclick = (e) => e.stopPropagation();
            actions.appendChild(readBtn);
        }
        
        card.appendChild(coverContainer);
        card.appendChild(title);
        card.appendChild(author);
        card.appendChild(info);
        card.appendChild(badges);
        card.appendChild(actions);
    } else {
        // For local books, make entire card clickable
        card.style.cursor = 'default';
        
        card.appendChild(coverContainer);
        card.appendChild(title);
        if (book.author) {
            card.appendChild(author);
        }
        card.appendChild(info);
        card.appendChild(badges);
    }
    
    return card;
}

/**
 * Show book details in modal
 */
function showBookDetails(book) {
    const modal = document.getElementById('bookModal');
    const modalBody = document.getElementById('modalBody');
    
    const details = document.createElement('div');
    details.className = 'modal-book-details';
    
    // Header with cover and basic info
    const header = document.createElement('div');
    header.className = 'modal-book-header';
    
    // Cover
    const coverDiv = document.createElement('div');
    coverDiv.className = 'modal-book-cover';
    if (book.coverUrl) {
        const largeCoverUrl = book.coverUrl.replace('-M.jpg', '-L.jpg');
        coverDiv.innerHTML = `<img src="${largeCoverUrl}" alt="${book.title} cover" onerror="this.parentElement.innerHTML='<div class=\\'book-cover-placeholder\\' style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem;\\'>📚</div>'">`;
    } else {
        coverDiv.innerHTML = '<div class="book-cover-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem;">📚</div>';
    }
    
    // Info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'modal-book-info';
    
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-book-title';
    modalTitle.id = 'modalTitle';
    modalTitle.textContent = book.title;
    
    const modalAuthor = document.createElement('div');
    modalAuthor.className = 'modal-book-author';
    modalAuthor.textContent = book.author;
    
    const meta = document.createElement('div');
    meta.className = 'modal-book-meta';
    
    if (book.year) {
        const yearDiv = document.createElement('div');
        yearDiv.innerHTML = `<strong>Year:</strong> ${book.year}`;
        meta.appendChild(yearDiv);
    }
    
    if (book.publisher) {
        const pubDiv = document.createElement('div');
        pubDiv.innerHTML = `<strong>Publisher:</strong> ${book.publisher}`;
        meta.appendChild(pubDiv);
    }
    
    if (book.isbn) {
        const isbnDiv = document.createElement('div');
        isbnDiv.innerHTML = `<strong>ISBN:</strong> ${book.isbn}`;
        meta.appendChild(isbnDiv);
    }
    
    infoDiv.appendChild(modalTitle);
    infoDiv.appendChild(modalAuthor);
    infoDiv.appendChild(meta);
    
    header.appendChild(coverDiv);
    header.appendChild(infoDiv);
    
    // Subjects
    if (book.subjects && book.subjects.length > 0) {
        const description = document.createElement('div');
        description.className = 'modal-book-description';
        description.innerHTML = `<strong>Subjects:</strong> ${book.subjects.join(', ')}`;
        details.appendChild(header);
        details.appendChild(description);
    } else {
        details.appendChild(header);
    }
    
    // Actions
    const actions = document.createElement('div');
    actions.className = 'modal-book-actions';
    
    if (book.hasPdf && book.key) {
        const readBtn = document.createElement('a');
        readBtn.className = 'modal-action-btn';
        readBtn.textContent = '📖 Read Online';
        readBtn.href = `https://openlibrary.org${book.key}`;
        readBtn.target = '_blank';
        readBtn.rel = 'noopener noreferrer';
        actions.appendChild(readBtn);
    }
    
    const viewBtn = document.createElement('a');
    viewBtn.className = 'modal-action-btn secondary';
    viewBtn.textContent = 'View on Open Library';
    viewBtn.href = `https://openlibrary.org${book.key}`;
    viewBtn.target = '_blank';
    viewBtn.rel = 'noopener noreferrer';
    actions.appendChild(viewBtn);
    
    details.appendChild(actions);
    
    modalBody.innerHTML = '';
    modalBody.appendChild(details);
    modal.style.display = 'flex';
    
    // Focus management for accessibility
    modalTitle.focus();
}

/**
 * Close the modal
 */
function closeModal() {
    const modal = document.getElementById('bookModal');
    modal.style.display = 'none';
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
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}
