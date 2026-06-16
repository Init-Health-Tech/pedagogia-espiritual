import { Box, Skeleton, Stack } from '@mui/material'

export default function LoadingScreen({ rows = 3 }) {
  return (
    <Stack spacing={2} sx={{ py: 2 }}>
      <Skeleton variant="text" width="40%" height={36} sx={{ borderRadius: 1 }} />
      <Skeleton variant="text" width="60%" height={24} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2, mt: 2 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={160} sx={{ borderRadius: 3 }} />
        ))}
      </Box>
      <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3, mt: 1 }} />
    </Stack>
  )
}
