import { useEffect, useRef } from 'react'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useReducedMotion } from 'framer-motion'
import { HEADER_HEIGHT } from '../../../utils/marketingNav'
import { colors } from '../../../theme/muiTheme'

const NAV_WIDTH = 220
const STEP_ACCENTS = [colors.primary, colors.blue, colors.secondary, colors.accent, colors.moss]

function NavItem({ step, shortTitle, index, isActive, onSelect, layout, reduceMotion, itemRef }) {
  const accent = STEP_ACCENTS[index % STEP_ACCENTS.length]
  const transition = reduceMotion ? 'none' : 'background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease, transform 0.35s ease'

  if (layout === 'horizontal') {
    return (
      <Box
        component="button"
        type="button"
        ref={itemRef}
        onClick={() => onSelect(step.id)}
        aria-current={isActive ? 'step' : undefined}
        sx={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 1,
          border: `1px solid ${isActive ? accent : colors.border}`,
          borderRadius: 999,
          bgcolor: isActive ? colors.surface : 'rgba(255,255,255,0.55)',
          cursor: 'pointer',
          transition,
          transform: isActive ? 'scale(1.02)' : 'scale(1)',
          font: 'inherit',
          color: 'inherit',
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: isActive ? accent : 'transparent',
            border: `1.5px solid ${isActive ? accent : colors.border}`,
            color: isActive ? colors.cream : colors.muted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 700,
            fontFamily: '"Libre Baskerville", Georgia, serif',
            transition,
          }}
        >
          {step.num}
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            fontWeight: isActive ? 600 : 400,
            color: isActive ? colors.dark : colors.muted,
            whiteSpace: 'nowrap',
            transition,
          }}
        >
          {shortTitle}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onSelect(step.id)}
      aria-current={isActive ? 'step' : undefined}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
        width: '100%',
        px: 1.25,
        py: 1,
        mb: 0.25,
        border: 'none',
        borderRadius: 1.5,
        bgcolor: isActive ? 'rgba(242, 235, 224, 0.95)' : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        font: 'inherit',
        color: 'inherit',
        transition,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '12%',
          bottom: '12%',
          width: 3,
          borderRadius: 2,
          bgcolor: accent,
          opacity: isActive ? 1 : 0,
          transition,
        },
        '&:hover': {
          bgcolor: isActive ? 'rgba(242, 235, 224, 0.95)' : 'rgba(255,255,255,0.35)',
        },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          borderRadius: '50%',
          bgcolor: isActive ? accent : 'transparent',
          border: `1.5px solid ${isActive ? accent : colors.border}`,
          color: isActive ? colors.cream : colors.muted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.72rem',
          fontWeight: 700,
          fontFamily: '"Libre Baskerville", Georgia, serif',
          transition,
          transform: isActive ? 'scale(1.06)' : 'scale(1)',
        }}
      >
        {step.num}
      </Box>
      <Typography
        variant="body2"
        sx={{
          pt: 0.5,
          lineHeight: 1.35,
          fontSize: '0.8125rem',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? colors.dark : colors.muted,
          transition,
        }}
      >
        {shortTitle}
      </Typography>
    </Box>
  )
}

export default function ItinerarioProgressNav({
  steps,
  activeId,
  onSelect,
  label = 'Tu recorrido',
  ariaLabel = 'Progreso del itinerario formativo',
}) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const reduceMotion = useReducedMotion()
  const itemRefs = useRef(new Map())
  const activeIndex = steps.findIndex((s) => s.id === activeId)
  const progress = steps.length > 1 ? ((activeIndex + 1) / steps.length) * 100 : 100

  useEffect(() => {
    if (isDesktop) return
    const node = itemRefs.current.get(activeId)
    node?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
  }, [activeId, isDesktop, reduceMotion])

  if (!isDesktop) {
    return (
      <Box
        component="nav"
        aria-label={ariaLabel}
        sx={{
          position: 'sticky',
          top: HEADER_HEIGHT,
          zIndex: 2,
          mx: -3,
          px: 3,
          py: 1.5,
          mb: 2,
          bgcolor: 'rgba(235, 219, 178, 0.94)',
          backdropFilter: 'blur(6px)',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Box sx={{ height: 2, bgcolor: colors.border, borderRadius: 1, mb: 1.25, overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              width: `${progress}%`,
              bgcolor: colors.accent,
              borderRadius: 1,
              transition: reduceMotion ? 'none' : 'width 0.45s ease',
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 0.5,
            scrollbarWidth: 'thin',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: colors.border, borderRadius: 2 },
          }}
        >
          {steps.map((step, index) => (
            <NavItem
              key={step.id}
              step={step}
              shortTitle={step.shortTitle}
              index={index}
              isActive={step.id === activeId}
              onSelect={onSelect}
              layout="horizontal"
              reduceMotion={reduceMotion}
              itemRef={(node) => {
                if (node) itemRefs.current.set(step.id, node)
                else itemRefs.current.delete(step.id)
              }}
            />
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <Box
      component="nav"
      aria-label={ariaLabel}
      sx={{
        width: NAV_WIDTH,
        flexShrink: 0,
        position: 'sticky',
        top: `calc(${HEADER_HEIGHT}px + 1.5rem)`,
        alignSelf: 'flex-start',
        maxHeight: `calc(100svh - ${HEADER_HEIGHT}px - 3rem)`,
        overflowY: 'auto',
        pr: 1,
        scrollbarWidth: 'thin',
      }}
    >
      <Typography variant="overline" className="section-overline" display="block" sx={{ mb: 1.5, px: 0.5 }}>
        {label}
      </Typography>

      <Box sx={{ position: 'relative', pl: 0.5 }}>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: 17,
            top: 20,
            bottom: 20,
            width: 2,
            bgcolor: colors.border,
            borderRadius: 1,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: 17,
            top: 20,
            width: 2,
            height: `max(0px, calc(${progress}% - 40px))`,
            maxHeight: 'calc(100% - 40px)',
            bgcolor: colors.accent,
            borderRadius: 1,
            transition: reduceMotion ? 'none' : 'height 0.45s ease',
          }}
        />

        {steps.map((step, index) => (
          <NavItem
            key={step.id}
            step={step}
            shortTitle={step.shortTitle}
            index={index}
            isActive={step.id === activeId}
            onSelect={onSelect}
            layout="vertical"
            reduceMotion={reduceMotion}
            itemRef={null}
          />
        ))}
      </Box>
    </Box>
  )
}
