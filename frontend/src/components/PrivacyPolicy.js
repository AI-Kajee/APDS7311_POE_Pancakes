import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <div className="privacy-policy-content">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Atlas Trust</strong> (referred to as "we," "our," or "us") is committed to protecting the privacy of its users (referred to as "you," "your," or "users"). This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our website and services. By using the Atlas Trust website, you consent to the practices described in this policy.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We may collect personal and non-personal information from you when you use our services. This includes but is not limited to:
        </p>
        <ul>
          <li>
            <strong>Personal Information</strong>: When you register or log in, we collect information such as your name, email address, phone number, and account details.
          </li>
          <li>
            <strong>Payment Information</strong>: For secure transactions, we collect payment details such as bank account numbers and SWIFT codes when you make international payments.
          </li>
          <li>
            <strong>Technical Information</strong>: We automatically collect data about your device and usage, including IP addresses, browser type, and access times, to enhance your experience on the platform.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li>To create and manage your account.</li>
          <li>To process payments and currency conversions.</li>
          <li>To provide customer support and communicate important information.</li>
          <li>To monitor and analyze usage trends for improvements and security.</li>
          <li>To prevent fraudulent activity and ensure compliance with banking regulations.</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We take your privacy and data security seriously. Our platform uses industry-standard encryption technologies and adheres to strict security measures to protect your personal and financial information from unauthorized access, misuse, or disclosure.
        </p>
        <ul>
          <li>
            <strong>Authentication</strong>: We utilize strong authentication methods, ensuring secure user login and account management.
          </li>
          <li>
            <strong>Encryption</strong>: All payment transactions and sensitive data are encrypted using secure protocols (SSL/TLS) to maintain the confidentiality and integrity of your information.
          </li>
        </ul>

        <h2>4. Sharing Your Information</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your data with:</p>
        <ul>
          <li>
            <strong>Service Providers</strong>: Trusted third-party services (e.g., Gemini API for currency conversion) to provide and enhance our platform functionality.
          </li>
          <li>
            <strong>Legal Requirements</strong>: We may disclose your information if required to do so by law or in response to valid requests from government authorities.
          </li>
        </ul>

        <h2>5. Third-Party Services</h2>
        <p>
          Our website may use third-party APIs and services (e.g., Gemini API) to enhance functionality. These third parties have their own privacy policies, and we encourage you to review them.
        </p>

        <h2>6. Your Rights and Choices</h2>
        <p>As a user, you have the right to:</p>
        <ul>
          <li>Access and update your personal information in your account settings.</li>
          <li>Request deletion of your account and personal information.</li>
          <li>Opt out of receiving non-essential communications.</li>
          <li>Restrict certain data processing activities where applicable by law.</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us using the information provided below.
        </p>

        <h2>7. Cookies</h2>
        <p>
          Our website may use cookies and similar tracking technologies to enhance your user experience, analyze website performance, and customize content. You can control cookie preferences through your browser settings.
        </p>

        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Your continued use of our website following the posting of changes constitutes your acceptance of such changes.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:
        </p>
        <footer>
          <strong>Atlas Trust Team</strong><br />
          Email: <a href="mailto:support@atlastrust.com">support@atlastrust.com</a>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
