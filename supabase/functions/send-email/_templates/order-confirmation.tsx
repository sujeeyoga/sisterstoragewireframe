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
  Row,
  Column,
} from "npm:@react-email/components@0.0.22";
import * as React from "npm:react@18.3.1";

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  orderDate,
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Sister Storage order #{orderNumber} has been confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank You for Your Order!</Heading>
        
        <Text style={text}>Hi {customerName},</Text>
        
        <Text style={text}>
          We've received your order and we're getting it ready. We'll send you a shipping
          confirmation email as soon as your order ships.
        </Text>

        <Section style={orderInfo}>
          <Row>
            <Column>
              <Text style={label}>Order Number</Text>
              <Text style={value}>#{orderNumber}</Text>
            </Column>
            <Column>
              <Text style={label}>Order Date</Text>
              <Text style={value}>{orderDate}</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={hr} />

        <Heading style={h2}>Order Details</Heading>

        {items.map((item, index) => (
          <Section key={index} style={itemRow}>
            <Row>
              <Column style={itemName}>
                <Text style={text}>
                  {item.name} x {item.quantity}
                </Text>
              </Column>
              <Column style={itemPrice}>
                <Text style={text}>${item.price.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>
        ))}

        <Hr style={hr} />

        <Section style={totals}>
          <Row>
            <Column>
              <Text style={totalLabel}>Subtotal:</Text>
            </Column>
            <Column style={alignRight}>
              <Text style={totalValue}>${subtotal.toFixed(2)}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={totalLabel}>Shipping:</Text>
            </Column>
            <Column style={alignRight}>
              <Text style={totalValue}>${shipping.toFixed(2)}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={totalLabel}>Tax:</Text>
            </Column>
            <Column style={alignRight}>
              <Text style={totalValue}>${tax.toFixed(2)}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={totalLabelBold}>Total:</Text>
            </Column>
            <Column style={alignRight}>
              <Text style={totalValueBold}>${total.toFixed(2)} CAD</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={hr} />

        <Heading style={h2}>Shipping Address</Heading>
        <Text style={text}>
          {shippingAddress.name}<br />
          {shippingAddress.address}<br />
          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />
          {shippingAddress.country}
        </Text>

        <Text style={footer}>
          If you have any questions, please don't hesitate to contact us.
          <br />
          Thank you for shopping with Sister Storage!
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

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

const orderInfo = {
  margin: "20px 0",
  padding: "20px",
  backgroundColor: "#f9fafb",
  borderRadius: "4px",
};

const label = {
  color: "#666",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

const value = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const itemRow = {
  margin: "10px 0",
};

const itemName = {
  width: "70%",
};

const itemPrice = {
  width: "30%",
  textAlign: "right" as const,
};

const totals = {
  margin: "20px 0",
};

const totalLabel = {
  color: "#666",
  fontSize: "14px",
  margin: "5px 0",
};

const totalValue = {
  color: "#333",
  fontSize: "14px",
  margin: "5px 0",
};

const totalLabelBold = {
  ...totalLabel,
  fontWeight: "bold",
  fontSize: "16px",
};

const totalValueBold = {
  ...totalValue,
  fontWeight: "bold",
  fontSize: "16px",
};

const alignRight = {
  textAlign: "right" as const,
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "30px",
  textAlign: "center" as const,
};
