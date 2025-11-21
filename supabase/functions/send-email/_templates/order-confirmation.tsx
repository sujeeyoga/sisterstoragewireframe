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
  carrierCost?: number;
  tariffFees?: number;
  customMessage?: string;
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
  carrierCost,
  tariffFees,
  customMessage,
}: OrderConfirmationEmailProps) => {
  const isInternational = shippingAddress.country !== 'CA' && shippingAddress.country !== 'Canada';
  const baseShippingRate = tariffFees ? shipping - tariffFees : shipping;
  const showShippingBreakdown = tariffFees && tariffFees > 0;
  const isFreeShipping = shipping === 0;

  // Determine shipping reason label
  let shippingLabel = '';
  if (isFreeShipping) {
    shippingLabel = '🎉 Free Shipping Applied!';
  } else if (showShippingBreakdown && isInternational) {
    shippingLabel = 'International Shipping';
  } else {
    shippingLabel = 'Shipping';
  }

  return (
  <Html>
    <Head />
    <Preview>Your Sister Storage order #{orderNumber} has been confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank You for Your Order!</Heading>
        
        <Text style={text}>Hi {customerName},</Text>
        
        {customMessage && (
          <Section style={customMessageBox}>
            <Text style={customMessageText}>{customMessage}</Text>
          </Section>
        )}
        
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
          
          {showShippingBreakdown ? (
            <>
              <Row>
                <Column>
                  <Text style={{...totalLabel, color: '#16a34a', fontWeight: '600'}}>{shippingLabel}</Text>
                </Column>
                <Column style={alignRight}>
                  <Text style={totalValue}></Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={totalLabel}>Base Shipping Rate:</Text>
                </Column>
                <Column style={alignRight}>
                  <Text style={totalValue}>${baseShippingRate.toFixed(2)}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={{...totalLabel, color: '#ea580c'}}>Tariff & Customs Fees:</Text>
                </Column>
                <Column style={alignRight}>
                  <Text style={{...totalValue, color: '#ea580c'}}>+${tariffFees.toFixed(2)}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={totalLabel}>Total Shipping:</Text>
                </Column>
                <Column style={alignRight}>
                  <Text style={totalValue}>${shipping.toFixed(2)}</Text>
                </Column>
              </Row>
            </>
          ) : isFreeShipping ? (
            <Row>
              <Column>
                <Text style={{...totalLabel, color: '#16a34a', fontWeight: '600'}}>{shippingLabel}</Text>
              </Column>
              <Column style={alignRight}>
                <Text style={{...totalValue, color: '#16a34a', fontWeight: '600'}}>$0.00</Text>
              </Column>
            </Row>
          ) : (
            <Row>
              <Column>
                <Text style={totalLabel}>{shippingLabel}:</Text>
              </Column>
              <Column style={alignRight}>
                <Text style={totalValue}>${shipping.toFixed(2)}</Text>
              </Column>
            </Row>
          )}
          
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

        {showShippingBreakdown && (
          <>
            <Section style={tariffNotice}>
              <Text style={tariffNoticeText}>
                <strong>About Your Shipping Costs</strong>
              </Text>
              <Text style={tariffNoticeText}>
                Your order is being shipped internationally to {shippingAddress.country}. 
                Due to current international trade policies and tariff regulations, 
                additional customs and tariff fees of ${tariffFees.toFixed(2)} have been 
                applied to your shipping cost.
              </Text>
              <Text style={tariffNoticeText}>
                The total shipping cost of ${shipping.toFixed(2)} includes:
              </Text>
              <Text style={tariffNoticeText}>
                • Base carrier shipping rate: ${baseShippingRate.toFixed(2)}<br />
                • Tariff & customs fees: ${tariffFees.toFixed(2)}
              </Text>
              <Text style={tariffNoticeText}>
                These rates are calculated based on live carrier pricing at the time of your order 
                and include all applicable international fees. We're committed to transparency in 
                our pricing and showing you exactly what you're paying for.
              </Text>
            </Section>
          </>
        )}

        <Hr style={hr} />

        <Heading style={h2}>Shipping Address</Heading>
        <Text style={text}>
          {shippingAddress.name}<br />
          {shippingAddress.address}<br />
          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />
          {shippingAddress.country}
        </Text>

        <Section style={trackOrderSection}>
          <Text style={trackOrderText}>
            Want to track your order? Sign in with your phone number to view your order status anytime.
          </Text>
          <a href="https://sisterstoragebyhamna.com/customer/login" style={trackOrderButton}>
            Track Your Order
          </a>
        </Section>

        <Text style={footer}>
          If you have any questions, please don't hesitate to contact us.
          <br />
          Thank you for shopping with Sister Storage!
        </Text>
      </Container>
    </Body>
  </Html>
  );
};

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

const tariffNotice = {
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "6px",
  padding: "16px",
  marginTop: "16px",
  marginBottom: "16px",
};

const tariffNoticeText = {
  color: "#9a3412",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "8px 0",
};

const customMessageBox = {
  backgroundColor: "#f0f9ff",
  border: "2px solid #0ea5e9",
  borderRadius: "6px",
  padding: "16px",
  margin: "20px 0",
};

const customMessageText = {
  color: "#0c4a6e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const trackOrderSection = {
  backgroundColor: "#fdf2f8",
  border: "2px solid #ec4899",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const trackOrderText = {
  color: "#831843",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 16px",
};

const trackOrderButton = {
  backgroundColor: "#ec4899",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};
