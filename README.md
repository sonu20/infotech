# Simple Web Application

A complete web application demonstrating HTML, CSS, JavaScript, and PHP integration with modern design and interactive features.

## Features

### Frontend (HTML/CSS/JavaScript)
- **Responsive Design**: Mobile-friendly layout with modern CSS3 styling
- **Interactive Navigation**: Smooth scrolling between sections
- **Form Validation**: Real-time client-side validation with error messages
- **Dynamic Styling**: Background color changer with multiple themes
- **Time Display**: Interactive current date/time display
- **Notifications**: Toast-style notification system
- **Animations**: Smooth transitions and hover effects

### Backend (PHP)
- **Form Processing**: Secure form data handling with validation
- **Database Integration**: SQLite database for data persistence
- **Data Sanitization**: XSS protection and input cleaning
- **API Endpoints**: RESTful API for data retrieval
- **Error Handling**: Comprehensive error logging and user feedback
- **Statistics**: Basic analytics for form submissions

## File Structure

```
website_test/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript interactivity
├── process.php         # PHP backend processing
├── user_data.db        # SQLite database (auto-created)
└── README.md           # This documentation
```

## Setup Instructions

### Prerequisites
- Web server with PHP support (Apache, Nginx, or built-in PHP server)
- PHP 7.4 or higher
- SQLite extension enabled in PHP

### Installation

1. **Copy Files**: Place all files in your web server directory
2. **Set Permissions**: Ensure the directory is writable for database creation
3. **Start Server**: Use one of the following methods:

#### Option 1: Built-in PHP Server (Recommended for testing)
```bash
cd website_test
php -S localhost:8000
```

#### Option 2: XAMPP/WAMP/MAMP
- Copy files to `htdocs` folder
- Access via `http://localhost/website_test/`

#### Option 3: Apache/Nginx
- Configure virtual host pointing to the directory
- Ensure PHP is properly configured

### Database
The SQLite database (`user_data.db`) will be automatically created when the first form is submitted. No manual setup required.

## Usage

### Main Features
1. **Navigation**: Click on Home, About, or Contact in the header to switch sections
2. **Form Submission**: Fill out the registration form with validation
3. **Interactive Buttons**: 
   - "Change Background Color": Cycles through different color themes
   - "Show Current Time": Displays formatted current date and time

### API Endpoints

#### Submit Form Data
```
POST /process.php
Content-Type: application/x-www-form-urlencoded

name=John+Doe&email=john@example.com&message=Hello+World
```

#### View All Submissions
```
GET /process.php?action=list
```

#### View Statistics
```
GET /process.php?action=stats
```

## Technical Details

### Security Features
- Input validation and sanitization
- XSS protection with `htmlspecialchars()`
- SQL injection prevention with prepared statements
- CSRF protection ready (can be extended)

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement approach

### Performance
- Optimized CSS with efficient selectors
- Minimal JavaScript for fast loading
- SQLite for lightweight database operations

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- CSS custom properties for easy theme customization
- Responsive breakpoints for different screen sizes

### Functionality
- Add new form fields in `index.html` and update validation in `script.js`
- Extend PHP processing in `process.php` for additional features
- Add new interactive elements with JavaScript

### Database
- Extend the database schema in `process.php`
- Add new tables or fields as needed
- Switch to MySQL/PostgreSQL for production use

## Troubleshooting

### Common Issues

1. **Form not submitting**: Check PHP server is running and process.php is accessible
2. **Database errors**: Ensure directory is writable for SQLite file creation
3. **Styling issues**: Verify CSS file path and browser cache
4. **JavaScript errors**: Check browser console for error messages

### Debug Mode
Enable error reporting in `process.php` by ensuring these lines are present:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## License
This project is open source and available under the MIT License.

## Support
For issues or questions, check the browser console and PHP error logs for detailed information.
