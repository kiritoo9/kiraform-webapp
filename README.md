# KiraForm

**KiraForm** adalah platform manajemen formulir modern yang memungkinkan pengguna untuk membuat, mengelola, dan menganalisis formulir dengan mudah. Dibangun menggunakan Vue.js 3 dengan TypeScript dan Vite untuk performa optimal.

## 🚀 Fitur Utama

- **Workspace Management**: Organisasi formulir dalam workspace yang terstruktur
- **Form Builder**: Interface drag-and-drop untuk membuat formulir (coming soon)
- **Real-time Analytics**: Dashboard analitik untuk tracking submission
- **Responsive Design**: Antarmuka yang optimal di semua perangkat
- **Dark/Light Mode**: Tema yang dapat disesuaikan dengan preferensi pengguna
- **Modern Architecture**: Menggunakan Vue 3 Composition API dengan TypeScript

## 📋 Persyaratan Sistem

- **Node.js**: v16.0.0 atau lebih tinggi
- **npm**: v7.0.0 atau lebih tinggi
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

## 🛠 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/kiritoo9/kiraform-webapp
cd kiraform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Buat file `.env.local` di root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=KiraForm
VITE_APP_VERSION=1.0.0
```

### 4. Development Server

```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173`

## 🏗 Build & Deploy

### Development Build

```bash
npm run build:dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Production

#### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify Deployment

```bash
# Build terlebih dahulu
npm run build

# Upload folder dist ke Netlify
# atau gunakan Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build Docker image
docker build -t kiraform:latest .

# Run container
docker run -p 80:80 kiraform:latest
```

## 🧪 Testing

### Unit Tests

```bash
npm run test:unit
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Coverage Report

```bash
npm run test:coverage
```

## 🔧 Scripts Tersedia

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Menjalankan development server dengan hot-reload |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview build production secara lokal |
| `npm run test:unit` | Menjalankan unit tests dengan Vitest |
| `npm run lint` | Linting kode dengan ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run type-check` | Type checking dengan vue-tsc |

## 📁 Struktur Project

```
kiraform/
├── src/
│   ├── components/          # Komponen Vue yang dapat digunakan ulang
│   ├── views/              # Halaman-halaman aplikasi
│   ├── composables/        # Vue composables untuk logic bisnis
│   │   ├── auth/           # Authentication logic
│   │   ├── common/         # Utilities umum
│   │   └── masters/        # Master data management
│   ├── stores/             # Pinia stores untuk state management
│   ├── router/             # Vue Router configuration
│   ├── assets/             # Static assets (CSS, JS, images)
│   └── main.ts             # Entry point aplikasi
├── public/                 # Public static files
├── tests/                  # Test files
└── docs/                   # Dokumentasi tambahan
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

### Development Guidelines

- Gunakan TypeScript untuk type safety
- Ikuti Vue 3 Composition API patterns
- Tulis unit tests untuk fitur baru
- Ikuti ESLint configuration
- Gunakan conventional commits

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.