import { Box, Typography } from '@mui/material'

export default function EditorialCard({ title, children, image }) {
  return (
    <Box className="landing-block card-hover landing-card-with-image">
      {image && (
        <Box component="img" src={image} alt="" className="landing-card-image" />
      )}
      <Typography variant="h3" className="font-display" sx={{ fontSize: '1.25rem', mb: 1 }}>{title}</Typography>
      <Typography variant="body1" color="text.secondary">{children}</Typography>
    </Box>
  )
}
