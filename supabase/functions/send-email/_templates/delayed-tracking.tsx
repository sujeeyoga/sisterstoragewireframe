import React from "react";

interface DelayedTrackingEmailProps {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrierName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    address?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    postcode?: string;
    country?: string;
  };
}

export const DelayedTrackingEmail: React.FC<DelayedTrackingEmailProps> = ({
  customerName,
  orderNumber,
  trackingNumber,
  carrierName,
  items,
  shippingAddress,
}) => {
  const trackingUrl = `https://www.google.com/search?q=${encodeURIComponent(trackingNumber)}`;

  return (
    <html>
      <body style={bodyStyle}>
        <div style={containerStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <h1 style={brandStyle}>Sister Storage</h1>
          </div>

          {/* Apology Notice */}
          <div style={apologyBoxStyle}>
            <h2 style={apologyTitleStyle}>⏰ We Apologize for the Delay</h2>
            <p style={apologyTextStyle}>
              We sincerely apologize for not sending you tracking information sooner. 
              Your order has been on its way, and we want to make sure you can track it now.
            </p>
          </div>

          {/* Main Content */}
          <div style={contentStyle}>
            <h2 style={titleStyle}>Your Package is On The Way! 📦</h2>
            
            <p style={greetingStyle}>Hi {customerName},</p>
            
            <p style={textStyle}>
              Your order <strong>#{orderNumber}</strong> has been shipped and may already be close to delivery!
              Here's your tracking information:
            </p>

            {/* Tracking Box */}
            <div style={trackingBoxStyle}>
              <div style={trackingLabelStyle}>Tracking Number</div>
              <div style={trackingNumberStyle}>{trackingNumber}</div>
              <div style={carrierStyle}>Carrier: {carrierName}</div>
              
              <a href={trackingUrl} style={buttonStyle}>
                Track Your Package
              </a>
            </div>

            {/* Shipped Items */}
            <div style={itemsSectionStyle}>
              <h3 style={sectionTitleStyle}>Shipped Items</h3>
              {items.map((item, index) => (
                <div key={index} style={itemRowStyle}>
                  <div style={itemNameStyle}>
                    {item.name} × {item.quantity}
                  </div>
                  <div style={itemPriceStyle}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div style={addressSectionStyle}>
              <h3 style={sectionTitleStyle}>Shipping Address</h3>
              <div style={addressStyle}>
                {shippingAddress.address || shippingAddress.address_1}
                {shippingAddress.address_2 && (
                  <>
                    <br />
                    {shippingAddress.address_2}
                  </>
                )}
                <br />
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postal_code || shippingAddress.postcode}
                <br />
                {shippingAddress.country}
              </div>
            </div>

            {/* Support Notice */}
            <div style={supportBoxStyle}>
              <p style={supportTextStyle}>
                <strong>Haven't received your package yet?</strong>
              </p>
              <p style={supportTextStyle}>
                Since we're sending this tracking information late, your package may already be out for delivery or very close to arriving. 
                If it hasn't arrived and the tracking shows it should have, please don't hesitate to contact our support team.
              </p>
              <p style={supportTextStyle}>
                We're here to help: <a href="mailto:sisterstorageinc@gmail.com" style={linkStyle}>sisterstorageinc@gmail.com</a>
              </p>
            </div>

            <p style={textStyle}>
              Thank you for your patience and for being a valued Sister Storage customer!
            </p>

            <p style={signatureStyle}>
              With sincere apologies,
              <br />
              <strong>The Sister Storage Team</strong>
            </p>
          </div>

          {/* Footer */}
          <div style={footerStyle}>
            <p style={footerTextStyle}>
              Sister Storage - Organized Living, Simplified
            </p>
            <p style={footerTextStyle}>
              <a href="https://sisterstorage.com" style={footerLinkStyle}>
                Visit Our Store
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

// Styles
const bodyStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  backgroundColor: "#f5f5f5",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};

const headerStyle: React.CSSProperties = {
  backgroundColor: "#FFB7C5",
  padding: "30px 20px",
  textAlign: "center",
};

const brandStyle: React.CSSProperties = {
  margin: 0,
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
};

const apologyBoxStyle: React.CSSProperties = {
  backgroundColor: "#FFF4E6",
  border: "2px solid #FFB84D",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px",
  textAlign: "center",
};

const apologyTitleStyle: React.CSSProperties = {
  color: "#CC7A00",
  fontSize: "18px",
  marginTop: 0,
  marginBottom: "12px",
};

const apologyTextStyle: React.CSSProperties = {
  color: "#663C00",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: 0,
};

const contentStyle: React.CSSProperties = {
  padding: "30px 20px",
};

const titleStyle: React.CSSProperties = {
  color: "#333333",
  fontSize: "24px",
  marginTop: 0,
  marginBottom: "20px",
  textAlign: "center",
};

const greetingStyle: React.CSSProperties = {
  color: "#333333",
  fontSize: "16px",
  marginBottom: "16px",
};

const textStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "16px",
};

const trackingBoxStyle: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  border: "2px solid #FFB7C5",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center",
};

const trackingLabelStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "8px",
};

const trackingNumberStyle: React.CSSProperties = {
  color: "#333333",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "8px",
  fontFamily: "monospace",
};

const carrierStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: "14px",
  marginBottom: "20px",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#FFB7C5",
  color: "#ffffff",
  padding: "12px 32px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "14px",
};

const itemsSectionStyle: React.CSSProperties = {
  marginTop: "32px",
  marginBottom: "32px",
};

const sectionTitleStyle: React.CSSProperties = {
  color: "#333333",
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "16px",
  borderBottom: "2px solid #FFB7C5",
  paddingBottom: "8px",
};

const itemRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #eeeeee",
};

const itemNameStyle: React.CSSProperties = {
  color: "#333333",
  fontSize: "14px",
};

const itemPriceStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: "14px",
  fontWeight: "bold",
};

const addressSectionStyle: React.CSSProperties = {
  marginTop: "32px",
  marginBottom: "32px",
};

const addressStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.6",
  backgroundColor: "#f8f9fa",
  padding: "16px",
  borderRadius: "6px",
};

const supportBoxStyle: React.CSSProperties = {
  backgroundColor: "#E8F5E9",
  border: "2px solid #81C784",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const supportTextStyle: React.CSSProperties = {
  color: "#2E7D32",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "8px 0",
};

const linkStyle: React.CSSProperties = {
  color: "#1976D2",
  textDecoration: "underline",
};

const signatureStyle: React.CSSProperties = {
  color: "#666666",
  fontSize: "14px",
  marginTop: "32px",
  lineHeight: "1.6",
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  padding: "24px 20px",
  textAlign: "center",
  borderTop: "1px solid #eeeeee",
};

const footerTextStyle: React.CSSProperties = {
  color: "#999999",
  fontSize: "12px",
  margin: "8px 0",
};

const footerLinkStyle: React.CSSProperties = {
  color: "#FFB7C5",
  textDecoration: "none",
};
