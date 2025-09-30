# QueueFree - Live Crowd Tracking & Booking

QueueFree is a web application that helps users skip queues by providing real-time crowd tracking and advance booking for venues in Pune, India.

## Features

- **Real-time Crowd Tracking**: View live crowd levels at restaurants, cafes, gyms, and salons
- **Smart Booking System**: Reserve your spot in advance and pre-order items
- **AI-Powered Filters**: Find venues based on your preferences (quiet, lively, etc.)
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Live Updates**: Crowd levels update every 5 seconds to simulate real-time data

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Inter)
- **Icons**: Heroicons (SVG icons)
- **Images**: Unsplash API

## Project Structure

```
QUEUEFREE/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom CSS styles
├── js/
│   └── main.js         # Main JavaScript functionality
├── assets/
│   ├── images/         # Local images (if any)
│   └── icons/          # Custom icons (if any)
└── README.md           # Project documentation
```

## Installation & Setup

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. No additional installation required - the project uses CDN links for external dependencies

## Usage

### For Users
1. **Browse Venues**: View available restaurants, cafes, gyms, and salons in Pune
2. **Check Crowd Levels**: See real-time crowd status (Not Busy, Moderate, Busy)
3. **Search & Filter**: Use the search bar or AI filters to find specific venues
4. **Book in Advance**: Reserve your spot and pre-order items
5. **Manage Bookings**: View and cancel your upcoming bookings

### For Developers
1. **Venue Data**: Modify `venuesData` array in `main.js` to add/update venues
2. **Styling**: Customize appearance in `css/styles.css`
3. **Functionality**: Extend features in `js/main.js`

## Key Features Explained

### Real-time Crowd Simulation
The application simulates live crowd tracking by updating venue crowd levels every 5 seconds using a random algorithm that mimics realistic crowd fluctuations.

### Smart Filtering
- **Text Search**: Search by venue name, location, or tags
- **Category Filter**: Filter by Restaurant, Cafe, Gym, or Salon
- **Availability Filter**: Show only available or not-busy venues
- **AI Query**: Natural language filtering (e.g., "quiet place for work")

### Booking System
- **Instant Booking**: Reserve tables or services with just a few clicks
- **Pre-ordering**: Order food/drinks in advance for restaurants and cafes
- **Booking Management**: View, modify, or cancel bookings

### Theme Support
- **Auto-detection**: Respects system dark/light mode preference
- **Manual Toggle**: Users can manually switch themes
- **Persistent**: Theme preference is saved in localStorage

## Founders

- **Parth Waghe** - parth.2403093105@vcet.edu.in
- **Venuparmesh Kumarlingam**
- **Yash Sawant**
- **Hari Sharma**

Contact: 8070006402

## Browser Compatibility

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

© 2025 QueueFree. All Rights Reserved.

## Future Enhancements

- Backend integration for real data
- User authentication and profiles
- Payment gateway integration
- Push notifications
- Mobile app development
- Admin dashboard for venue owners
- Analytics and reporting
- API integration with venue management systems
