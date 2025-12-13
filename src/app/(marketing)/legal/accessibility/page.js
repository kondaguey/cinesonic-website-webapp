import React from "react";

export const metadata = {
  title: "Accessibility Statement | CineSonic Production House",
  description: "Our commitment to digital accessibility.",
};

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-[#020014]">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <h5 className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Legal Documentation
          </h5>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Accessibility Statement
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

        {/* CONTENT */}
        <div className="space-y-10 text-gray-300 leading-relaxed font-sans">
          <section>
            <h2 className="text-2xl font-serif text-white mb-4">General</h2>
            <p>
              CineSonic Production House strives to ensure that its services are
              accessible to people with disabilities. CineSonic has invested a
              significant amount of resources to help ensure that its website is
              made easier to use and more accessible for people with
              disabilities, with the strong belief that every person has the
              right to live with dignity, equality, comfort, and independence.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              Accessibility on CineSonic.com
            </h2>
            <p>
              We are continuously improving the user experience for everyone and
              applying the relevant accessibility standards. We make every
              effort to conform to the Web Content Accessibility Guidelines
              (WCAG 2.1) Level AA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              Measures to Support Accessibility
            </h2>
            <p className="mb-4">
              CineSonic takes the following measures to ensure accessibility of
              our website:
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-gold">
              <li>Include accessibility as part of our internal mission.</li>
              <li>Integrate accessibility into our procurement practices.</li>
              <li>Provide continual accessibility training for our staff.</li>
              <li>Employ formal accessibility quality assurance methods.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">Feedback</h2>
            <p>
              We welcome your feedback on the accessibility of the CineSonic
              website. Please let us know if you encounter accessibility
              barriers on our site:
            </p>
            <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="mb-2">
                <strong>E-mail:</strong>{" "}
                <a
                  href="mailto:accessibility@cinesonic.com"
                  className="text-gold hover:underline"
                >
                  accessibility@cinesonic.com
                </a>
              </p>
              <p>
                <strong>Postal Address:</strong> Los Angeles, CA, United States
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              We try to respond to feedback within 2 business days.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
