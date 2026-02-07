# Deployment Guide

This guide will help you deploy the BarangayMo application to production.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A server or hosting platform (VPS, Railway, Render, Vercel, etc.)

## Environment Variables

Before deploying, update these environment variables in `.env.local`:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database path | Yes |
| `NEXTAUTH_URL` | Your app's URL (e.g., `https://yourdomain.com`) | Yes |
| `NEXTAUTH_SECRET` | Random secret string for JWT encryption | Yes |
| `NODE_ENV` | Set to `production` | Yes |

### Generate a Secure NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Deployment Options

### Option 1: VPS/Dedicated Server (Recommended)

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd barangaymo
```

2. **Install dependencies:**
```bash
npm ci
```

3. **Set up environment variables:**
```bash
cp .env.local .env
# Edit .env with your production values
nano .env
```

4. **Build the application:**
```bash
npm run build
```

5. **Start the application:**
```bash
npm start
```

6. **Set up PM2 for process management (optional but recommended):**
```bash
npm install -g pm2
pm2 start npm --name "barangaymo" -- start
pm2 save
pm2 startup
```

7. **Set up Nginx as reverse proxy:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t barangaymo .
docker run -p 3000:3000 --env-file .env barangaymo
```

### Option 3: Railway/Render/Platform-as-a-Service

1. Push your code to GitHub
2. Connect your repository to the platform
3. Set environment variables in the platform dashboard
4. Deploy!

**Note:** For SQLite on PaaS platforms, you may need to:
- Use a persistent disk/volume for the database file
- Or migrate to a hosted database like PostgreSQL

## Database Considerations

### SQLite (Current)
- ✅ Simple, no separate server needed
- ✅ Great for single-instance deployments
- ⚠️ Not suitable for multiple server instances
- ⚠️ File permissions must be correct

### Migrating to PostgreSQL/MySQL

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql" // or "mysql"
  url      = env("DATABASE_URL")
}
```

2. Update `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://user:password@host:port/dbname"
```

3. Run migration:
```bash
npx prisma migrate deploy
```

## Post-Deployment Checklist

- [ ] Change NEXTAUTH_SECRET to a secure random string
- [ ] Update NEXTAUTH_URL to your production domain
- [ ] Ensure database file has correct permissions (SQLite)
- [ ] Set up SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Set up automated backups for the database
- [ ] Enable logging and monitoring
- [ ] Test all authentication flows
- [ ] Test all CRUD operations

## Troubleshooting

### Build Errors
```bash
# Clean and rebuild
rm -rf .next
rm -rf node_modules
npm ci
npm run build
```

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database file exists and is readable/writable
- Check file permissions

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain exactly
- Check that cookies are being set correctly

## Support

For issues or questions, please check:
1. Next.js documentation: https://nextjs.org/docs
2. NextAuth documentation: https://next-auth.js.org
3. Prisma documentation: https://www.prisma.io/docs
