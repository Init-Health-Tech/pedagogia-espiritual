import { motion } from 'framer-motion'
import { pageTransition } from '../../animations/variants'

export default function AnimatedPage({ children, className }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={className}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}
