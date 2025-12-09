import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface DelayedTrackingEmailProps {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export const DelayedTrackingEmail = ({
  customerName,
  orderNumber,
  trackingNumber,
  carrier,
  items,
  shippingAddress,
}: DelayedTrackingEmailProps) => {
  const trackingUrl = `https://www.google.com/search?q=${encodeURIComponent(trackingNumber)}`;

  return (
    <Html>
      <Head />
      <Preview>Your delayed tracking information for order #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brandHeading}>Sister Storage</Heading>
          </Section>

          {/* Apology Notice */}
          <Section style={apologyBox}>
            <Heading style={apologyTitle}>⏰ We Apologize for the Delay</Heading>
            <Text style={apologyText}>
              We sincerely apologize for not sending you tracking information sooner. 
              Your order has been on its way, and we want to make sure you can track it now.
            </Text>
          </Section>

          {/* Main Content */}
          <Heading style={h1}>Your Package is On The Way! 📦</Heading>
          
          <Text style={greeting}>Hi {customerName},</Text>
          
          <Text style={text}>
            Your order <strong>#{orderNumber}</strong> has been shipped and may already be close to delivery!
            Here's your tracking information:
          </Text>

          {/* Tracking Box */}
          <Section style={trackingBox}>
            <Text style={trackingLabel}>TRACKING NUMBER</Text>
            <Text style={trackingNumber}>{trackingNumber}</Text>
            <Text style={carrierText}>Carrier: {carrier}</Text>
            
            <Button style={button} href={trackingUrl}>
              Track Your Package
            </Button>
          </Section>

          {/* Shipped Items */}
          <Section style={itemsSection}>
            <Heading style={sectionTitle}>Shipped Items</Heading>
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <Text style={itemName}>
                  {item.name} × {item.quantity}
                </Text>
              </div>
            ))}
          </Section>

          {/* Shipping Address */}
          <Section style={addressSection}>
            <Heading style={sectionTitle}>Shipping Address</Heading>
            <Text style={address}>
              {shippingAddress.address}
              <br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
              <br />
              {shippingAddress.country}
            </Text>
          </Section>

          {/* Support Notice */}
          <Section style={supportBox}>
            <Text style={supportText}>
              <strong>Haven't received your package yet?</strong>
            </Text>
            <Text style={supportText}>
              Since we're sending this tracking information late, your package may already be out for delivery or very close to arriving. 
              If it hasn't arrived and the tracking shows it should have, please don't hesitate to contact our support team.
            </Text>
            <Text style={supportText}>
              We're here to help: <Link href="mailto:sisterstorageinc@gmail.com" style={link}>sisterstorageinc@gmail.com</Link>
            </Text>
          </Section>

          <Text style={text}>
            Thank you for your patience and for being a valued Sister Storage customer!
          </Text>

          <Text style={signature}>
            With sincere apologies,
            <br />
            <strong>The Sister Storage Team</strong>
          </Text>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            Sister Storage - Organized Living, Simplified
          </Text>
          <Text style={footer}>
            <Link href="https://sisterstorage.com" style={footerLink}>
              Visit Our Store
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default DelayedTrackingEmail;

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
};

const header = {
  backgroundColor: '#FFB7C5',
  padding: '30px 20px',
  textAlign: 'center' as const,
};

const brandHeading = {
  margin: '0',
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
};

const apologyBox = {
  backgroundColor: '#FFF4E6',
  border: '2px solid #FFB84D',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px',
  textAlign: 'center' as const,
};

const apologyTitle = {
  color: '#CC7A00',
  fontSize: '18px',
  marginTop: '0',
  marginBottom: '12px',
};

const apologyText = {
  color: '#663C00',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};

const h1 = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0 20px',
  textAlign: 'center' as const,
};

const greeting = {
  color: '#333333',
  fontSize: '16px',
  marginBottom: '16px',
  padding: '0 20px',
};

const text = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '16px',
  padding: '0 20px',
};

const trackingBox = {
  backgroundColor: '#f8f9fa',
  border: '2px solid #FFB7C5',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 20px',
  textAlign: 'center' as const,
};

const trackingLabel = {
  color: '#666666',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  marginBottom: '8px',
};

const trackingNumber = {
  color: '#333333',
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '8px',
  fontFamily: 'monospace',
};

const carrierText = {
  color: '#666666',
  fontSize: '14px',
  marginBottom: '20px',
};

const button = {
  backgroundColor: '#FFB7C5',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const itemsSection = {
  margin: '32px 20px',
};

const sectionTitle = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '16px',
  borderBottom: '2px solid #FFB7C5',
  paddingBottom: '8px',
};

const itemRow = {
  padding: '12px 0',
  borderBottom: '1px solid #eeeeee',
};

const itemName = {
  color: '#333333',
  fontSize: '14px',
};

const addressSection = {
  margin: '32px 20px',
};

const address = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.6',
  backgroundColor: '#f8f9fa',
  padding: '16px',
  borderRadius: '6px',
};

const supportBox = {
  backgroundColor: '#E8F5E9',
  border: '2px solid #81C784',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 20px',
};

const supportText = {
  color: '#2E7D32',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '8px 0',
};

const link = {
  color: '#1976D2',
  textDecoration: 'underline',
};

const signature = {
  color: '#666666',
  fontSize: '14px',
  margin: '32px 20px',
  lineHeight: '1.6',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '40px 20px',
};

const footer = {
  color: '#999999',
  fontSize: '12px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '8px 20px',
};

const footerLink = {
  color: '#FFB7C5',
  textDecoration: 'none',
};
