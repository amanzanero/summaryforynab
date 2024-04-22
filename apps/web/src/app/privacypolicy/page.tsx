export default async function PrivacyPolicy() {
  return (
    <article className="prose dark:text-white">
      <h1 className="dark:text-white">Privacy Policy</h1>
      <h2 className="dark:text-white">Information We Collect</h2>

      <p>
        <strong className="dark:text-white">YNAB data: </strong>We collect
        information from your YNAB account once you provide authorization. Only
        information from the YNAB budgeting software itself is collected.
      </p>
      <ul>
        <li>
          We have no access to nor do we collect nor stores bank credentials or
          information.
        </li>
        <li>
          We only store your YNAB access token to access your budget for our
          scheduled report service.
        </li>
        <li>We do not store any other data collected from YNAB.</li>
      </ul>

      <p>
        <strong className="dark:text-white">Personal Information:</strong> We
        may collect certain personal information such as name, email address, or
        phone number when you register or use our app.
      </p>

      <p>
        <strong className="dark:text-white">Usage Data:</strong> We may collect
        information about how you use the app, including interactions with
        features and content.
      </p>

      <h2 className="dark:text-white">How We Use Your Information</h2>
      <p>
        We use the information collected to provide and improve our services,
        personalize your experience, and communicate with you.
      </p>
      <h2 className="dark:text-white">Data Sharing</h2>
      <p>
        We do not sell, trade, or otherwise transfer your personal information
        to third parties without your consent, except as described in this
        policy or required by law.
      </p>
      <h2 className="dark:text-white">Data Security</h2>
      <p>
        We implement security measures to protect your personal information from
        unauthorized access and maintain its accuracy.
      </p>
      <h2 className="dark:text-white">Third-Party Services</h2>
      <p>
        Our app may contain links to third-party websites or services that have
        their own privacy policies. We are not responsible for the privacy
        practices of these third parties.
      </p>
      <h2 className="dark:text-white">Updates to Our Privacy Policy</h2>
      <p>
        We may update our privacy policy from time to time. Any changes will be
        reflected on this page.
      </p>
      <h2 className="dark:text-white">Contact Us</h2>
      <p>
        If you have any questions or concerns about our privacy practices,
        please contact us at{" "}
        <a
          className="dark:text-white dark:hover:text-gray-300"
          href="mailto:digestforynab@amanzanero.com"
        >
          digestforynab@amanzanero.com
        </a>
        .
      </p>
    </article>
  );
}
