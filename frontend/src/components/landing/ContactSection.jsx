import { Box, Button, TextField } from '@mui/material'
import FormField from '../common/FormField'
import SectionHeading from './SectionHeading'
import ScrollSection from './ScrollSection'

export default function ContactSection() {
  return (
    <ScrollSection id="contacto" alt>
      <SectionHeading overline="Contacto" title="Escríbenos" subtitle="¿Preguntas sobre el movimiento o la formación?" />
      <Box component="form" className="landing-block landing-block--filled" onSubmit={(e) => e.preventDefault()}>
        <FormField label="Nombre completo" required>
          <TextField required fullWidth hiddenLabel placeholder="Tu nombre completo" size="small" />
        </FormField>
        <FormField label="Correo electrónico" required helper="Te responderemos a este correo">
          <TextField type="email" required fullWidth hiddenLabel placeholder="correo@ejemplo.com" size="small" />
        </FormField>
        <FormField label="Asunto">
          <TextField fullWidth hiddenLabel placeholder="¿Sobre qué nos escribes?" size="small" />
        </FormField>
        <FormField label="Mensaje" required>
          <TextField multiline rows={4} required fullWidth hiddenLabel placeholder="Escribe tu mensaje aquí" />
        </FormField>
        <Button type="submit" variant="contained" className="landing-btn" fullWidth sx={{ mt: 0.5 }}>Enviar mensaje</Button>
      </Box>
    </ScrollSection>
  )
}
