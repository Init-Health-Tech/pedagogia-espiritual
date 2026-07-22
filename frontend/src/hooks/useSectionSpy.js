import { useCallback, useEffect, useRef, useState } from 'react'
import { HEADER_HEIGHT } from '../utils/marketingNav'

/** Línea de referencia en viewport: la etapa activa es la última cuyo inicio la ha cruzado. */
function getReadingLineY(ratio = 0.3) {
  return HEADER_HEIGHT + window.innerHeight * ratio
}

function resolveActiveSection(sectionIds, lineRatio) {
  if (!sectionIds.length) return ''

  const line = getReadingLineY(lineRatio)
  let active = sectionIds[0]

  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= line) {
      active = id
    }
  }

  const lastId = sectionIds[sectionIds.length - 1]
  const lastEl = document.getElementById(lastId)
  if (lastEl) {
    const { bottom } = lastEl.getBoundingClientRect()
    if (bottom <= window.innerHeight * 0.92) {
      active = lastId
    }
  }

  return active
}

/**
 * Resalta la sección activa según una línea de lectura fija en pantalla.
 * Usa requestAnimationFrame en scroll para buen rendimiento.
 */
export default function useSectionSpy(sectionIds, { lineRatio = 0.3 } = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
  const isScrollingRef = useRef(false)
  const scrollTimerRef = useRef(null)
  const lineRatioRef = useRef(lineRatio)

  lineRatioRef.current = lineRatio

  useEffect(() => {
    if (!sectionIds.length) return undefined

    let rafId = 0

    const syncActive = () => {
      if (isScrollingRef.current) return
      const next = resolveActiveSection(sectionIds, lineRatioRef.current)
      setActiveId((prev) => (prev === next ? prev : next))
    }

    const scheduleSync = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(syncActive)
    }

    scheduleSync()
    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
    }
  }, [sectionIds])

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return

    isScrollingRef.current = true
    setActiveId(id)

    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current)

    const line = getReadingLineY(lineRatioRef.current)
    const top = el.getBoundingClientRect().top + window.scrollY - line
    window.scrollTo({ top, behavior: 'smooth' })

    scrollTimerRef.current = window.setTimeout(() => {
      isScrollingRef.current = false
      setActiveId(resolveActiveSection(sectionIds, lineRatioRef.current))
    }, 900)
  }, [sectionIds])

  useEffect(
    () => () => {
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current)
    },
    [],
  )

  return { activeId, scrollToSection }
}

export function itinerarioSectionId(index) {
  return `itinerario-eje-${index + 1}`
}

export function sesionSectionId(index) {
  return `sesion-momento-${index + 1}`
}
