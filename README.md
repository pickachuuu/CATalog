# CATalog

A mobile inventory management application that helps you track and organize your products with ease.

![CATalog App](https://via.placeholder.com/800x400?text=CATalog+App)

## Overview

CATalog is a React Native mobile application designed to simplify inventory management. It allows users to track products, manage stock levels, and organize items by categories, all from the convenience of their mobile device.

## Features

- **Product Management**: Create, read, update, and delete products
- **Category Organization**: Assign products to categories for better organization
- **Stock Tracking**: Monitor inventory levels with visual indicators
- **Low Stock Alerts**: Set thresholds to be notified when products are running low
- **Search Functionality**: Quickly find products by name or category
- **Image Support**: Add product images for better identification

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Emulator

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/CATalog.git
   cd CATalog
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npx expo start
   ```

4. Run on your preferred platform:
   - Press `i` to run on iOS simulator
   - Press `a` to run on Android emulator
   - Scan the QR code with the Expo Go app on your physical device

## Project Structure

```
CATalog/
├── app/                  # Main application code
│   ├── (tabs)/           # Tab-based navigation screens
│   │   ├── products.tsx  # Products screen
│   │   ├── categories.tsx # Categories screen
│   │   └── styles/       # Component-specific styles
│   │       └── common.styles.ts # Shared styles
├── components/           # Reusable UI components
├── services/            # Business logic and API services
├── types/               # TypeScript type definitions
└── assets/              # Images, fonts, and other static assets
```

## Usage Guide

### Managing Products

1. **Adding a Product**:
   - Tap the "+" button on the Products screen
   - Fill in the product details (name, quantity, category)
   - Optionally add an image
   - Tap "Save Product"

2. **Editing a Product**:
   - Tap the three dots menu on a product card
   - Select "Edit Product"
   - Update the details
   - Tap "Update Product"

3. **Deleting a Product**:
   - Tap the three dots menu on a product card
   - Select "Delete Product"
   - Confirm deletion

### Managing Categories

1. **Adding a Category**:
   - Navigate to the Categories screen
   - Tap the "+" button
   - Enter the category name
   - Tap "Save Category"

2. **Assigning Categories to Products**:
   - When adding or editing a product, select a category from the dropdown

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Native
- Expo
- React Native Paper
- And all other open-source libraries used in this project 