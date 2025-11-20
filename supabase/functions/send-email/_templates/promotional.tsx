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

interface PromotionalEmailProps {
  customerName?: string;
  subject: string;
  previewText?: string;
  heroImage?: string;
  headline: string;
  subheadline?: string;
  bodyText: string;
  ctaText: string;
  ctaLink: string;
  productCards?: Array<{
    name: string;
    image: string;
    price: string;
    link: string;
  }>;
  footerText?: string;
}

export const PromotionalEmail = ({
  customerName,
  subject,
  previewText,
  heroImage,
  headline,
  subheadline,
  bodyText,
  ctaText,
  ctaLink,
  productCards,
  footerText,
}: PromotionalEmailProps) => (
  <Html>
    <Head />
    <Preview>{previewText || subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        {customerName && (
          <Text style={greeting}>Hi {customerName},</Text>
        )}
        
        {heroImage && (
          <Section style={heroSection}>
            <Img
              src={heroImage}
              alt={headline}
              style={heroImg}
            />
          </Section>
        )}
        
        <Heading style={h1}>{headline}</Heading>
        
        {subheadline && (
          <Text style={subheading}>{subheadline}</Text>
        )}
        
        <Text style={bodyTextStyle}>{bodyText}</Text>
        
        <Section style={ctaSection}>
          <Button style={button} href={ctaLink}>
            {ctaText}
          </Button>
        </Section>
        
        {productCards && productCards.length > 0 && (
          <Section style={productsSection}>
            <Heading style={h2}>Featured Products</Heading>
            <div style={productGrid}>
              {productCards.map((product, index) => (
                <div key={index} style={productCard}>
                  <Img
                    src={product.image}
                    alt={product.name}
                    style={productImg}
                  />
                  <Text style={productName}>{product.name}</Text>
                  <Text style={productPrice}>{product.price}</Text>
                  <Link href={product.link} style={productLink}>
                    Shop Now
                  </Link>
                </div>
              ))}
            </div>
          </Section>
        )}
        
        <Hr style={hr} />
        
        <Text style={footer}>
          {footerText || 'Thank you for being a valued customer at Sister Storage.'}
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

export default PromotionalEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const greeting = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333',
  marginBottom: '20px',
};

const heroSection = {
  marginBottom: '32px',
};

const heroImg = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
};

const h1 = {
  color: '#333',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0 20px',
  padding: '0',
};

const subheading = {
  color: '#666',
  fontSize: '18px',
  lineHeight: '28px',
  textAlign: 'center' as const,
  margin: '0 0 30px',
};

const bodyTextStyle = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 30px',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#FF69B4',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const productsSection = {
  margin: '40px 0',
};

const productGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '20px',
};

const productCard = {
  textAlign: 'center' as const,
};

const productImg = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  marginBottom: '12px',
};

const productName = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
  margin: '8px 0 4px',
};

const productPrice = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#FF69B4',
  margin: '4px 0 8px',
};

const productLink = {
  color: '#FF69B4',
  fontSize: '14px',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '40px 0',
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
