# WebFlyx - Classic Movies Search

A simple web application for searching and browsing classic movies from the WebFlyx collection.

## Features

- **Book/Movie Search**: Search through classic movies by title, director, or year
- **Filter Options**: Toggle search filters to refine results
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Search**: Results update as you type

## Getting Started

1. Clone the repository
2. Open `index.html` in a web browser, or serve it using a local HTTP server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

## File Structure

- `index.html` - Main search interface with embedded CSS and JavaScript
- `classics.csv` - Database of classic movies (title, director, year)
- `titles.md` - List of movie titles in the collection
- `contents.md` - Description of repository contents
- `quotes/` - Directory containing memorable quotes from movies

## Usage

1. **Search**: Type in the search box to find movies by title, director, or year
2. **Filter**: Use the checkboxes to enable/disable search filters
3. **Browse**: Scroll through the results to explore the collection

## Data Format

The `classics.csv` file contains movie data in the following format:
```
title, director, year
```

## Notes

- This is a static web application with no backend dependencies
- All data is loaded client-side from the CSV file
- No GCP (Google Cloud Platform) integration is included in this repository

## Contributing

Feel free to add more movies to `classics.csv` or enhance the search functionality!
