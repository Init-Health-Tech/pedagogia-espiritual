import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Sí, continuar',
  cancelLabel = 'Cancelar',
  destructive = true,
  onConfirm,
  onClose,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 400 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 2 }}>
        <Button onClick={onClose} variant="outlined">{cancelLabel}</Button>
        <Button
          onClick={() => { onConfirm(); onClose() }}
          variant="contained"
          color={destructive ? 'error' : 'primary'}
          sx={destructive ? { ml: { xs: 0, sm: 1 } } : undefined}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
