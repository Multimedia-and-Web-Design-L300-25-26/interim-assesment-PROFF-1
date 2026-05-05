# Frontend Context — Coinbase Clone (React + Tailwind)

## Project Overview
Build a pixel-accurate clone of coinbase.com as a React SPA. The frontend
consumes a custom Node.js/MongoDB backend API. Deployed to Netlify.

---

## Tech Stack
| Layer       | Tool                          |
|-------------|-------------------------------|
| Framework   | React 18 + Vite               |
| Routing     | React Router v6               |
| Styling     | Tailwind CSS (utility-only)   |
| Icons       | Heroicons + React Icons       |
| HTTP client | fetch / axios                 |
| Auth        | JWT stored in HTTP-only cookie|
| Deployment  | Netlify                       |

---

## Exact File Structure (follow precisely)
```
src/
├── assets/                   # Images, icons, static files
├── components/
│   ├── common/               # Button, Card, Input, Badge, Modal, Spinner
│   ├── layout/               # Navbar, Footer, Sidebar
│   └── crypto/               # CryptoCard, CryptoRow, PriceChart, MiniSparkline
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── Explore.jsx           # All cryptos list (calls GET /crypto)
│   ├── AssetDetail.jsx       # Single coin detail page
│   ├── Learn.jsx             # Static learn/education page
│   ├── SignIn.jsx            # Login form (calls POST /login)
│   └── SignUp.jsx            # Register form (calls POST /register)
├── data/                     # Fallback mock data, constants
├── hooks/                    # useAuth, useCrypto, useProtectedRoute
├── context/                  # AuthContext (stores user + token state)
├── App.jsx                   # Router setup + protected route logic
├── main.jsx                  # Entry point
└── index.css                 # Tailwind imports (@tailwind base/components/utilities)
```

---

## Pages & What Each Renders

### Home.jsx
- Hero section with headline + CTA buttons ("Get started", "Learn more")
- Top gainers section — fetch from `GET /crypto/gainers` (top 4-6 cards)
- New listings section — fetch from `GET /crypto/new` (top 4-6 cards)
- Full crypto table preview — fetch from `GET /crypto`
- Match coinbase.com layout: dark navbar, white body, blue CTAs

### Explore.jsx
- Full table of all cryptos from `GET /crypto`
- Columns: Logo, Name, Symbol, Price, 24h Change (green/red), Market cap
- Tabs or filter buttons: "All", "Top Gainers", "New Listings"
- Each row links to `/asset/:symbol`

### AssetDetail.jsx
- Fetch single crypto data (filter from `GET /crypto` by symbol)
- Show: name, price, 24h change, chart placeholder, buy/sell buttons (UI only)
- Use `useParams()` to read `:symbol` from URL

### Learn.jsx
- Static page — no API calls
- Educational content cards (what is crypto, how to invest, etc.)
- Match coinbase.com's Learn section visual style

### SignIn.jsx
- Form: Email + Password
- On submit: `POST /api/login` → receive JWT → store in cookie → redirect to `/`
- Show error message if login fails
- Link to `/signup`

### SignUp.jsx
- Form: Name + Email + Password
- On submit: `POST /api/register` → success → redirect to `/signin`
- Show success/error feedback
- Link to `/signin`

### Profile.jsx (Protected)
- Fetch `GET /api/profile` with auth cookie/token
- Display: name, email, account info
- If not authenticated → redirect to `/signin`
- Add to routes as a protected route

---

## Routing Setup (App.jsx)

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/signin" replace />
}

// Routes
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/explore" element={<Explore />} />
  <Route path="/asset/:symbol" element={<AssetDetail />} />
  <Route path="/learn" element={<Learn />} />
  <Route path="/signin" element={<SignIn />} />
  <Route path="/signup" element={<SignUp />} />
  <Route path="/profile" element={
    <ProtectedRoute><Profile /></ProtectedRoute>
  } />
</Routes>
```

---

## Auth Context (context/AuthContext.jsx)

```jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, verify session with backend
  useEffect(() => {
    fetch('/api/profile', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) throw new Error('Login failed')
    const data = await res.json()
    setUser(data.user)
    return data
  }

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

---

## API Integration

### Base URL
```js
// In development
const API_BASE = 'http://localhost:5000/api'

// In production (set in Netlify env vars)
const API_BASE = import.meta.env.VITE_API_URL
```

### All API Calls Required

| Action                | Method | Endpoint              | Auth? |
|-----------------------|--------|-----------------------|-------|
| Register user         | POST   | `/api/register`       | No    |
| Login user            | POST   | `/api/login`          | No    |
| Get user profile      | GET    | `/api/profile`        | Yes   |
| Get all cryptos       | GET    | `/api/crypto`         | No    |
| Get top gainers       | GET    | `/api/crypto/gainers` | No    |
| Get new listings      | GET    | `/api/crypto/new`     | No    |
| Add new crypto (admin)| POST   | `/api/crypto`         | Yes   |

Always pass `credentials: 'include'` on authenticated requests so the cookie is sent.

---

## Design System (match coinbase.com)

### Colors (Tailwind classes)
```
Primary blue:     bg-[#0052FF]  text-[#0052FF]
Dark background:  bg-[#0A0B0D]
Light background: bg-white
Positive (green): text-[#00A86B]
Negative (red):   text-red-500
Gray text:        text-gray-500
Border:           border-gray-200
```

### Typography
- Font: Inter (add via Google Fonts in index.html)
- Headings: `font-bold text-3xl` / `text-2xl` / `text-xl`
- Body: `text-base text-gray-700`
- Labels: `text-sm text-gray-500`

### Reusable Component Specs

**Button (components/common/Button.jsx)**
```jsx
// Variants: primary, secondary, outline
// Sizes: sm, md, lg
// Props: variant, size, onClick, disabled, children
<Button variant="primary" size="md">Get started</Button>
```

**CryptoRow (components/crypto/CryptoRow.jsx)**
```jsx
// Props: name, symbol, price, change24h, icon
// Renders a table row with green/red change indicator
```

**Card (components/common/Card.jsx)**
```jsx
// Rounded white card with shadow
// Props: children, className
```

---

## Responsive Design Requirements
- Mobile-first approach
- Navbar: hamburger menu on mobile, full links on desktop
- Tables: scroll horizontally on mobile (`overflow-x-auto`)
- Grid sections: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- All pages must be usable on 375px, 768px, and 1280px widths

---

## State Management Rules
- Use `useState` for local component state (forms, UI toggles)
- Use `useContext` (AuthContext) for global auth state
- Use `useEffect` for all API calls on component mount
- Custom hooks in `/hooks/` for reusable data fetching logic:
  - `useAuth()` — exposes user, login, logout
  - `useCrypto()` — fetches and returns crypto list
  - `useProtectedRoute()` — redirects unauthenticated users

---

## Netlify Deployment Config
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Create `.env.production`:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Code Quality Rules (exam requirements)
- Every file must have a comment at the top explaining its purpose
- Components must be functional (no class components)
- Props must be clearly named and destructured
- No inline styles — Tailwind classes only
- No external CSS frameworks (no Bootstrap, no MUI)
- All fetch calls must have try/catch error handling
- Loading states must be shown while fetching data

---

## Firecrawl Scraping Instructions for Antigravity Agent
Before building any page:
1. Read all files in `/scrape-data/processed/` to understand the real Coinbase layout
2. Use the scraped structure as a visual reference — match spacing, sections, and color
3. Do not copy code from the scrape — use it only as a design reference
4. Build components to match the scraped layout as closely as possible