# WebFlyx 📚

A modern book discovery and reading web application that helps you find and access books in PDF format from around the internet.

## Features

✨ **Beautiful UI** - Clean, modern dark theme with smooth animations  
🔍 **Internet Book Search** - Search millions of books via Open Library API  
📖 **PDF Access** - Find books with freely available PDF versions  
🎯 **Smart Filters** - Filter by collection type and PDF availability  
📱 **Responsive** - Works perfectly on mobile, tablet, and desktop  
💬 **Literary Quotes** - Memorable quotes from iconic books  
⚡ **Fast & Accessible** - Built with performance and accessibility in mind

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/tejas-fuse/webflyx.git
   cd webflyx
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server
     ```
   - Navigate to `http://localhost:8000`

## Usage

- **Search**: Type a book title, author name, or ISBN in the search bar and click search
- **Filter**: Use the "PDF Available Only" checkbox to show only books with free PDFs
- **Browse Collections**: Switch between "All Books", "Search Results", "Modern Reads", and "Classics"
- **View Details**: Click "Details" on any search result to see more information
- **Read Online**: Click "Read Online" on books with PDF versions to access them on Open Library

## Book Search Features

- **Multiple Search Options**: Search by title, author, or ISBN
- **Rich Metadata**: View book covers, publication years, publishers, and subjects
- **PDF Availability**: Clearly indicated which books have freely available PDFs
- **Direct Access**: One-click access to readable versions on Open Library
- **Detailed View**: Modal with comprehensive book information

## Repository Contents

- **index.html** - Main application page with search interface
- **style.css** - Modern, responsive styling with dark theme
- **app.js** - JavaScript logic for search, data fetching, and UI interactions
- **titles.md** - Curated modern book titles
- **classics.csv** - Classic literature with author and year information
- **quotes/** - Directory containing memorable literary quotes
  - dune.md
  - starwars.md

## Technologies

- HTML5
- CSS3 (Flexbox, Grid, Animations, Custom Properties)
- Vanilla JavaScript (ES6+)
- Open Library API Integration
- No external dependencies or frameworks

## API Integration

This application uses the [Open Library API](https://openlibrary.org/developers/api) to search for books and access their metadata:

- Search endpoint for finding books
- Cover images API for displaying book covers
- Direct links to readable versions when available

## Deployment

This application can be easily deployed to:
- **GitHub Pages**: Enable in repository settings
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- Any static hosting service

## Contributing

Feel free to add more books or quotes by editing:
- `titles.md` - Add books to the modern collection
- `classics.csv` - Add classic books (format: title, author, year)
- `quotes/*.md` - Add new quote files

## License

This project is open source and available for personal and educational use.

---

*Last updated: 2026-01-12*  
*Status: Active* ✅