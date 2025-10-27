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
  Code,
} from "npm:@react-email/components@0.0.22";
import * as React from "npm:react@18.3.1";

interface AdminWelcomeEmailProps {
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}

export const AdminWelcomeEmail = ({
  email,
  temporaryPassword,
  loginUrl,
}: AdminWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Sister Storage Admin Panel</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to Sister Storage</Heading>
        
        <Text style={text}>
          You've been invited to join the Sister Storage admin team! 
        </Text>

        <Text style={text}>
          Your account has been created with the following credentials:
        </Text>

        <Section style={credentialsBox}>
          <Text style={label}>Email:</Text>
          <Code style={code}>{email}</Code>
          
          <Text style={{ ...label, marginTop: '16px' }}>Temporary Password:</Text>
          <Code style={code}>{temporaryPassword}</Code>
        </Section>

        <Section style={warningBox}>
          <Text style={warningText}>
            ⚠️ <strong>Important Security Notice</strong>
          </Text>
          <Text style={warningText}>
            You will be required to change this password on your first login. 
            Please do not share these credentials with anyone.
          </Text>
        </Section>

        <Section style={instructionsBox}>
          <Text style={instructionTitle}>Getting Started:</Text>
          <Text style={instruction}>1. Click the login button below</Text>
          <Text style={instruction}>2. Enter your email and temporary password</Text>
          <Text style={instruction}>3. Create a new secure password</Text>
          <Text style={instruction}>4. Start managing Sister Storage!</Text>
        </Section>

        <Link
          href={loginUrl}
          target="_blank"
          style={button}
        >
          Login to Admin Panel
        </Link>

        <Hr style={hr} />

        <Text style={footer}>
          If you didn't expect this email or believe it was sent in error, 
          please contact your administrator immediately.
        </Text>

        <Text style={footer}>
          <Link
            href="https://sisterstorage.com"
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Sister Storage
          </Link>
          {' '}- Organize Your Jewelry, Beautifully
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AdminWelcomeEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const credentialsBox = {
  background: '#f4f4f4',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
  border: '1px solid #e0e0e0',
};

const label = {
  color: '#666',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const code = {
  display: 'inline-block',
  padding: '12px 16px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  border: '1px solid #ddd',
  color: '#000',
  fontSize: '16px',
  fontWeight: '600',
  fontFamily: 'monospace',
};

const warningBox = {
  background: '#fff3cd',
  borderRadius: '8px',
  padding: '16px 24px',
  margin: '24px 40px',
  border: '1px solid #ffc107',
};

const warningText = {
  color: '#856404',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const instructionsBox = {
  padding: '0 40px',
  margin: '24px 0',
};

const instructionTitle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const instruction = {
  color: '#666',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '4px 0',
  paddingLeft: '8px',
};

const button = {
  backgroundColor: '#000',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: 'calc(100% - 80px)',
  padding: '16px',
  margin: '32px 40px',
};

const hr = {
  borderColor: '#e0e0e0',
  margin: '32px 40px',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '8px 0',
  padding: '0 40px',
};

const link = {
  color: '#000',
  textDecoration: 'underline',
};
