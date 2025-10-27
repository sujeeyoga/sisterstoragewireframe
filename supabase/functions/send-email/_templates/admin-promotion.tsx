import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface AdminPromotionEmailProps {
  email: string;
  loginUrl: string;
}

export const AdminPromotionEmail = ({
  email,
  loginUrl,
}: AdminPromotionEmailProps) => (
  <Html>
    <Head />
    <Preview>You've been granted admin access to Sister Storage</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Admin Access Granted</Heading>
        
        <Text style={text}>
          Great news! You've been granted administrator access to the Sister Storage platform.
        </Text>

        <Text style={text}>
          Your account <strong>{email}</strong> now has full admin privileges. You can log in using your existing password.
        </Text>

        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>What you can do as an admin:</strong>
          </Text>
          <Text style={infoText}>
            • Manage products and inventory<br />
            • View and process orders<br />
            • Access customer information<br />
            • Manage site content and settings<br />
            • View analytics and reports
          </Text>
        </Section>

        <Section style={buttonContainer}>
          <Link href={loginUrl} style={button}>
            Access Admin Panel
          </Link>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          If you have any questions or didn't expect this access, please contact your system administrator.
        </Text>

        <Text style={footer}>
          Sister Storage Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AdminPromotionEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '580px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 48px',
};

const infoBox = {
  backgroundColor: '#f0f7ff',
  border: '1px solid #d0e8ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 48px',
};

const infoText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

const buttonContainer = {
  padding: '0 48px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#D946EF',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 48px',
  margin: '8px 0',
};
