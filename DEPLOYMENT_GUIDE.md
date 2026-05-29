# 🚀 DEPLOYMENT GUIDE - APLIKASI PERPUSTAKAAN

## 📋 DEPLOYMENT OPTIONS

### 1. 🖥️ LOCAL DEVELOPMENT
```bash
npm run dev
```

### 2. 🌐 PRODUCTION DEPLOYMENT
```bash
npm run build
npm start
```

### 3. ☁️ CLOUD DEPLOYMENT
- Heroku
- Vercel (Frontend)
- Railway
- DigitalOcean

---

## 🔧 PRODUCTION SETUP

### 1. Environment Variables
Create `.env.production`:
```env
# Backend
PORT=5000
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=db_perpustakaan
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production

# Frontend
VITE_API_URL=https://your-backend-url.com/api
```

### 2. Database Setup
```sql
-- Production database
CREATE DATABASE db_perpustakaan_prod;
USE db_perpustakaan_prod;

-- Run setup-database.sql
-- Or use: npm run setup-db
```

### 3. Build Frontend
```bash
cd frontend
npm run build
# Output: dist/ folder
```

### 4. Serve Static Files
Update `backend/server.js`:
```javascript
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}
```

---

## 🌐 HEROKU DEPLOYMENT

### 1. Prepare for Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create perpustakaan-app
```

### 2. Add Database
```bash
# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Get database URL
heroku config:get JAWSDB_URL
```

### 3. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
```

### 4. Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 5. Setup Database
```bash
heroku run npm run setup-db
```

---

## ⚡ VERCEL DEPLOYMENT (Frontend Only)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy Frontend
```bash
cd frontend
vercel --prod
```

### 3. Environment Variables
Add in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🐳 DOCKER DEPLOYMENT

### 1. Create Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .

EXPOSE 5000

CMD ["npm", "start"]
```

### 2. Create Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: 
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=db_perpustakaan
    depends_on:
      - mysql

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=db_perpustakaan
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

### 4. Run with Docker
```bash
docker-compose up -d
```

---

## 🔒 SECURITY CHECKLIST

### ✅ Production Security:
- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Set secure database passwords
- [ ] Enable CORS for specific domains
- [ ] Add rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable database SSL
- [ ] Add request logging
- [ ] Set up monitoring
- [ ] Regular security updates

### 🛡️ Additional Security:
```javascript
// Add to backend/server.js
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

---

## 📊 MONITORING & LOGGING

### 1. Add Logging
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 2. Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### 3. Database Health Check
```javascript
app.get('/health/db', async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'Disconnected' });
  }
});
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### 1. Frontend Optimization
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

### 2. Backend Optimization
```javascript
// Add compression
const compression = require('compression');
app.use(compression());

// Add caching headers
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

### 3. Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_buku_judul ON buku(judul);
CREATE INDEX idx_peminjaman_user ON peminjaman(user_id);
CREATE INDEX idx_peminjaman_status ON peminjaman(status);
```

---

## 📈 SCALING CONSIDERATIONS

### Horizontal Scaling:
- Load balancer (Nginx)
- Multiple backend instances
- Database clustering
- CDN for static assets

### Vertical Scaling:
- Increase server resources
- Database optimization
- Connection pooling
- Caching layer (Redis)

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-deployment:
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database migrations ready
- [ ] SSL certificates configured
- [ ] Domain name configured
- [ ] Monitoring setup
- [ ] Backup strategy in place

### Post-deployment:
- [ ] Health checks passing
- [ ] Database connected
- [ ] Authentication working
- [ ] All features functional
- [ ] Performance acceptable
- [ ] Logs being generated
- [ ] Monitoring active

---

## 🎉 DEPLOYMENT COMPLETE!

Your library management system is now live and ready for users!

**Production URLs:**
- Frontend: https://your-domain.com
- Backend API: https://api.your-domain.com
- Admin Panel: https://your-domain.com/admin

**Happy Deploying! 🚀**