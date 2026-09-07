import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { createPopper } from '@popperjs/core'
import { GripHorizontal } from 'lucide-react'
import { NAV_TOUR_STEPS } from './tourSteps'
import { colors } from '../../theme/muiTheme'

const VIEWPORT_PAD = 16
const TOOLTIP_GAP = 16
const TOOLTIP_MAX_W = 360
const CONNECTOR_MIN_DIST = 80

function measureTarget(tourId) {
  const el = document.querySelector(`[data-tour-id="${tourId}"]`)
  if (!el) return null
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  const rect = el.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const top = Math.min(Math.max(rect.top, 0), vh - 44)
  const left = Math.min(Math.max(rect.left, 0), vw - 44)
  const right = Math.min(Math.max(rect.right, left + 44), vw)
  const bottom = Math.min(Math.max(rect.bottom, top + 44), vh)
  return {
    top,
    left,
    width: Math.max(right - left, 44),
    height: Math.max(bottom - top, 44),
    el,
  }
}

function virtualReferenceFromRect(rect) {
  return {
    getBoundingClientRect: () => ({
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      bottom: rect.top + rect.height,
      right: rect.left + rect.width,
      x: rect.left,
      y: rect.top,
      toJSON: () => {},
    }),
    contextElement: rect.el || document.body,
  }
}

function clampPosition(left, top, width, height) {
  const maxL = window.innerWidth - width - VIEWPORT_PAD
  const maxT = window.innerHeight - height - VIEWPORT_PAD
  return {
    left: Math.min(Math.max(VIEWPORT_PAD, left), Math.max(VIEWPORT_PAD, maxL)),
    top: Math.min(Math.max(VIEWPORT_PAD, top), Math.max(VIEWPORT_PAD, maxT)),
  }
}

function clampPointToRect(p, r) {
  return {
    x: Math.min(Math.max(p.x, r.left), r.left + r.width),
    y: Math.min(Math.max(p.y, r.top), r.top + r.height),
  }
}

function connectorPoints(tooltipRect, highlight) {
  const tc = {
    x: tooltipRect.left + tooltipRect.width / 2,
    y: tooltipRect.top + tooltipRect.height / 2,
  }
  const hc = {
    x: highlight.left + highlight.width / 2,
    y: highlight.top + highlight.height / 2,
  }
  const p1 = clampPointToRect(hc, tooltipRect)
  const p2 = clampPointToRect(tc, highlight)
  const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y)
  return { p1, p2, dist }
}

/**
 * Tour reutilizable. Pasa `steps` con { id, titulo, descripcion, radius? }.
 * `onStepChange(step, index)` permite preparar la UI (cambiar pestaña, abrir modal…).
 */
export default function MemberGuidedTour({
  open,
  onClose,
  steps = NAV_TOUR_STEPS,
  onStepChange,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [stepIndex, setStepIndex] = useState(0)
  const [target, setTarget] = useState(null)
  /** @type {[{ left: number, top: number } | null, Function]} */
  const [manualPosition, setManualPosition] = useState(null)
  const [tooltipRect, setTooltipRect] = useState(null)
  const [dragging, setDragging] = useState(false)

  const tooltipRef = useRef(null)
  const popperRef = useRef(null)
  const dragRef = useRef(null)
  const manualPositionRef = useRef(null)

  const step = steps[stepIndex]
  const total = steps.length

  useEffect(() => {
    manualPositionRef.current = manualPosition
  }, [manualPosition])

  const refreshTarget = useCallback(() => {
    if (!open || !step) return
    requestAnimationFrame(() => {
      setTarget(measureTarget(step.id))
    })
  }, [open, step])

  useEffect(() => {
    if (!open) {
      setStepIndex(0)
      setTarget(null)
      setManualPosition(null)
      return undefined
    }
    onStepChange?.(steps[stepIndex], stepIndex)
    setManualPosition(null)
    const t = window.setTimeout(refreshTarget, 100)
    const onResize = () => {
      refreshTarget()
      if (manualPositionRef.current && tooltipRef.current) {
        const r = tooltipRef.current.getBoundingClientRect()
        setManualPosition(clampPosition(r.left, r.top, r.width, r.height))
      }
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [open, stepIndex, refreshTarget, onStepChange, steps])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Popper solo cuando no hay posición manual
  useLayoutEffect(() => {
    if (!open || !target || !tooltipRef.current || manualPosition) {
      popperRef.current?.destroy()
      popperRef.current = null
      return undefined
    }

    const preferred = isMobile ? 'top' : 'bottom'
    const reference = virtualReferenceFromRect(target)

    popperRef.current?.destroy()
    popperRef.current = createPopper(reference, tooltipRef.current, {
      placement: preferred,
      strategy: 'fixed',
      modifiers: [
        { name: 'offset', options: { offset: [0, TOOLTIP_GAP] } },
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top', 'bottom', 'right', 'left', 'top-start', 'bottom-start'],
            padding: VIEWPORT_PAD,
            rootBoundary: 'viewport',
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: VIEWPORT_PAD,
            rootBoundary: 'viewport',
            altAxis: true,
            tether: true,
          },
        },
        {
          name: 'computeStyles',
          options: { adaptive: true, gpuAcceleration: true },
        },
      ],
    })

    const id = window.requestAnimationFrame(() => {
      popperRef.current?.update()
    })

    return () => {
      window.cancelAnimationFrame(id)
      popperRef.current?.destroy()
      popperRef.current = null
    }
  }, [open, target, stepIndex, isMobile, manualPosition])

  // Medir tooltip para la línea conectora
  useLayoutEffect(() => {
    if (!open || !tooltipRef.current) {
      setTooltipRect(null)
      return undefined
    }
    const measure = () => {
      const r = tooltipRef.current?.getBoundingClientRect()
      if (!r) return
      setTooltipRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    }
    measure()
    const id = window.requestAnimationFrame(measure)
    return () => window.cancelAnimationFrame(id)
  }, [open, target, stepIndex, manualPosition, dragging])

  const onDragPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    const el = tooltipRef.current
    if (!el) return
    e.preventDefault()
    e.stopPropagation()
    const r = el.getBoundingClientRect()
    popperRef.current?.destroy()
    popperRef.current = null
    setManualPosition({ left: r.left, top: r.top })
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origLeft: r.left,
      origTop: r.top,
      width: r.width,
      height: r.height,
    }
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onDragPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    e.preventDefault()
    setManualPosition(
      clampPosition(
        d.origLeft + (e.clientX - d.startX),
        d.origTop + (e.clientY - d.startY),
        d.width,
        d.height,
      ),
    )
  }

  const onDragPointerUp = (e) => {
    if (!dragRef.current) return
    dragRef.current = null
    setDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  if (!open || !step) return null

  const pad = 8
  const radius = step.radius ?? 999
  const highlight = target
    ? {
        top: Math.max(0, target.top - pad),
        left: Math.max(0, target.left - pad),
        width: target.width + pad * 2,
        height: target.height + pad * 2,
      }
    : null

  const connector = highlight && tooltipRect
    ? connectorPoints(tooltipRect, highlight)
    : null
  const showConnector = connector && connector.dist >= CONNECTOR_MIN_DIST

  const tooltipMaxHeight = `calc(100vh - ${VIEWPORT_PAD * 2}px)`
  const tooltipWidth = `min(${TOOLTIP_MAX_W}px, calc(100vw - ${VIEWPORT_PAD * 2}px))`

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: (t) => t.zIndex.modal + 2,
      }}
    >
      <Box
        aria-hidden
        onClick={onClose}
        sx={{ position: 'absolute', inset: 0 }}
      />

      {highlight ? (
        <Box
          aria-hidden
          sx={{
            position: 'fixed',
            ...highlight,
            borderRadius: radius,
            boxShadow: `0 0 0 9999px ${alpha(colors.navy, 0.55)}, 0 0 0 3px ${colors.cream}`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ) : (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: alpha(colors.navy, 0.55),
            pointerEvents: 'none',
          }}
        />
      )}

      {showConnector && (
        <Box
          component="svg"
          aria-hidden
          sx={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'visible',
          }}
        >
          <line
            x1={connector.p1.x}
            y1={connector.p1.y}
            x2={connector.p2.x}
            y2={connector.p2.y}
            stroke={colors.cream}
            strokeWidth={1.75}
            strokeDasharray="5 4"
            strokeOpacity={0.75}
          />
          <circle
            cx={connector.p2.x}
            cy={connector.p2.y}
            r={3.5}
            fill={colors.cream}
            fillOpacity={0.85}
          />
        </Box>
      )}

      <Box
        ref={tooltipRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-titulo"
        sx={{
          position: 'fixed',
          zIndex: 2,
          width: tooltipWidth,
          maxWidth: TOOLTIP_MAX_W,
          maxHeight: tooltipMaxHeight,
          overflowY: 'auto',
          bgcolor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 3,
          p: 2.5,
          pt: 1.5,
          boxShadow: '0 8px 28px rgba(3, 14, 48, 0.18)',
          ...(manualPosition
            ? {
                left: manualPosition.left,
                top: manualPosition.top,
                transform: 'none',
                margin: 0,
              }
            : !target
              ? {
                  left: '50%',
                  top: '40%',
                  transform: 'translate(-50%, -50%)',
                }
              : {}),
        }}
      >
        {/* Handle de arrastre */}
        <Box
          role="separator"
          aria-label="Arrastrar recuadro de ayuda"
          onPointerDown={onDragPointerDown}
          onPointerMove={onDragPointerMove}
          onPointerUp={onDragPointerUp}
          onPointerCancel={onDragPointerUp}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            minHeight: 44,
            mx: -1,
            mb: 1,
            cursor: dragging ? 'grabbing' : 'grab',
            borderBottom: `1px solid ${colors.border}`,
            color: colors.muted,
            userSelect: 'none',
            touchAction: 'none',
            borderRadius: 1,
            '&:hover': { bgcolor: alpha(colors.primary, 0.04), color: colors.primary },
          }}
        >
          <GripHorizontal size={20} aria-hidden strokeWidth={1.75} />
          <Typography variant="caption" sx={{ fontWeight: 500, letterSpacing: '0.04em' }}>
            Mover
          </Typography>
        </Box>

        <Typography id="tour-titulo" variant="h3" component="h2" sx={{ mb: 1, fontSize: '1.25rem' }}>
          {step.titulo}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {step.descripcion}
        </Typography>
        <Typography variant="body2" color="text.secondary" aria-live="polite" sx={{ mb: 2 }}>
          Paso {stepIndex + 1} de {total}
        </Typography>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          >
            Anterior
          </Button>
          {stepIndex < total - 1 ? (
            <Button variant="contained" onClick={() => setStepIndex((i) => i + 1)}>
              Siguiente
            </Button>
          ) : (
            <Button variant="contained" onClick={onClose}>
              Terminar
            </Button>
          )}
          <Button variant="text" onClick={onClose} sx={{ ml: { sm: 'auto' } }}>
            Salir del recorrido
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
