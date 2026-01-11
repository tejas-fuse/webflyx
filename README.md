# WebFlyx 🎬

A modern, Netflix-inspired movie browsing web application that beautifully displays your movie collection.

## Features

✨ **Beautiful UI** - Dark theme with smooth animations and modern design  
🔍 **Search** - Quickly find movies by title  
🎯 **Filters** - Browse by Modern Titles or Classics  
📱 **Responsive** - Works perfectly on mobile, tablet, and desktop  
💬 **Quotes** - Memorable quotes from iconic movies  
⚡ **Fast** - Pure vanilla JavaScript with no dependencies

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

- **Search**: Type in the search bar to filter movies by title
- **Filter**: Click on "All Movies", "Modern Titles", or "Classics" tabs to filter the collection
- **Browse**: Scroll through the movie cards to see details
- **Quotes**: Check out memorable movie quotes at the bottom of the page

## Repository Contents

- **index.html** - Main application page
- **style.css** - All styling and responsive design
- **app.js** - JavaScript logic for data fetching and filtering
- **titles.md** - Modern movie titles in the collection
- **classics.csv** - Classic movies with director and year information
- **quotes/** - Directory containing memorable movie quotes
  - dune.md
  - starwars.md

## Technologies

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- No external dependencies or frameworks

## Deployment

This application can be easily deployed to:
- **GitHub Pages**: Enable in repository settings
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- Any static hosting service

## Contributing

Feel free to add more movies or quotes by editing:
- `titles.md` - Add movies to the modern collection
- `classics.csv` - Add classic movies (format: title, director, year)
- `quotes/*.md` - Add new quote files

## License

This project is open source and available for personal and educational use.

---

*Last updated: 2026-01-11*  
*Status: Active* ✅