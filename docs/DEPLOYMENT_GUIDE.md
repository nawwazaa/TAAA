# FlixMarket Deployment Guide

## Prerequisites

### Development Environment
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For version control
- **Modern Browser**: Chrome, Safari, Firefox, or Edge

### Production Requirements
- **HTTPS**: Required for camera and location access
- **SSL Certificate**: Valid SSL for secure connections
- **Domain**: Custom domain recommended
- **CDN**: For static asset delivery

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/flixmarket.git
cd flixmarket
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env.local` file:
```env
# Development settings
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000

# Payment gateways (use test keys)
VITE_PAYPAL_CLIENT_ID=your_test_paypal_client_id
VITE_TAP_API_KEY=your_test_tap_api_key
VITE_STRIPE_PUBLIC_KEY=your_test_stripe_public_key

# External services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Feature flags
VITE_ENABLE_VOICE_ASSISTANT=true
VITE_ENABLE_PAYMENT_GATEWAY=true
VITE_ENABLE_LOCATION_VERIFICATION=true
```

### 4. Start Development Server
```bash
npm run dev
```

Application will be available at `http://localhost:5173`

---

## Production Deployment

### 1. Build Optimization

#### Build for Production
```bash
npm run build
```

#### Build Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          qr: ['html5-qrcode', 'qrcode'],
          ui: ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});
```

### 2. Environment Variables (Production)

#### Production Environment File
```env
# Production settings
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.flixmarket.com

# Payment gateways (use live keys)
VITE_PAYPAL_CLIENT_ID=your_live_paypal_client_id
VITE_TAP_API_KEY=your_live_tap_api_key
VITE_STRIPE_PUBLIC_KEY=your_live_stripe_public_key

# External services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Security
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your_sentry_dsn

# Feature flags
VITE_ENABLE_VOICE_ASSISTANT=true
VITE_ENABLE_PAYMENT_GATEWAY=true
VITE_ENABLE_LOCATION_VERIFICATION=true
```

### 3. Deployment Platforms

#### Netlify Deployment
```bash
# Build and deploy
npm run build
netlify deploy --prod --dir=dist

# Or use Netlify CLI
netlify init
netlify deploy --prod
```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### AWS S3 + CloudFront
```bash
# Build application
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

---

## Backend Integration

### 1. API Endpoints Structure

#### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/profile
PUT  /api/auth/profile
```

#### QR Code Endpoints
```
POST /api/qr/generate
POST /api/qr/scan
GET  /api/qr/history
POST /api/qr/verify
```

#### Wallet Endpoints
```
GET  /api/wallet/balance
GET  /api/wallet/transactions
POST /api/wallet/transfer
POST /api/wallet/exchange
```

#### Admin Endpoints
```
GET  /api/admin/users
PUT  /api/admin/users/:id
GET  /api/admin/transactions
POST /api/admin/notifications
```

### 2. Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  user_type ENUM('user', 'seller', 'influencer'),
  location JSONB,
  interests TEXT[],
  qr_code TEXT,
  flixbits INTEGER DEFAULT 100,
  referral_code VARCHAR(50),
  referred_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### QR Codes Table
```sql
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  data TEXT NOT NULL,
  type VARCHAR(50),
  expires_at TIMESTAMP,
  scan_limit INTEGER DEFAULT 1,
  scans_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Security Configuration

### 1. HTTPS Setup

#### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --webroot -w /var/www/flixmarket -d flixmarket.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name flixmarket.com;
    
    ssl_certificate /etc/letsencrypt/live/flixmarket.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/flixmarket.com/privkey.pem;
    
    location / {
        root /var/www/flixmarket/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
}
```

### 2. Content Security Policy

#### CSP Headers
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.paypal.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.paypal.com https://maps.googleapis.com;
  media-src 'self';
  frame-src https://www.paypal.com;
">
```

---

## Performance Optimization

### 1. Bundle Optimization

#### Code Splitting
```typescript
// Lazy load feature modules
const VoiceAssistant = lazy(() => import('./features/VoiceAssistant'));
const WalletManagement = lazy(() => import('./features/WalletManagement'));
const DrawWinners = lazy(() => import('./features/DrawWinners'));
```

#### Tree Shaking
```typescript
// Import only needed functions
import { Camera, QrCode, Wallet } from 'lucide-react';
// Instead of: import * as Icons from 'lucide-react';
```

### 2. Image Optimization

#### Image Compression
```bash
# Install image optimization tools
npm install --save-dev imagemin imagemin-webp imagemin-mozjpeg
```

#### Responsive Images
```typescript
// Use appropriate image sizes
const getImageUrl = (size: 'small' | 'medium' | 'large') => {
  return `https://images.pexels.com/photos/image.jpeg?auto=compress&cs=tinysrgb&w=${
    size === 'small' ? 400 : size === 'medium' ? 800 : 1200
  }`;
};
```

### 3. Caching Strategy

#### Service Worker (Optional)
```javascript
// Cache static assets
const CACHE_NAME = 'flixmarket-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

---

## Monitoring & Analytics

### 1. Error Tracking

#### Sentry Integration
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_APP_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. Performance Monitoring

#### Web Vitals
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 3. User Analytics

#### Google Analytics 4
```typescript
// Track user interactions
const trackEvent = (eventName: string, parameters: object) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }
};

// Usage
trackEvent('qr_scan', {
  scan_mode: 'follow',
  user_type: 'user',
  location: 'Dubai'
});
```

---

## Maintenance & Updates

### 1. Dependency Management

#### Regular Updates
```bash
# Check outdated packages
npm outdated

# Update dependencies
npm update

# Security audit
npm audit
npm audit fix
```

#### Version Pinning
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "html5-qrcode": "~2.3.8",
    "lucide-react": "^0.344.0"
  }
}
```

### 2. Feature Flag Management

#### Feature Toggle System
```typescript
const FEATURES = {
  VOICE_ASSISTANT: process.env.VITE_ENABLE_VOICE_ASSISTANT === 'true',
  PAYMENT_GATEWAY: process.env.VITE_ENABLE_PAYMENT_GATEWAY === 'true',
  LOCATION_VERIFICATION: process.env.VITE_ENABLE_LOCATION_VERIFICATION === 'true',
  BETA_FEATURES: process.env.VITE_ENABLE_BETA === 'true'
};

// Usage in components
{FEATURES.VOICE_ASSISTANT && <VoiceAssistant />}
```

### 3. Database Migrations

#### Migration Scripts
```sql
-- Add new column
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;

-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Update existing data
UPDATE users SET last_login = NOW() WHERE last_login IS NULL;
```

---

## Scaling Considerations

### 1. Horizontal Scaling

#### Load Balancing
- Use multiple server instances
- Implement session stickiness
- Database connection pooling
- CDN for static assets

#### Microservices Architecture
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Auth      │  │   Wallet    │  │   QR Code   │
│  Service    │  │  Service    │  │  Service    │
└─────────────┘  └─────────────┘  └─────────────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
              ┌─────────────┐
              │   API       │
              │  Gateway    │
              └─────────────┘
```

### 2. Database Optimization

#### Indexing Strategy
```sql
-- User search optimization
CREATE INDEX idx_users_search ON users USING gin(to_tsvector('english', name || ' ' || email));

-- Transaction queries
CREATE INDEX idx_transactions_user_date ON transactions(user_id, created_at DESC);

-- QR code lookups
CREATE INDEX idx_qr_codes_active ON qr_codes(is_active, expires_at) WHERE is_active = true;
```

#### Caching Layer
```typescript
// Redis caching for frequently accessed data
const cacheUser = async (userId: string, userData: User) => {
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(userData));
};

const getCachedUser = async (userId: string): Promise<User | null> => {
  const cached = await redis.get(`user:${userId}`);
  return cached ? JSON.parse(cached) : null;
};
```

---

## Security Hardening

### 1. API Security

#### Rate Limiting
```typescript
// Express rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

#### Input Validation
```typescript
// Joi validation schemas
const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+[1-9]\d{1,14}$/).required(),
  userType: Joi.string().valid('user', 'seller', 'influencer').required()
});
```

### 2. Data Protection

#### Encryption
```typescript
// Encrypt sensitive data
import crypto from 'crypto';

const encrypt = (text: string, key: string): string => {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};
```

#### Data Sanitization
```typescript
// Sanitize user inputs
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};
```

---

## Backup & Recovery

### 1. Database Backup

#### Automated Backups
```bash
#!/bin/bash
# Daily database backup script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/flixmarket"
DB_NAME="flixmarket"

# Create backup
pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

#### Backup Verification
```bash
# Test backup integrity
gunzip -t backup_20240127_120000.sql.gz

# Test restore process (on test database)
createdb flixmarket_test
gunzip -c backup_20240127_120000.sql.gz | psql flixmarket_test
```

### 2. Application Backup

#### Code Repository
- Use Git with multiple remotes
- Tag releases for easy rollback
- Maintain staging and production branches
- Document deployment procedures

#### Configuration Backup
```bash
# Backup environment variables
cp .env.production .env.backup.$(date +%Y%m%d)

# Backup nginx configuration
cp /etc/nginx/sites-available/flixmarket /etc/nginx/backup/
```

---

## Monitoring Setup

### 1. Application Monitoring

#### Health Check Endpoint
```typescript
// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime()
  });
});
```

#### Performance Monitoring
```typescript
// Monitor key metrics
const trackPerformance = () => {
  // QR scan success rate
  const qrScanSuccess = localStorage.getItem('qr_scan_success') || 0;
  const qrScanTotal = localStorage.getItem('qr_scan_total') || 0;
  
  // Voice command accuracy
  const voiceCommandSuccess = localStorage.getItem('voice_success') || 0;
  const voiceCommandTotal = localStorage.getItem('voice_total') || 0;
  
  return {
    qrScanSuccessRate: qrScanSuccess / qrScanTotal,
    voiceCommandAccuracy: voiceCommandSuccess / voiceCommandTotal
  };
};
```

### 2. Error Monitoring

#### Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Application error:', error, errorInfo);
    
    // Send to error tracking service
    if (process.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error);
    }
  }
}
```

---

## Testing Strategy

### 1. Unit Testing

#### Test Setup
```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

#### Example Tests
```typescript
// QR code generation test
describe('QR Code Utils', () => {
  test('generates valid QR code', async () => {
    const data = 'test data';
    const qrCode = await generateQRCode(data);
    expect(qrCode).toMatch(/^data:image\/png;base64,/);
  });
});

// Permission manager test
describe('PermissionsManager', () => {
  test('checks camera permission', async () => {
    const status = await permissionsManager.checkCameraPermission();
    expect(['granted', 'denied', 'prompt']).toContain(status);
  });
});
```

### 2. Integration Testing

#### E2E Testing with Playwright
```typescript
import { test, expect } from '@playwright/test';

test('QR scanner workflow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="qr-scanner"]');
  await page.click('[data-testid="use-camera"]');
  
  // Mock camera permission
  await page.context().grantPermissions(['camera']);
  
  // Verify scanner interface
  await expect(page.locator('[data-testid="camera-view"]')).toBeVisible();
});
```

---

## Troubleshooting

### 1. Common Issues

#### Camera Not Working
```typescript
// Debug camera issues
const debugCamera = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    console.log('Available cameras:', cameras);
    
    if (cameras.length === 0) {
      throw new Error('No cameras found');
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: cameras[0].deviceId }
    });
    console.log('Camera stream:', stream);
  } catch (error) {
    console.error('Camera debug error:', error);
  }
};
```

#### Permission Issues
```typescript
// Check permission status
const checkAllPermissions = async () => {
  const permissions = ['camera', 'geolocation'];
  const results = {};
  
  for (const permission of permissions) {
    try {
      const result = await navigator.permissions.query({ name: permission });
      results[permission] = result.state;
    } catch (error) {
      results[permission] = 'unknown';
    }
  }
  
  return results;
};
```

### 2. Performance Issues

#### Memory Leaks
```typescript
// Proper cleanup in useEffect
useEffect(() => {
  const cleanup = () => {
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Stop QR scanner
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop();
    }
  };
  
  return cleanup;
}, []);
```

#### Bundle Size Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Run all tests
- [ ] Update version number
- [ ] Check environment variables
- [ ] Verify SSL certificates
- [ ] Test payment gateways
- [ ] Validate QR code functionality
- [ ] Test voice assistant features
- [ ] Check mobile responsiveness

### Post-Deployment
- [ ] Verify application loads correctly
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Validate payment processing
- [ ] Test QR scanning on mobile devices
- [ ] Verify voice commands work
- [ ] Monitor server resources

### Rollback Plan
- [ ] Keep previous version tagged
- [ ] Document rollback procedure
- [ ] Test rollback process
- [ ] Monitor after rollback
- [ ] Communicate with users if needed

---

This deployment guide provides comprehensive instructions for setting up, deploying, and maintaining the FlixMarket application in production environments.