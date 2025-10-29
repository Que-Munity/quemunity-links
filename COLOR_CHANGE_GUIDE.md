# 🎨 How to Change Colors in Your App

## Quick Color Reference

### Orange Colors (Current Theme):
- `text-orange-600` - Dark orange (main headings)
- `text-orange-500` - Medium orange (sub-headings)  
- `text-orange-400` - Light orange (links, navigation)
- `text-orange-300` - Very light orange (hover states)

### Other Colors:
- `text-red-500`, `text-blue-500`, `text-green-500` etc.
- `bg-orange-500` for background colors
- `border-orange-500` for borders

## How to Change Text Colors:

### Method 1: Tailwind Classes (Recommended)
```jsx
// OLD
<h1 className="text-red-500">Title</h1>

// NEW  
<h1 className="text-orange-600">Title</h1>
```

### Method 2: Inline Styles (Avoid if possible)
```jsx
// OLD
<h1 style={{color: '#dc2626'}}>Title</h1>

// NEW
<h1 className="text-orange-600">Title</h1>
```

## Key Files to Check:

### 1. Navigation Bar
**File**: `src/components/Navigation.tsx`
- Logo colors
- Menu link colors
- Mobile menu colors

### 2. Homepage 
**File**: `src/app/page.tsx`
- Hero section
- Featured recipes
- Footer section

### 3. Other Pages
Look for files ending in `page.tsx` in:
- `src/app/recipes/`
- `src/app/community/`  
- `src/app/guides/`

## Quick Find & Replace:

### To change ALL red to orange:
1. Press `Ctrl+Shift+F` (Find in Files)
2. Search for: `text-red-`
3. Replace with: `text-orange-`
4. Or search for: `#dc2626` 
5. Replace with: `text-orange-600` (remove style attribute)

### To change specific elements:
1. Open the page file
2. Look for `className="...` 
3. Find the color class (`text-red-500`)
4. Change to desired orange (`text-orange-500`)

## Color Hierarchy:
- **Main Titles**: `text-orange-600`
- **Sub-headings**: `text-orange-500` 
- **Navigation Links**: `text-orange-400`
- **Hover States**: `text-orange-300`
- **Icons**: `text-orange-500` or `text-orange-600`

## Pro Tips:
- Use Tailwind classes instead of inline styles
- Keep colors consistent across pages
- Test on mobile (responsive design)
- Check hover states work properly