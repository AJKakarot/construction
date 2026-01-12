# Construction Material Calculator

A modern, clean React application for managing construction material billing with PDF generation capability.

## Features

- ✅ Clean, professional, mobile-friendly UI
- ✅ Card-based layout with centered container
- ✅ Five construction materials: Cement, Maorang, Gitti, Sariya, Ring
- ✅ Quantity controls with + and - buttons
- ✅ Manual price input for each product
- ✅ Real-time subtotal and grand total calculations
- ✅ PDF generation with formatted bill
- ✅ Indian Rupee (₹) currency display
- ✅ Responsive design for all devices

## Tech Stack

- React 18 (Functional components with hooks)
- useState for state management
- CSS for styling
- jsPDF for PDF generation
- Vite for build tooling

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Usage

1. Enter the price for each construction material in the price input field
2. Use the + and - buttons to adjust quantities
3. View real-time subtotals and grand total
4. Click "Generate PDF" to download a formatted bill

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```
