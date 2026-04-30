import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'TiroRiro Home'

interface ContactConfirmationProps {
  firstName?: string
  productList?: string
}

const ContactConfirmationEmail = ({
  firstName = '',
  productList = 'tu solicitud',
}: ContactConfirmationProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Hemos recibido tu solicitud — te respondemos en menos de 24h</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>{firstName ? `Gracias, ${firstName}` : 'Gracias'}</Heading>
          <Text style={headerSub}>Hemos recibido tu solicitud</Text>
        </Section>

        <Section style={card}>
          <Text style={intro}>
            Tu petición sobre <strong style={{ color: '#1a4b5b' }}>{productList}</strong> está en nuestras manos.<br />
            Te respondemos en <strong>menos de 24 horas laborables</strong>.
          </Text>

          <Section style={stepsBox}>
            <Text style={stepsLabel}>Próximos pasos</Text>
            <Text style={stepItem}>✦ Revisamos tu solicitud con detalle</Text>
            <Text style={stepItem}>✦ Te enviamos presupuesto personalizado</Text>
            <Text style={stepItem}>✦ Empezamos cuando tú confirmes</Text>
          </Section>

          <Text style={ctaIntro}>
            Si tienes prisa o prefieres hablar, escríbenos por WhatsApp:
          </Text>

          <Section style={{ textAlign: 'center' }}>
            <Button href="https://wa.me/34660786453" style={waButton}>
              Abrir WhatsApp
            </Button>
          </Section>

          <Hr style={hr} />
          <Text style={footerNote}>
            {SITE_NAME} ·{' '}
            <Link href="https://tirorirohome.com" style={linkStyle}>tirorirohome.com</Link>
            <br />
            Si no esperabas este email, puedes ignorarlo con seguridad.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: (d: Record<string, any>) =>
    d.firstName
      ? `Hemos recibido tu solicitud, ${d.firstName} ✦`
      : 'Hemos recibido tu solicitud ✦',
  displayName: 'Confirmación de contacto al cliente',
  previewData: {
    firstName: 'María',
    productList: 'Cabeceros',
  },
} satisfies TemplateEntry

// Styles
const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif', color: '#1a1a1a', margin: 0, padding: 0 }
const container = { maxWidth: '600px', margin: '0 auto', padding: '24px' }
const header = { backgroundColor: '#1a4b5b', padding: '32px 28px', borderRadius: '8px 8px 0 0', textAlign: 'center' as const }
const h1 = { fontSize: '26px', fontWeight: 300, color: '#ffffff', margin: 0, letterSpacing: '0.02em' }
const headerSub = { color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '10px 0 0', fontFamily: 'Arial, sans-serif' }
const card = { backgroundColor: '#ffffff', border: '1px solid #e8e4de', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '32px 28px', textAlign: 'center' as const }
const intro = { fontSize: '16px', lineHeight: '1.75', color: '#444', margin: '0 0 24px' }
const stepsBox = { backgroundColor: '#f5f0e8', borderRadius: '8px', padding: '20px 28px', margin: '0 0 28px', textAlign: 'left' as const }
const stepsLabel = { margin: '0 0 10px', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#888', fontFamily: 'Arial, sans-serif', fontWeight: 600 }
const stepItem = { margin: '6px 0', fontSize: '14px', color: '#333' }
const ctaIntro = { fontSize: '14px', color: '#666', margin: '0 0 20px', lineHeight: '1.6' }
const waButton = { backgroundColor: '#25D366', color: '#ffffff', textDecoration: 'none', padding: '12px 28px', borderRadius: '6px', fontSize: '14px', fontFamily: 'Arial, sans-serif', fontWeight: 500 }
const hr = { borderColor: '#f0ede8', margin: '32px 0 20px' }
const footerNote = { fontSize: '12px', color: '#bbb', margin: 0, fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }
const linkStyle = { color: '#1a4b5b', textDecoration: 'none' }