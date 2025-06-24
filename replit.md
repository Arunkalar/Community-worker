# Community Worker Website

## Overview

Community Worker is a static service-based platform website that connects service providers with potential clients in local communities. The website serves as a showcase and contact point for various service providers including electricians, plumbers, mechanics, and other skilled professionals. Built with pure HTML, CSS, and JavaScript, it emphasizes clean design, responsiveness, and user experience.

## System Architecture

### Frontend Architecture
- **Static Website**: Pure HTML, CSS, and JavaScript implementation
- **Multi-page Structure**: Four main pages (Home, Services, About, Contact)
- **Component-based CSS**: Modular stylesheets with separate responsive design file
- **Progressive Enhancement**: JavaScript adds interactivity while maintaining core functionality without it

### Technology Stack
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, animations, and responsive design
- **Vanilla JavaScript**: Interactive features and form validation
- **Google Fonts**: Typography enhancement (Inter and Poppins)
- **Font Awesome**: Icon library for UI elements

## Key Components

### Navigation System
- **Sticky Navigation**: Fixed header with smooth scrolling
- **Mobile-first Design**: Hamburger menu for smaller screens
- **Active State Management**: Highlights current page in navigation

### Hero Carousel
- **Auto-scrolling Image Slider**: Background image carousel with overlay
- **Touch/Swipe Support**: Mobile gesture handling
- **Keyboard Navigation**: Accessibility features
- **Auto-pause**: Stops on user interaction and resumes automatically

### Service Provider Cards
- **Grid Layout**: Responsive card system for service providers
- **Interactive Elements**: Hover effects and animations
- **Provider Information**: Image, name, service type, address, and contact details

### Form Validation
- **Real-time Validation**: Immediate feedback on form inputs
- **Email Validation**: Format checking for email fields
- **Phone Formatting**: Automatic phone number formatting
- **Error Handling**: User-friendly error messages

## Data Flow

### Static Content Flow
1. **HTML Structure**: Provides semantic content and layout
2. **CSS Styling**: Applies visual design and responsive behavior
3. **JavaScript Enhancement**: Adds interactivity and dynamic behavior

### User Interaction Flow
1. **Navigation**: Users navigate between pages via menu system
2. **Service Discovery**: Browse service providers on the Services page
3. **Contact**: Submit inquiries through the contact form
4. **Information**: Learn about the platform on the About page

## External Dependencies

### CDN Resources
- **Google Fonts**: Inter and Poppins font families
- **Font Awesome 6.0.0**: Icons and visual elements
- **External Images**: Pixabay images for carousel backgrounds (note: URLs appear truncated in current implementation)

### Development Environment
- **Python HTTP Server**: Simple local development server (port 5000)
- **Node.js Runtime**: Available for potential future enhancements

## Deployment Strategy

### Current Setup
- **Static File Serving**: Python's built-in HTTP server for development
- **Port Configuration**: Runs on port 5000 with automatic port detection
- **File Structure**: Traditional web directory structure with assets organized by type

### Production Considerations
- **Static Hosting**: Suitable for platforms like Netlify, Vercel, or GitHub Pages
- **CDN Integration**: External fonts and icons loaded from CDNs
- **Asset Optimization**: Images and CSS could benefit from minification

### Scalability Options
- **Database Integration**: Future enhancement could add dynamic content management
- **Backend Services**: Contact form could integrate with email services or databases
- **User Authentication**: Potential for user accounts and service provider profiles

## Changelog

```
Changelog:
- June 24, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```