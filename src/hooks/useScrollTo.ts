import { useCallback } from 'react'

export function useScrollTo() {
  const scrollTo = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  return scrollTo
}
