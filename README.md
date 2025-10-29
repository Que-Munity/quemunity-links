# Que-Munity - BBQ Recipe App

A comprehensive BBQ and smoking foods recipe application similar to AllRecipes, built specifically for BBQ enthusiasts and pitmasters. Discover authentic barbecue recipes, smoking techniques, and join a community passionate about low and slow cooking.

## 🔥 Features

### Core Features
- **Recipe Browser**: Extensive collection of BBQ recipes with detailed instructions
- **Advanced Search & Filtering**: Find recipes by meat type, cooking method, difficulty, and more
- **Recipe Details**: Comprehensive recipe pages with ingredients, step-by-step instructions, and tips
- **BBQ Guides**: Educational content on smoking techniques, wood types, and BBQ fundamentals

### BBQ-Specific Tools
- **Cooking Timer**: Multiple timers for different stages of your cook
- **Temperature Converter**: Easy Fahrenheit/Celsius conversion
- **Cooking Time Calculator**: Estimate cooking times based on meat type and weight
- **Internal Temperature Guide**: Safe cooking temperatures for different meats

### Specialized Content
- **Wood Recommendations**: Guidance on which woods pair best with different meats
- **Temperature Guides**: Optimal smoking and grilling temperatures
- **Equipment Guides**: Information on smokers, grills, and BBQ tools
- **Regional BBQ Styles**: Learn about different BBQ traditions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd que-munity
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Headless UI
- **Build Tool**: Turbopack

## 📱 Application Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage with featured recipes
│   ├── recipes/
│   │   ├── page.tsx          # Recipe listing with search/filters
│   │   └── [id]/page.tsx     # Individual recipe details
│   ├── guides/
│   │   └── page.tsx          # BBQ guides and tutorials
│   └── tools/
│       └── page.tsx          # BBQ tools and calculators
```

## 🎯 Key Pages

### Homepage (`/`)
- Hero section with search functionality
- Featured recipes showcase
- Community statistics
- Quick navigation to main sections

### Recipes (`/recipes`)
- Comprehensive recipe listing
- Advanced search and filtering
- Recipe cards with key information
- Category and difficulty filtering

### Recipe Details (`/recipes/[id]`)
- Detailed recipe information
- Interactive ingredient checklist
- Step-by-step cooking instructions
- Equipment and wood recommendations
- Temperature and timing guidance

### Guides (`/guides`)
- Educational BBQ content
- Smoking techniques and fundamentals
- Wood type guides
- Temperature and safety information

### Tools (`/tools`)
- Interactive cooking timer
- Temperature converter
- Cooking time calculator
- Internal temperature reference

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach with full desktop support
- **BBQ-Themed Colors**: Warm oranges and reds reflecting BBQ culture
- **Intuitive Navigation**: Clear categorization and search functionality
- **Interactive Elements**: Timers, calculators, and conversion tools
- **Accessibility**: WCAG compliant design patterns

## 🔮 Future Enhancements

- User authentication and profiles
- Recipe submission and rating system
- Community forums and discussions
- Social features (following, sharing)
- Meal planning and shopping lists
- Recipe scaling calculator
- Photo upload for recipes
- Weather integration for outdoor cooking
- Push notifications for timers
- Offline recipe access

## 📖 Contributing

This project is designed to be expanded with additional BBQ-focused features. Areas for contribution include:
- Recipe database expansion
- Additional cooking calculators
- Community features
- Mobile app development
- API integration

## 🧪 Development Notes

- Built with modern React patterns and TypeScript
- Uses Next.js App Router for optimal performance
- Implements responsive design with Tailwind CSS
- Structured for easy feature expansion
- Optimized for SEO and performance

## 📄 License

This project is available for educational and personal use.
