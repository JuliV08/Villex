import { forwardRef, ReactNode } from 'react'
import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionProps extends Omit<HTMLMotionProps<'section'>, 'ref' | 'children'> {
  id?: string
  container?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  background?: 'default' | 'gradient' | 'glow'
  children?: ReactNode
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      id,
      container = true,
      padding = 'lg',
      background = 'default',
      children,
      ...props
    },
    ref
  ) => {
    const paddings = {
      none: '',
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-24',
      lg: 'py-20 md:py-28 lg:py-32',
    }

    const backgrounds = {
      default: '',
      gradient: 'bg-hero-gradient',
      glow: 'relative overflow-hidden',
    }

    const sectionVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    }

    return (
      <motion.section
        ref={ref}
        id={id}
        className={cn(
          'relative',
          paddings[padding],
          backgrounds[background],
          className
        )}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        {...props}
      >
        {background === 'glow' && (
          <>
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-glow-cyan opacity-30 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-glow-violet opacity-20 blur-3xl pointer-events-none" />
          </>
        )}
        {container ? (
          <div className="container-custom relative z-10">{children}</div>
        ) : (
          <div className="relative z-10">{children}</div>
        )}
      </motion.section>
    )
  }
)

Section.displayName = 'Section'

export { Section }
export type { SectionProps }
