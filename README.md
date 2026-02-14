# Fat Cat Shop

A self-hosted e-commerce platform for small product catalogs, built with Next.js 15 and SQLite. Designed with a warm, playful cat-themed aesthetic (teal + peach claymorphism).

## Features

### Storefront
- **Product Catalog** - Responsive grid with category support, pricing with discount display
- **Product Detail** - Image gallery, breadcrumbs, tags, Add to Cart
- **Shopping Cart** - Zustand store with localStorage persistence, quantity controls
- **Checkout** - Customer info collection, shipping address, order notes
- **Payment** - Cash on Delivery (COD) + Stripe (configurable)
- **Order Confirmation** - Success page with order number

### Admin Dashboard (`/admin`)
- **Authentication** - HMAC-signed cookie session, single admin login
- **Dashboard** - Stats overview (products, orders, customers, revenue) + recent orders
- **Product Management** - Full CRUD with category, status, tags, price management
- **Order Management** - Order list with status badges, detail view, status flow (pending → confirmed → shipped → delivered)
- **Customer Management** - Customer list with contact info and order history

### Design System
- **Theme** - Teal primary (#108474), peach backgrounds, warm brown text
- **Typography** - Comfortaa (headings) + Epilogue (body) via Google Fonts
- **Style** - Claymorphism with soft 3D shadows, rounded corners, playful hover effects
- **Accessibility** - Focus-visible rings, aria-labels, prefers-reduced-motion, 44px touch targets
- **Responsive** - Mobile-first, tested at 375px / 768px / 1024px / 1440px

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, `output: 'standalone'`) |
| Database | SQLite via better-sqlite3 |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS v4 |
| State | Zustand (cart) + React Server Components |
| Validation | Zod |
| Auth | HMAC-signed cookies (no external deps) |
| Payment | Stripe + COD |
| Deployment | Docker + Caddy (auto HTTPS) |

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm

### Installation

```bash
git clone https://github.com/WangDan1219/fat-cat-shop.git
cd fat-cat-shop
pnpm install
```

### Database Setup

Generate and run migrations, then seed with sample data:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

This creates `data/fat-cat.db` with 3 categories and 8 sample products.

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

**Default admin credentials:**
- Username: `admin`
- Password: `fatcat2024`

### Environment Variables

Copy `.env.example` and configure:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `fatcat2024` |
| `SESSION_SECRET` | HMAC signing key for session cookies | `dev-secret-change-in-production` |
| `STRIPE_SECRET_KEY` | Stripe secret key | — |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | — |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | — |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `http://localhost:3000` |

## Project Structure

```
src/
├── app/
│   ├── (storefront)/          # Public shop pages
│   │   ├── page.tsx           # Homepage (hero + featured products)
│   │   ├── products/          # Product list & detail
│   │   ├── cart/              # Shopping cart
│   │   └── checkout/          # Checkout & order confirmation
│   ├── admin/                 # Admin dashboard (auth-protected)
│   │   ├── login/             # Login page
│   │   └── (dashboard)/       # Dashboard, products, orders, customers
│   └── api/                   # API routes
│       ├── auth/              # Login/logout
│       ├── checkout/          # Order creation
│       ├── upload/            # Image upload
│       └── admin/             # Admin CRUD endpoints
├── components/
│   ├── storefront/            # Header, footer, product card, add-to-cart
│   └── admin/                 # Sidebar, product form, order status updater
├── lib/
│   ├── db/                    # Database connection, schema, seed
│   ├── auth.ts                # Session management
│   ├── utils.ts               # formatPrice, cn
│   └── validators.ts          # Zod schemas
└── stores/
    └── cart-store.ts          # Zustand cart with localStorage
```

## Database Schema

10 tables with full relational mapping:

- **categories** - Product categories with slug and sort order
- **products** - Title, slug, price (in cents), status, tags
- **product_images** - Multiple images per product with sort order
- **customers** - Name, email, phone, notes
- **customer_addresses** - Multiple addresses per customer
- **orders** - Order number, status, payment method/status, totals
- **order_line_items** - Snapshot of product title and price at time of order
- **order_status_history** - Audit log of status transitions
- **analytics_events** - Raw pageview/event tracking
- **analytics_daily_summary** - Aggregated daily stats

Prices are stored as integers (cents) to avoid floating-point precision issues. Order line items snapshot product data to preserve historical accuracy.

## Production Deployment

### Docker

```bash
docker compose up -d
```

This starts:
- **app** - Next.js standalone server on port 3000
- **caddy** - Reverse proxy with automatic HTTPS

Configure your domain in `Caddyfile`:

```
your-domain.com {
    reverse_proxy app:3000
}
```

Data is persisted in a Docker volume (`app-data`).

### Manual

```bash
pnpm build
pnpm start
```

The standalone build outputs to `.next/standalone/`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:studio` | Open Drizzle Studio (DB browser) |
| `pnpm db:seed` | Seed database with sample data |

## License

Private project.
