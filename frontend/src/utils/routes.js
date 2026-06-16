export function getHomeRoute(user) {
  if (!user) return '/'
  if (user.role === 'admin' || user.is_superuser) return '/admin'
  if (user.role === 'coordinator') return '/coord'
  return '/app'
}
