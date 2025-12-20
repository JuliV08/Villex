export interface Project {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  category: 'web' | 'sistema' | 'ecommerce' | 'app'
  technologies: string[]
  thumbnail: string
  images: string[]
  liveUrl?: string
  featured: boolean
  order: number
}

// Array vacío preparado para agregar proyectos reales
export const projects: Project[] = []

// Helper para obtener proyectos destacados
export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured).sort((a, b) => a.order - b.order)
}

// Helper para obtener proyecto por slug
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

// Helper para verificar si hay proyectos
export function hasProjects(): boolean {
  return projects.length > 0
}
