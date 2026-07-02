const HEADER_HEIGHT = 64

export function scrollToHash(hash) {
  if (!hash?.startsWith('#')) return
  const el = document.querySelector(hash)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

export function parseMarketingHref(href) {
  if (!href) return { pathname: '/', hash: '' }
  if (href.startsWith('#')) return { pathname: null, hash: href }
  const [pathname, hashPart] = href.split('#')
  return { pathname: pathname || '/', hash: hashPart ? `#${hashPart}` : '' }
}

export function navigateToMarketingHref(navigate, href, { replace = false } = {}) {
  const { pathname, hash } = parseMarketingHref(href)
  if (pathname === null) {
    scrollToHash(hash)
    return
  }
  const target = `${pathname}${hash}`
  navigate(target, { replace })
}

export { HEADER_HEIGHT }
