export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-dark-blue">
      <div className="mx-auto px-10 py-20 lg:px-20">
        <h1 className="mb-12 text-4xl font-black text-white md:text-5xl">PRIVACY POLICY</h1>

        <div className="prose prose-invert max-w-none space-y-10">
          {/* Analytics */}
          <section>
            <h2 className="mb-4 text-2xl font-black text-white">Analytics</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We use Google Analytics to analyze website traffic and improve our services. Google
              Analytics collects data about your interactions with our website, including pages
              visited, time spent on the site, and other usage statistics. This data helps us
              understand user behavior and optimize the website experience. Google Analytics may use
              cookies and other tracking technologies to collect this information. All data
              collected is processed in accordance with Google&apos;s Privacy Policy. You can opt
              out of Google Analytics tracking by using the Google Analytics Opt-out Browser Add-on.
            </p>
          </section>

          {/* Application Form */}
          <section>
            <h2 className="mb-4 text-2xl font-black text-white">Application Form</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              For the purpose of our application process we store your application including
              personal details you provided. After our application phase is completed, we will
              delete all personal data. Some non-personifiable answers will be used for statistical
              purposes.
            </p>
          </section>

          {/* Newsletter */}
          <section>
            <h2 className="mb-4 text-2xl font-black text-white">Newsletter</h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-300">
              <p>By subscribing to the newsletter, you agree to the following terms:</p>
              <p>
                We will use your email address to send you our regular newsletter. For newsletter
                delivery, we use Brevo. Your email address will be used exclusively for sending the
                newsletter and will not be shared with third parties. You can withdraw your consent
                to store your personal data and its use for newsletter delivery at any time. Each
                newsletter contains an unsubscribe link for this purpose. You can also send us an
                email to{' '}
                <a href="mailto:info@startmunich.de" className="text-brand-pink hover:underline">
                  info@startmunich.de
                </a>
                .
              </p>
              <p>
                Registration for our newsletter takes place in a so-called double opt-in procedure.
                This means that after registering, you will receive an e-mail asking you to confirm
                your registration. This confirmation is necessary so that no one can register with
                other people&apos;s e-mail addresses. Subscriptions to the newsletter are logged in
                order to be able to prove the registration process in accordance with legal
                requirements. This includes storing the time of registration and confirmation as
                well as the IP address.
              </p>
            </div>
          </section>

          {/* Cancellation / Revocation */}
          <section>
            <h2 className="mb-4 text-2xl font-black text-white">Cancellation / Revocation</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              You can cancel the receipt of our newsletter at any time, i.e. revoke your consent.
              Your consent to receive the newsletter via the mailing service and the statistical
              analyses will expire at the same time. Unfortunately, it is not possible to cancel the
              sending of the newsletter via the mailing service or the statistical analysis
              separately. You will find a link to unsubscribe from the newsletter at the end of each
              newsletter.
            </p>
          </section>

          {/* Legal Basis */}
          <section>
            <h2 className="mb-4 text-2xl font-black text-white">
              Legal Basis of the General Data Protection Regulations
            </h2>
            <p className="text-lg leading-relaxed text-gray-300">
              In accordance with the provisions of the General Data Protection Regulation (GDPR)
              applicable from May 25, 2018, we inform you that the consent to the sending of e-mail
              addresses is based on Art. 6 para. 1 lit. a, 7 GDPR and &sect; 7 para. 2 no. 3, or
              para. 3 UWG. The use of the mailing service provider Brevo, the implementation of
              statistical surveys and analyses as well as the logging of the registration process
              are based on our legitimate interests in accordance with Art. 6 para. 1 lit. f GDPR.
              We are interested in using a user-friendly and secure newsletter system that serves
              our business interests and meets the expectations of users. We would also like to
              point out that you can object to the future processing of your personal data in
              accordance with the legal requirements pursuant to Art. 21 GDPR at any time. In
              particular, you may object to processing for direct marketing purposes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
