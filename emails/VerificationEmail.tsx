import * as React from 'react';

interface VerificationEmailProps {
  firstName: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
  </div>
);