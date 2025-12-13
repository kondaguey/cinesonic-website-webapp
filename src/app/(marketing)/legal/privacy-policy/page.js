import React from "react";

export const metadata = {
  title: "Privacy Policy | CineSonic Production House",
  description: "Our commitment to protecting your data and privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-deep-space">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <h5 className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Legal Documentation
          </h5>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* CONTENT - "prose" style manual formatting */}
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <p className="text-lg">
              At CineSonic Audiobooks ("we", "us", or "our"), we respect your
              privacy and are committed to protecting your personal data. This
              privacy policy will inform you as to how we look after your
              personal data when you visit our website or use our production
              services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-gold">
              <li>
                <strong>Identity Data:</strong> includes first name, last name,
                username or similar identifier.
              </li>
              <li>
                <strong>Contact Data:</strong> includes billing address,
                delivery address, email address and telephone numbers.
              </li>
              <li>
                <strong>Project Data:</strong> includes manuscripts, audio
                files, and production notes uploaded to our Production Hub.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              2. How We Use Your Data
            </h2>
            <p>
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-gold">
              <li>To register you as a new customer or talent partner.</li>
              <li>To process and deliver your audio production orders.</li>
              <li>
                To manage our relationship with you which will include notifying
                you about changes to our terms or privacy policy.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              3. Data Security
            </h2>
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed. In addition, we limit
              access to your personal data to those employees, agents,
              contractors and other third parties who have a business need to
              know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              4. Contact Us
            </h2>
            <p>
              If you have any questions about this privacy policy or our privacy
              practices, please contact our data privacy manager at:{" "}
              <a
                href="mailto:privacy@cinesonic.com"
                className="text-gold hover:underline"
              >
                privacy@cinesonic.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
