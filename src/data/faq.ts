export interface FAQItem {
  id: string
  question: string
  answer: string
}

export const faqData: FAQItem[] = [
  {
    id: 'tiempo',
    question: '¿Cuánto tiempo lleva desarrollar una web?',
    answer:
      'Depende de la complejidad del proyecto. Una landing page puede estar lista en 1-2 semanas. Un sitio web completo con múltiples secciones, 3-4 semanas. Sistemas más complejos, 2-3 meses. En la primera reunión definimos un cronograma realista.',
  },
  {
    id: 'costo',
    question: '¿Cuánto cuesta un proyecto web?',
    answer:
      'Cada proyecto es único y el presupuesto se adapta a tus necesidades específicas. Trabajamos con un modelo transparente: definimos el alcance juntos y te damos un presupuesto cerrado antes de arrancar. Sin sorpresas.',
  },
  {
    id: 'proceso',
    question: '¿Cómo es el proceso de trabajo?',
    answer:
      'Arrancamos con una reunión de descubrimiento para entender tu proyecto. Después viene el diseño (te mostramos mockups), desarrollo, revisiones con feedback, y finalmente el deploy. Siempre estás al tanto del avance.',
  },
  {
    id: 'tecnologias',
    question: '¿Qué tecnologías usan?',
    answer:
      'Elegimos las herramientas que mejor se adapten a cada proyecto. Para webs: React, Next.js, Vite. Para sistemas: Django, PostgreSQL. Siempre priorizamos performance, seguridad y mantenibilidad a largo plazo.',
  },
  {
    id: 'mantenimiento',
    question: '¿Ofrecen mantenimiento después del desarrollo?',
    answer:
      'Sí. Ofrecemos planes de mantenimiento que incluyen actualizaciones de seguridad, backups, corrección de bugs, y pequeños ajustes. También podés consultarnos solo cuando lo necesites.',
  },
  {
    id: 'hosting',
    question: '¿Se encargan del hosting y dominio?',
    answer:
      'Podemos gestionar todo o solo el desarrollo, como prefieras. Generalmente recomendamos que el dominio y hosting queden a tu nombre (te guiamos en el proceso). También podemos administrarlo por vos.',
  },
  {
    id: 'diseno',
    question: '¿Trabajan solo con diseños propios o puedo traer el mío?',
    answer:
      'Ambas opciones. Si ya tenés un diseño de Figma o similar, lo implementamos fielmente. Si no, creamos el diseño desde cero basándonos en tus objetivos y referencias que te gusten.',
  },
  {
    id: 'argentina',
    question: '¿Trabajan solo en Argentina?',
    answer:
      'No, trabajamos con clientes de cualquier parte. Nos manejamos muy bien de forma remota con herramientas como Meet, Slack, o lo que te resulte más cómodo. Los pagos se adaptan a tu ubicación.',
  },
]
