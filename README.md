# BayTree Engineering & Construction
## Website Prototype

**Design System:** Minimal, honest, infrastructure-focused  
**Built with:** Tailwind CSS (CDN) + Vanilla JavaScript  
**Brand Colors:** Forest Green (#2A4B20), Laterite Clay (#A8763E)

---

## Quick Start

1. **Open `index.html` in a browser** - No build step required (using Tailwind CDN)
2. **For development:** Open in VS Code with Live Server extension
3. **For production:** Build with actual Tailwind CLI (see package.json)

---

## File Structure

```
baytree-website/
├── index.html              # Homepage (COMPLETE)
├── services.html           # Services page (template)
├── projects.html           # Projects portfolio (template)
├── about.html              # Company story (template)
├── contact.html            # Contact form (template)
├── package.json            # Build configuration
├── tailwind.config.js      # Tailwind with brand colors
└── assets/
    ├── css/
    │   └── input.css       # Custom Paper components
    └── images/             # Logo SVGs and project imagery
```

---

## Brand Implementation

### Logo (Five Strata Bars)
```html
<div class="flex flex-col gap-0.5 w-12">
    <div class="h-1.5 bg-forest-green rounded-sm opacity-100"></div>
    <div class="h-1.5 bg-forest-green rounded-sm opacity-85"></div>
    <div class="h-1.5 bg-moss rounded-sm opacity-70"></div>
    <div class="h-1.5 bg-sage rounded-sm opacity-55"></div>
    <div class="h-1.5 bg-sage rounded-sm opacity-40"></div>
</div>
```

### Color Usage
- **Forest Green** (#2A4B20) - Primary, dominates 60-70%
- **Laterite Clay** (#A8763E) - Accent, dividers/highlights only
- **Concrete Grey** (#6C706C) - Body text
- **Oyster** (#F6F4EF) - Section backgrounds

### Typography
- **Lato** from Google Fonts
- Weights: 300 (Light), 400 (Regular), 700 (Bold), 900 (Black)
- All caps for labels/metadata

---

## Features Implemented

### Homepage ✅
- Hero section with five strata bars logo
- "We build what you don't see" headline
- Four brand pillars (measure twice, go deep, own the job, build for decades)
- Capabilities overview section
- Featured projects grid
- CTA section
- Footer with branding

### Components ✅
- Sticky header with scroll behavior
- Mobile menu (hamburger)
- Paper design cards with hover effects
- Scroll animations (fade-in-up)
- Responsive grid layouts

### Interactions ✅
- Header background appears on scroll
- Mobile menu toggle
- Scroll-triggered animations
- Card hover elevations
- Button hover states

---

## To Complete

### Content Needed:
1. **Project Images** - Replace gradient placeholders with actual project photography
2. **About Page Content** - Company history, team, certifications
3. **Services Detail** - Expand each service category with technical specs
4. **Contact Info** - Real phone numbers, email, physical address
5. **Logo SVG Files** - Export from brand guide and add to /assets/images/

### Additional Pages:
- Services (template structure ready)
- Projects (portfolio grid ready)
- About (company story template)
- Contact (form template)

---

## Build for Production

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run dev

# Production build (minified)
npm run build
```

---

## Design Principles Applied

### 1. Minimal Aesthetic
✅ Clean typography hierarchy  
✅ Generous white space (8px grid)  
✅ Subtle shadows (Paper elevation)  
✅ No unnecessary decoration  

### 2. Honest Representation
✅ Five bars = actual layered infrastructure systems  
✅ Straightforward language ("We measure twice" not "world-class")  
✅ Technical accuracy in descriptions  
✅ Project imagery over illustrations (when added)  

### 3. Color Restraint
✅ Forest Green dominates  
✅ Laterite only for accents  
✅ Maximum 3 colors per section  
✅ White/Oyster backgrounds  

---

## Performance Checklist

- [ ] Replace Tailwind CDN with compiled CSS (production)
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Add meta tags for SEO
- [ ] Test responsive breakpoints
- [ ] Cross-browser testing
- [ ] Accessibility audit (WCAG AA)
- [ ] Add favicon
- [ ] Add OG image for social sharing

---

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Credits

**Design & Development:** OneNet Servers  
**Brand Identity:** Approved BayTree Brand Guide (April 2026)  
**Design System:** Paper-inspired minimal components  
**Framework:** Tailwind CSS

---

## License

Proprietary - BayTree Engineering & Construction Limited © 2026
