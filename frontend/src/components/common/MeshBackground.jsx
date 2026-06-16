import { Box } from '@mui/material'
import { colors } from '../../theme/muiTheme'

export default function MeshBackground({ subtle = false }) {
  return (
    <Box
      className="texture-bg"
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        bgcolor: colors.light,
        opacity: subtle ? 0.8 : 1,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.accent}18 0%, transparent 70%)`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '45%',
          height: '45%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.moss}12 0%, transparent 70%)`,
        }}
      />
    </Box>
  )
}
