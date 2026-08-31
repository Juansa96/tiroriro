import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'TiroRiro Home'

interface ContactInternalProps {
  fullName?: string
  email?: string
  phone?: string
  productList?: string
  otherDetail?: string
  configSummary?: string
  details?: string
  submittedAt?: string
  previewLink?: string
  tracking?: string
}

const ContactInternalEmail = ({
  fullName = 'Sin nombre',
  email = '',
  phone,
  productList = 'No especificado',
  otherDetail,
  configSummary,
  details,
  submittedAt,
  previewLink,
  tracking,
}: ContactInternalProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Nueva solicitud de {fullName} — {productList}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Nueva solicitud de presupuesto</Heading>
          <Text style={headerSub}>{SITE_NAME} · Formulario web{submittedAt ? ` · ${submittedAt}` : ''}</Text>
        </Section>

        <Section style={card}>
          <Row label="Nombre" value={fullName} />
          <Row label="Email" value={<Link href={`mailto:${email}`} style={linkStyle}>{email}</Link>} />
          {phone ? <Row label="Teléfono" value={<Link href={`tel:${phone}`} style={linkStyle}>{phone}</Link>} /> : null}
          <Row label="Productos" value={productList} last={!otherDetail} />
          {otherDetail ? <Row label="Detalle" value={otherDetail} last /> : null}

          {configSummary ? (
            <Section style={configBox}>
              <Text style={configLabel}>Configuración del diseñador</Text>
              <Text style={configContent}>{configSummary}</Text>
              {previewLink ? (
                <Section style={{ textAlign: 'center', marginTop: '14px' }}>
                  <Button href={previewLink} style={previewBtn}>
                    Ver diseño del cliente →
                  </Button>
                  <Text style={previewHint}>
                    Abre el enlace para ver el dibujo y todos los datos seleccionados.
                  </Text>
                </Section>
              ) : null}
            </Section>
          ) : null}

          {details ? (
            <Section style={{ marginTop: '20px' }}>
              <Text style={messageLabel}>Mensaje del cliente</Text>
              <Text style={messageBox}>{details}</Text>
            </Section>
          ) : null}

          {tracking ? (
            <Section style={{ marginTop: '20px' }}>
              <Text style={messageLabel}>Origen de campaña</Text>
              <Text style={messageBox}>{tracking}</Text>
            </Section>
          ) : null}



          <Hr style={hr} />
          <Text style={replyNote}>
            👆 Responde directamente a este email para contactar con {fullName.split(' ')[0]}
          </Text>
        </Section>

        <Text style={footer}>Enviado desde tirorirohome.com</Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value, last }: { label: string; value: React.ReactNode; last?: boolean }) => (
  <Section style={{ borderBottom: last ? 'none' : '1px solid #f0ede8', padding: '10px 0' }}>
    <Text style={rowLabel}>{label}</Text>
    <Text style={rowValue}>{value}</Text>
  </Section>
)

export const template = {
  component: ContactInternalEmail,
  subject: (d: Record<string, any>) =>
    `Nueva solicitud de ${d.fullName ?? 'cliente'} — ${d.productList ?? 'web'}`,
  to: 'info@tirorirohome.com',
  displayName: 'Notificación interna de contacto',
  previewData: {
    fullName: 'María García',
    email: 'maria@example.com',
    phone: '600111222',
    productList: 'Cabeceros',
    details: 'Hola, me gustaría un cabecero para un colchón de 150cm.',
    submittedAt: 'lunes, 1 de enero de 2025, 10:30',
    configSummary: 'Cabecero Pregonda · 150 cm × 100 cm · Tela Arequipa Beige · Vivo simple',
    previewLink: 'https://tirorirohome.com/?previewType=cabecero#contacto',
  },
} satisfies TemplateEntry

// Styles
const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif', color: '#1a1a1a', margin: 0, padding: 0 }
const container = { maxWidth: '600px', margin: '0 auto', padding: '24px' }
const header = { backgroundColor: '#1a4b5b', padding: '24px 28px', borderRadius: '8px 8px 0 0' }
const h1 = { fontSize: '20px', fontWeight: 400, color: '#ffffff', margin: 0, letterSpacing: '0.02em' }
const headerSub = { color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '6px 0 0', fontFamily: 'Arial, sans-serif' }
const card = { backgroundColor: '#ffffff', border: '1px solid #e8e4de', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '24px 28px' }
const rowLabel = { color: '#888', fontSize: '11px', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 4px' }
const rowValue = { fontSize: '15px', color: '#1a1a1a', margin: 0 }
const linkStyle = { color: '#1a4b5b', textDecoration: 'none' }
const configBox = { backgroundColor: '#f5f0e8', borderLeft: '3px solid #1a4b5b', padding: '14px 16px', margin: '20px 0 0', borderRadius: '0 6px 6px 0' }
const configLabel = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#1a4b5b', margin: '0 0 8px', fontWeight: 600, fontFamily: 'Arial, sans-serif' }
const configContent = { fontFamily: 'Georgia, serif', fontSize: '13px', color: '#333', margin: 0, whiteSpace: 'pre-wrap' as const }
const messageLabel = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#888', margin: '0 0 10px', fontWeight: 600, fontFamily: 'Arial, sans-serif' }
const messageBox = { fontSize: '14px', lineHeight: '1.75', color: '#333', margin: 0, whiteSpace: 'pre-wrap' as const, backgroundColor: '#faf8f5', padding: '14px 16px', borderRadius: '6px', border: '1px solid #ede9e1' }
const hr = { borderColor: '#f0ede8', margin: '20px 0 14px' }
const replyNote = { fontSize: '13px', color: '#1a4b5b', textAlign: 'center' as const, backgroundColor: '#f0f7f9', padding: '12px', borderRadius: '6px', margin: 0 }
const footer = { fontSize: '11px', color: '#bbb', textAlign: 'center' as const, marginTop: '16px', fontFamily: 'Arial, sans-serif' }
const previewBtn = { backgroundColor: '#1a4b5b', color: '#ffffff', textDecoration: 'none', padding: '10px 22px', borderRadius: '6px', fontSize: '13px', fontFamily: 'Arial, sans-serif', fontWeight: 500 }
const previewHint = { fontSize: '11px', color: '#888', margin: '8px 0 0', fontFamily: 'Arial, sans-serif', fontStyle: 'italic' as const }