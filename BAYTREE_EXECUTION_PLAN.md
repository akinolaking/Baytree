# BayTree Engineering & Construction
## Website Development — Execution Plan

**Design System:** TypeUI Paper (https://github.com/bergside/typeui)  
**Stack:** Tailwind CSS + TypeScript + Animate UI  
**Approach:** Minimal, infrastructure-focused, honest representation

---

## Brand Foundation (From Approved Guide)

### Core Identity
- **Positioning:** "We build the things people don't see"
- **Philosophy:** Layered, precise, built to last
- **Expertise:** Geosynthetics, marine protection, civil infrastructure

### Visual System
- **Logo:** Five strata bars (layered infrastructure systems)
- **Primary Color:** Forest Green `#2A4B20`
- **Accent:** Laterite Clay `#A8763E` (dividers/highlights only)
- **Neutrals:** Concrete Grey `#6C706C`, Charcoal `#262826`
- **Typography:** Lato (all weights: Thin, Light, Regular, Bold)

### Brand Pillars
1. We measure twice
2. We go deep
3. We own the whole job
4. We build for decades

---

## Site Structure (Minimal Approach)

```
/
├── index.html                  # Homepage
├── services.html               # What we do
├── projects.html               # Project portfolio
├── about.html                  # Company story
├── contact.html                # Get in touch
├── assets/
│   ├── css/
│   │   └── main.css           # Tailwind build
│   ├── js/
│   │   ├── main.ts            # TypeScript entry
│   │   └── animations.ts      # Animate UI
│   ├── images/
│   │   ├── logo-*.svg         # Logo variations
│   │   └── projects/          # Project imagery
│   └── fonts/
│       └── lato/              # Lato family
└── components/
    ├── header.ts              # Nav component
    ├── footer.ts              # Footer component
    └── project-card.ts        # Reusable card
```

---

## Phase 1: Foundation Setup (Day 1-2)

### 1.1 Project Initialization
```bash
mkdir baytree-website && cd baytree-website
npm init -y
npm install -D tailwindcss typescript @types/node
npm install typeui-paper animate-ui
npx tailwindcss init -p
npx tsc --init
```

### 1.2 Tailwind Configuration
**File:** `tailwind.config.js`

```javascript
module.exports = {
  content: [
    "./*.html",
    "./components/**/*.{js,ts}",
    "./assets/js/**/*.{js,ts}"
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from guide
        'forest-green': '#2A4B20',
        'laterite-clay': '#A8763E',
        'concrete-grey': '#6C706C',
        'charcoal': '#262826',
        'moss': '#446B35',
        'sage': '#809870',
        'silver': '#B2B6B0',
        'oyster': '#F6F4EF',
      },
      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('typeui-paper'),  // Paper design system
  ],
}
```

### 1.3 TypeScript Setup
**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./assets/js",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["assets/js/**/*", "components/**/*"],
  "exclude": ["node_modules"]
}
```

---

## Phase 2: Component Architecture (Day 2-3)

### 2.1 Header Component
**File:** `components/header.ts`

```typescript
export class Header {
  private element: HTMLElement;
  
  constructor() {
    this.element = document.querySelector('header')!;
    this.init();
  }
  
  private init(): void {
    // Sticky header on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        this.element.classList.add('bg-white', 'shadow-md');
      } else {
        this.element.classList.remove('bg-white', 'shadow-md');
      }
    });
    
    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuBtn?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('hidden');
    });
  }
}
```

### 2.2 Project Card Component
**File:** `components/project-card.ts`

```typescript
interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
}

export class ProjectCard {
  static create(project: Project): string {
    return `
      <div class="paper-card hover:shadow-lg transition-shadow duration-300">
        <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <span class="text-xs uppercase tracking-wider text-laterite-clay font-bold">
            ${project.category}
          </span>
          <h3 class="mt-2 text-xl font-bold text-forest-green">
            ${project.title}
          </h3>
          <p class="mt-3 text-concrete-grey leading-relaxed">
            ${project.description}
          </p>
          ${project.link ? `
            <a href="${project.link}" class="mt-4 inline-block text-sm font-bold text-forest-green hover:text-moss transition">
              View Project →
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }
}
```

---

## Phase 3: Page Templates (Day 3-5)

### 3.1 Homepage Structure
**File:** `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BayTree Engineering & Construction | Infrastructure Built to Last</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
    <link href="./assets/css/main.css" rel="stylesheet">
</head>
<body class="font-lato">
    
    <!-- Header -->
    <header class="fixed w-full top-0 z-50 transition-all duration-300">
        <!-- Header content -->
    </header>

    <!-- Hero Section -->
    <section class="hero pt-32 pb-20 bg-oyster">
        <div class="container mx-auto px-6">
            <!-- Five strata bars logo -->
            <div class="logo-strata mb-8"></div>
            
            <h1 class="text-5xl md:text-7xl font-bold text-forest-green leading-tight">
                We build the things<br>people don't see.
            </h1>
            
            <p class="mt-6 text-xl text-concrete-grey max-w-2xl">
                Layered infrastructure systems. Coastal protection. Geosynthetics.
                Built to last decades.
            </p>
            
            <div class="mt-10 flex gap-4">
                <a href="#services" class="paper-btn-primary">Our Work</a>
                <a href="/contact.html" class="paper-btn-secondary">Get in Touch</a>
            </div>
        </div>
    </section>

    <!-- Brand Pillars -->
    <section class="py-20 bg-white">
        <div class="container mx-auto px-6">
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Pillar cards -->
            </div>
        </div>
    </section>

    <!-- Featured Projects -->
    <section class="py-20 bg-oyster">
        <!-- Project grid -->
    </section>

    <!-- Footer -->
    <footer class="bg-forest-green text-white py-12">
        <!-- Footer content -->
    </footer>

    <script type="module" src="./assets/js/main.js"></script>
</body>
</html>
```

### 3.2 Services Page Content

**Sections:**
1. **Geosynthetics Engineering**
   - Reinforcement systems
   - Drainage solutions
   - Erosion control

2. **Marine & Coastal Protection**
   - Shoreline stabilization
   - Breakwater construction
   - Scour protection

3. **Civil Infrastructure**
   - Highway construction
   - Drainage systems
   - Ground improvement

---

## Phase 4: Animations & Interactions (Day 5-6)

### 4.1 Scroll Animations
**File:** `assets/js/animations.ts`

```typescript
import 'animate-ui';

export class ScrollAnimations {
  private observer: IntersectionObserver;
  
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    this.observe();
  }
  
  private observe(): void {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => this.observer.observe(el));
  }
}
```

### 4.2 TypeUI Paper Components

**Use Paper design system for:**
- Cards (`paper-card`)
- Buttons (`paper-btn-primary`, `paper-btn-secondary`)
- Forms (`paper-input`, `paper-textarea`)
- Elevation (`paper-elevation-2`, `paper-elevation-4`)

---

## Phase 5: Content Integration (Day 6-7)

### 5.1 Content Blocks

**Homepage:**
- Hero: "We build what you don't see"
- Pillars: 4 key differentiators
- Featured projects: 3-4 highlights
- Capabilities overview
- CTA: Contact

**Services:**
- Overview paragraph
- 3 service categories (detailed)
- Process timeline
- Certifications/standards
- CTA: Project inquiry

**Projects:**
- Grid/filter by category
- Project cards with imagery
- Case study format:
  - Challenge
  - Solution
  - Outcome
  - Technical specs

**About:**
- Company story
- Team (if available)
- Values alignment
- Certifications
- Contact CTA

**Contact:**
- Simple form
- Location/office info
- Email/phone direct
- LinkedIn/social (if exists)

---

## Phase 6: Optimization & Launch (Day 7-8)

### 6.1 Performance Checklist
- [x] Minify CSS/JS
- [ ] Optimize images (WebP format, lazy loading)
- [x] Add meta tags (SEO)
- [x] Test responsive breakpoints
- [x] Cross-browser testing
- [x] Accessibility audit (WCAG AA)

### 6.2 SEO Essentials
```html
<meta name="description" content="BayTree Engineering & Construction delivers specialized geosynthetics, marine protection, and civil infrastructure solutions across Nigeria.">
<meta property="og:title" content="BayTree Engineering & Construction">
<meta property="og:description" content="We build the things people don't see. Infrastructure built to last.">
<meta property="og:image" content="/assets/images/og-image.png">
```

---

## Design Decisions (TypeUI Paper Alignment)

### 1. **Minimal Aesthetic**
- Clean typography hierarchy (Lato weights)
- Generous white space (padding/margins in 8px increments)
- Subtle shadows (Paper elevation system)
- No unnecessary decorative elements

### 2. **Honest Representation**
- Logo shows actual layered systems (five bars)
- Project photography over illustrations
- Concrete language over marketing fluff
- Technical accuracy in descriptions

### 3. **Color Restraint**
- Forest Green dominates (60-70% of colored areas)
- Laterite Clay as accent only (dividers, highlights)
- Concrete Grey for body text
- White/Oyster backgrounds

### 4. **Typography Scale**
```css
.text-xs      /* 12px - Labels, metadata */
.text-sm      /* 14px - Secondary text */
.text-base    /* 16px - Body text */
.text-lg      /* 18px - Lead paragraphs */
.text-xl      /* 20px - Subheadings */
.text-2xl     /* 24px - Section titles */
.text-4xl     /* 36px - Page titles */
.text-7xl     /* 72px - Hero headlines */
```

---

## File Delivery Checklist

### Assets Required
- [ ] Logo SVG files (primary, horizontal, icon)
- [ ] Lato font files (if self-hosting)
- [ ] Project images (minimum 6-8 high-quality)
- [x] Favicon (from icon mark)
- [x] Social media OG image

### Code Deliverables
- [x] All HTML pages
- [x] Compiled CSS (Tailwind build)
- [ ] Compiled JS (TypeScript build)
- [ ] Component library
- [x] Documentation (README.md)

### Deployment
- [x] Build scripts (`npm run build`)
- [ ] Hosting setup instructions
- [ ] Domain configuration guide
- [ ] Analytics integration (optional)

---

## Timeline Summary

**Day 1-2:** Setup + Configuration  
**Day 3-5:** Page Templates + Content  
**Day 5-6:** Animations + Interactions  
**Day 6-7:** Content Integration  
**Day 7-8:** Optimization + Launch  

**Total:** 8 working days for minimal, production-ready site

---

## Success Criteria

✅ **Brand Alignment:** Visual identity matches approved guide  
✅ **Performance:** Lighthouse score 90+ (Performance, Accessibility, SEO)  
✅ **Responsiveness:** Works flawlessly on mobile, tablet, desktop  
✅ **Maintainability:** Clean code, documented, easy to update  
✅ **Honesty:** Content accurately represents capabilities  

---

## Post-Launch Considerations

1. **Content Updates:** Blog/news section (Phase 2)
2. **Project Gallery:** Expanded portfolio with filters
3. **Client Portal:** Document sharing/project tracking (Future)
4. **Multilingual:** English + potential local language support

---

**Principle:** Keep it simple. No over-boarding. Infrastructure focus. Honest representation. TypeUI Paper for clean, minimal design system foundation.
