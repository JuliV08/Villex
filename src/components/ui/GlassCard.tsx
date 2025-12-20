import { forwardRef, ReactNode } from 'react'
import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
  variant?: 'default' | 'strong' | 'subtle'
  glow?: boolean
  glowColor?: 'cyan' | 'magenta' | 'violet'
  hover?: boolean
  children?: ReactNode
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = 'default',
      glow = false,
      glowColor = 'cyan',
      hover = true,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-white/5 backdrop-blur-glass border border-white/10',
      strong: 'bg-white/10 backdrop-blur-glass border border-white/20',
      subtle: 'bg-white/[0.02] backdrop-blur-sm border border-white/5',
    }

    const glowColors = {
      cyan: 'hover:shadow-glow-sm hover:border-primary-400/30',
      magenta: 'hover:shadow-glow-magenta hover:border-accent-magenta/30',
      violet: 'hover:shadow-glow-violet hover:border-accent-violet/30',
    }

    const cardVariants: Variants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      hover: hover ? { y: -5, transition: { duration: 0.3 } } : {},
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl p-6 transition-all duration-300',
          variants[variant],
          glow && glowColors[glowColor],
          hover && 'cursor-pointer',
          className
        )}
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        whileHover="hover"
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export { GlassCard }
export type { GlassCardProps }
