# VILLEX Portfolio

Portfolio web premium para VILLEX con estética futurista y 3D protagonista.

![VILLEX](https://img.shields.io/badge/VILLEX-Portfolio-00e5ff?style=for-the-badge)

## 🚀 Stack

- **React 18** + **TypeScript**
- **Vite** (build tool ultra-rápido)
- **TailwindCSS** (design system custom)
- **Framer Motion** (animaciones)
- **@react-three/fiber** + **@react-three/drei** (escena 3D)
- **Three.js** (WebGL)

## 📦 Instalación

```bash
# Clonar el repo
cd villex

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
```

## 🛠️ Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 🏗️ Build para producción

```bash
npm run build
```

Los archivos se generan en `dist/`.

## 📁 Estructura de carpetas

```
src/
├── components/
│   ├── layout/        # Navbar, Footer
│   ├── sections/      # Hero, Services, Process, Stack, FAQ, Contact
│   ├── three/         # HeroScene, ChromeTorus, FloatingSphere
│   └── ui/            # Button, GlassCard, Section, Badge
├── data/              # projects.ts, faq.ts, services.ts
├── hooks/             # useReducedMotion, useScrollTo
├── lib/               # utils.ts, submitAdapter.ts
├── styles/            # index.css (Tailwind + custom)
└── App.tsx            # Componente principal
```

## ⚙️ Configuración

### Variables de entorno

| Variable               | Descripción                                                          | Requerida |
| ---------------------- | -------------------------------------------------------------------- | --------- |
| `VITE_API_URL`         | URL del backend Django (ej: `https://api.villex.dev`)                | No        |
| `VITE_FORMSPREE_URL`   | Fallback para formulario, crear en [Formspree](https://formspree.io) | No        |
| `VITE_WHATSAPP_NUMBER` | Número de WhatsApp sin + ni espacios (ej: `5491123456789`)           | Sí        |

### Editar contenido

- **FAQ**: `src/data/faq.ts`
- **Servicios**: `src/data/services.ts`
- **Proyectos**: `src/data/projects.ts` (agregar cuando haya proyectos reales)
- **Copy del Hero**: `src/components/sections/Hero.tsx`

### Agregar proyectos

En `src/data/projects.ts`, agregar objetos al array `projects`:

```typescript
export const projects: Project[] = [
  {
    id: "mi-proyecto",
    title: "Nombre del Proyecto",
    slug: "mi-proyecto",
    description: "Descripción completa...",
    shortDescription: "Descripción corta...",
    category: "web", // 'web' | 'sistema' | 'ecommerce' | 'app'
    technologies: ["React", "Django"],
    thumbnail: "/projects/mi-proyecto/thumb.jpg",
    images: ["/projects/mi-proyecto/1.jpg"],
    liveUrl: "https://ejemplo.com",
    featured: true,
    order: 1,
  },
];
```

## 🎨 Design Tokens

El theme está definido en `tailwind.config.ts`:

- **Colores primarios**: cyan (`#00e5ff`), violet (`#8b5cf6`), magenta (`#ff00ff`)
- **Fondo**: `dark-800` a `dark-950`
- **Efectos**: glassmorphism, glow shadows, noise texture

## ♿ Accesibilidad

- ✅ Focus visible en todos los elementos interactivos
- ✅ Navegación completa por teclado
- ✅ aria-labels en botones e iconos
- ✅ Headings semánticos (h1 > h2 > h3)
- ✅ Respeto a `prefers-reduced-motion`

## 🔮 Roadmap

- [ ] Integrar backend Django para leads
- [ ] Agregar proyectos reales
- [ ] Analytics (Plausible o similar)
- [ ] Blog/Novedades (opcional)

---

Desarrollado con 💙 por **VILLEX**
