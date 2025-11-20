import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface AnnouncementEmailProps {
  customerName?: string;
  subject: string;
  previewText?: string;
  image?: string;
  headline: string;
  bodyText: string;
  ctaText?: string;
  ctaLink?: string;
  footerText?: string;
}

export const AnnouncementEmail = ({
  customerName,
  subject,
  previewText,
  image,
  headline,
  bodyText,
  ctaText,
  ctaLink,
  footerText,
}: AnnouncementEmailProps) => (
  <Html>
    <Head />
    <Preview>{previewText || subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        {customerName && (
          <Text style={greeting}>Hi {customerName},</Text>
        )}
        
        <Section style={announcementBox}>
          <Heading style={h1}>{headline}</Heading>
          
          {image && (
            <Section style={imageSection}>
              <Img
                src={image}
                alt={headline}
                style={img}
              />
            </Section>
          )}
          
          <Text style={bodyTextStyle}>{bodyText}</Text>
          
          {ctaText && ctaLink && (
            <Section style={ctaSection}>
              <Button style={button} href={ctaLink}>
                {ctaText}
              </Button>
            </Section>
          )}
        </Section>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          {footerText || 'Thank you for being part of the Sister Storage community.'}
        </Text>
        
        <Text style={footer}>
          <Link href="https://sisterstorage.ca" style={link}>
            Visit our website
          </Link>
          {' • '}
          <Link href="https://instagram.com/sisterstorage" style={link}>
            Follow us on Instagram
          </Link>
        </Text>
        
        <Text style={unsubscribe}>
          Don't want to receive these emails? <Link href="#" style={link}>Unsubscribe</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AnnouncementEmail;

const main = {
  backgroundColor: '#f6f6f6',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const greeting = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333',
  marginBottom: '30px',
};

const announcementBox = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '40px',
  marginBottom: '32px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const h1 = {
  color: '#333',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '0 0 30px',
  padding: '0',
  lineHeight: '44px',
  textAlign: 'center' as const,
};

const imageSection = {
  margin: '30px 0',
};

const img = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
};

const bodyTextStyle = {
  color: '#333',
  fontSize: '18px',
  lineHeight: '28px',
  margin: '0 0 30px',
  textAlign: 'center' as const,
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0 0',
};

const button = {
  backgroundColor: '#FF69B4',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 40px',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '32px 0',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};

const link = {
  color: '#FF69B4',
  textDecoration: 'underline',
};

const unsubscribe = {
  color: '#999',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  marginTop: '32px',
};
