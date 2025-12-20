export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  icon: 'web' | 'system'
}

export const services: Service[] = [
  {
    id: 'webs-custom',
    title: 'Webs Custom',
    description:
      'Sitios web 100% a medida que reflejan la identidad de tu marca y convierten visitantes en clientes.',
    features: [
      'Diseño único y personalizado',
      'Performance optimizada (Core Web Vitals)',
      'SEO técnico desde el día uno',
    ],
    icon: 'web',
  },
  {
    id: 'sistemas',
    title: 'Sistemas / Backoffice',
    description:
      'Aplicaciones web a medida para gestionar tu negocio: CRMs, paneles de administración, automatizaciones.',
    features: [
      'Flujos de trabajo automatizados',
      'Dashboards con métricas en tiempo real',
      'Integraciones con servicios externos',
    ],
    icon: 'system',
  },
]

export interface ProcessStep {
  id: string
  number: string
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  {
    id: 'descubrimiento',
    number: '01',
    title: 'Descubrimiento',
    description:
      'Entendemos tu negocio, objetivos y público. Definimos alcance y requisitos juntos.',
  },
  {
    id: 'diseno',
    number: '02',
    title: 'Diseño',
    description:
      'Creamos wireframes y mockups. Iteramos hasta que el diseño te convenza al 100%.',
  },
  {
    id: 'desarrollo',
    number: '03',
    title: 'Desarrollo',
    description:
      'Código limpio, moderno y escalable. Te mostramos avances durante todo el proceso.',
  },
  {
    id: 'deploy',
    number: '04',
    title: 'Deploy',
    description:
      'Configuramos hosting, dominio, SSL y todo lo necesario. Tu proyecto sale a producción.',
  },
  {
    id: 'soporte',
    number: '05',
    title: 'Soporte',
    description:
      'No te dejamos solo. Mantenimiento, actualizaciones y soporte cuando lo necesites.',
  },
]

export interface TechCategory {
  name: string
  techs: string[]
}

export const techStack: TechCategory[] = [
  {
    name: 'Frontend',
    techs: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'Backend',
    techs: ['Django', 'Python', 'PostgreSQL', 'REST APIs'],
  },
  {
    name: 'Infraestructura',
    techs: ['Vercel', 'AWS', 'Docker', 'CI/CD'],
  },
]

export interface Guarantee {
  id: string
  title: string
  description: string
}

export const guarantees: Guarantee[] = [
  {
    id: 'performance',
    title: 'Performance',
    description: 'Sitios rápidos que pasan Core Web Vitals',
  },
  {
    id: 'seo',
    title: 'SEO Ready',
    description: 'Optimizado para buscadores desde el código',
  },
  {
    id: 'responsive',
    title: 'Responsive',
    description: 'Perfecto en cualquier dispositivo',
  },
  {
    id: 'accesibilidad',
    title: 'Accesibilidad',
    description: 'Usable por todos, sin excepción',
  },
]
