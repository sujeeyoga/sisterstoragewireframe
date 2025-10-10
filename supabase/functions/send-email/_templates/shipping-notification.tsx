import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Hr,
  Preview,
  Section,
  Text,
  Link,
} from "npm:@react-email/components@0.0.22";
import * as React from "npm:react@18.3.1";

interface ShippingNotificationEmailProps {
  customerName: string;
  orderNumber: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
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

export const ShippingNotificationEmail = ({
  customerName,
  orderNumber,
  trackingNumber,
  carrier,
  estimatedDelivery,
  items,
  shippingAddress,
}: ShippingNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Sister Storage order #{orderNumber} has shipped!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your Order Has Shipped! 📦</Heading>
        
        <Text style={text}>Hi {customerName},</Text>
        
        <Text style={text}>
          Great news! Your order has been shipped and is on its way to you.
        </Text>

        <Section style={trackingBox}>
          <Text style={trackingLabel}>Order Number</Text>
          <Text style={trackingValue}>#{orderNumber}</Text>
          
          {trackingNumber && (
            <>
              <Text style={trackingLabel}>Tracking Number</Text>
              <Text style={trackingValue}>{trackingNumber}</Text>
            </>
          )}
          
          {carrier && (
            <>
              <Text style={trackingLabel}>Carrier</Text>
              <Text style={trackingValue}>{carrier}</Text>
            </>
          )}
          
          {estimatedDelivery && (
            <>
              <Text style={trackingLabel}>Estimated Delivery</Text>
              <Text style={trackingValue}>{estimatedDelivery}</Text>
            </>
          )}
        </Section>

        {trackingNumber && (
          <Section style={buttonContainer}>
            <Link href={`https://www.google.com/search?q=${trackingNumber}`} style={button}>
              Track Your Package
            </Link>
          </Section>
        )}

        <Hr style={hr} />

        <Heading style={h2}>Items Shipped</Heading>

        {items.map((item, index) => (
          <Text key={index} style={text}>
            • {item.name} x {item.quantity}
          </Text>
        ))}

        <Hr style={hr} />

        <Heading style={h2}>Shipping Address</Heading>
        <Text style={text}>
          {shippingAddress.name}<br />
          {shippingAddress.address}<br />
          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />
          {shippingAddress.country}
        </Text>

        <Text style={footer}>
          If you have any questions about your shipment, please don't hesitate to contact us.
          <br />
          Thank you for shopping with Sister Storage!
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ShippingNotificationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0 20px",
  padding: "0",
  textAlign: "center" as const,
};

const h2 = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "30px 0 15px",
};

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 10px",
};

const trackingBox = {
  margin: "30px 0",
  padding: "24px",
  backgroundColor: "#f0f7ff",
  borderRadius: "8px",
  border: "2px solid #0066cc",
};

const trackingLabel = {
  color: "#666",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  margin: "15px 0 5px",
};

const trackingValue = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 5px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#0066cc",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "30px",
  textAlign: "center" as const,
};
