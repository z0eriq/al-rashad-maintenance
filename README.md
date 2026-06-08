# شركة الرشاد لصيانة السيارات - Al Rashad Auto Maintenance

نظام حجز مواعيد صيانة السيارات — الوكيل الحصري لكيا عراق. يسمح للعملاء بحجز مواعيد الصيانة عبر الإنترنت مع لوحة تحكم إدارية كاملة.

## Technology Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **MySQL** + **Prisma ORM**
- **JWT Authentication** (jose)
- **Arabic RTL** support

## Features

### Public Website
- Home, About, Services, Contact pages
- SEO (Meta tags, Open Graph, Sitemap, robots.txt)
- WhatsApp integration & Google Maps

### Customer Portal
- Registration, Login, Forgot Password
- Dashboard, Profile, Appointments
- Book/Cancel appointments with time slot selection
- In-app + email notifications on status changes

### Admin Dashboard
- Statistics overview (Server Components + ISR)
- Customer CRUD with search & pagination
- Appointment management (approve, reject, reschedule)
- Service management
- Contact messages inbox
- Monthly reports with PDF (Arabic) & Excel export

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

## Installation

### 1. Clone and install dependencies

```bash
cd al-rashad-maintenance
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DATABASE_URL="mysql://root:password@localhost:3306/al_rashad"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Create MySQL database

```sql
CREATE DATABASE al_rashad CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Push schema and seed data

```bash
npm run db:push
npm run db:seed
```

### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Accounts

| Role     | Email                | Password     |
|----------|----------------------|--------------|
| Admin    | admin@alrashad.com   | Admin@123456 |
| Customer | customer@demo.com    | Demo@1234    |

## Project Structure

```
al-rashad-maintenance/
├── app/
│   ├── (public pages)     # Home, About, Services, Contact
│   ├── dashboard/         # Customer portal
│   ├── admin/             # Admin dashboard
│   ├── api/               # REST API routes
│   ├── layout.tsx         # Root layout (RTL, Arabic)
│   └── sitemap.ts         # SEO sitemap
├── components/
│   ├── ui/                # Reusable UI components
│   └── layout/            # Header, Footer, Sidebars
├── lib/
│   ├── prisma.ts          # Database client
│   ├── auth.ts            # Password hashing, RBAC
│   ├── jwt.ts             # JWT sign/verify
│   ├── validation.ts      # Zod schemas
│   └── notifications.ts   # Notification system
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
└── middleware.ts          # Route protection
```

## API Routes

| Method | Route                        | Description              |
|--------|------------------------------|--------------------------|
| POST   | /api/auth/register           | Customer registration    |
| POST   | /api/auth/login              | Login                    |
| POST   | /api/auth/logout             | Logout                   |
| GET    | /api/auth/me                 | Current user             |
| GET    | /api/appointments            | List appointments        |
| POST   | /api/appointments            | Create appointment       |
| PATCH  | /api/appointments/[id]       | Update appointment       |
| GET    | /api/services                | List services            |
| GET    | /api/availability            | Available time slots     |
| GET    | /api/admin/stats             | Dashboard statistics     |
| GET    | /api/admin/reports           | Monthly reports          |
| GET    | /api/admin/contacts          | Contact messages         |

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.example`
4. Use a hosted MySQL (PlanetScale, Railway, or AWS RDS)
5. Run migrations: `npx prisma db push`
6. Seed production: `npm run db:seed`

### Docker / VPS

```bash
npm run build
npm start
```

Ensure MySQL is accessible and all env vars are set.

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string (32+ chars)
- [ ] Change admin password after first login
- [ ] Set `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Configure SSL/HTTPS
- [ ] Configure SMTP env vars for email delivery
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain

## Performance Optimizations

- Server Components for public pages with ISR (`revalidate`)
- Prisma connection pooling (singleton pattern)
- Dynamic imports for PDF/Excel export libraries
- `optimizePackageImports` for lucide-react
- Image optimization via Next.js Image
- Font display swap for Cairo Arabic font

## Security

- JWT stored in httpOnly cookies
- bcrypt password hashing (12 rounds)
- Role-based access control (CUSTOMER / ADMIN)
- Zod input validation on all API routes
- Middleware route protection
- SQL injection prevention via Prisma ORM

## License

Private - Al Rashad Maintenance Company
