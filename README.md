# KiraForm

**KiraForm** is a modern form management platform that allows users to create, manage, and analyze forms with ease. Built using Vue.js 3 with TypeScript and Vite for optimal performance.

## 🚀 Key Features

- **Workspace Management**: Organize forms in structured workspaces
- **Form Builder**: Drag-and-drop interface for creating forms (coming soon)
- **Real-time Analytics**: Analytics dashboard for tracking submissions
- **Responsive Design**: Optimal interface across all devices
- **Dark/Light Mode**: Customizable themes based on user preferences
- **Modern Architecture**: Uses Vue 3 Composition API with TypeScript

## 📋 System Requirements

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

## 🛠 Installation

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

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=KiraForm
VITE_APP_VERSION=1.0.0
```

### 4. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

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
# Build first
npm run build

# Upload dist folder to Netlify
# or use Netlify CLI
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

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run development server with hot-reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run lint` | Lint code with ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run type-check` | Type checking with vue-tsc |

## 📁 Project Structure

```
kiraform/
├── src/
│   ├── components/          # Reusable Vue components
│   ├── views/              # Application pages
│   ├── composables/        # Vue composables for business logic
│   │   ├── auth/           # Authentication logic
│   │   ├── common/         # Common utilities
│   │   └── masters/        # Master data management
│   ├── stores/             # Pinia stores for state management
│   ├── router/             # Vue Router configuration
│   ├── assets/             # Static assets (CSS, JS, images)
│   └── main.ts             # Application entry point
├── public/                 # Public static files
├── tests/                  # Test files
└── docs/                   # Additional documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### Development Guidelines

- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Write unit tests for new features
- Follow ESLint configuration
- Use conventional commits

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.