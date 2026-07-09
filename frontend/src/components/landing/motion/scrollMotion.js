/** Curva suave, sin rebotes — ritmo contemplativo */
export const EASE_GENTLE = [0.22, 1, 0.36, 1]

export const REVEAL_DURATION = 0.85
export const STAGGER_CHILDREN = 0.11

export const VIEWPORT_DEFAULT = {
  once: true,
  amount: 0.18,
  margin: '0px 0px -8% 0px',
}

export function revealTransition(delay = 0) {
  return {
    duration: REVEAL_DURATION,
    ease: EASE_GENTLE,
    delay,
  }
}
