import React from "react";

export const metadata = {
  title: "Terms & Conditions | CineSonic Production House",
  description: "Terms of service and user agreement for CineSonic services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-[#020014]">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <h5 className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Legal Documentation
          </h5>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Terms & Conditions
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
            <h2 className="text-2xl font-serif text-white mb-4">
              1. Agreement to Terms
            </h2>
            <p>
              These Terms of Use constitute a legally binding agreement made
              between you, whether personally or on behalf of an entity (“you”)
              and CineSonic Production House (“we,” “us,” or “our”), concerning
              your access to and use of the CineSonic website and Production
              Hub. By accessing the Site, you agree that you have read,
              understood, and agreed to be bound by all of these Terms of Use.
              If you do not agree with all of these terms of use, then you are
              expressly prohibited from using the Site and must discontinue use
              immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              2. Intellectual Property Rights
            </h2>
            <p className="mb-4">
              Unless otherwise indicated, the Site is our proprietary property
              and all source code, databases, functionality, software, website
              designs, audio, video, text, photographs, and graphics on the Site
              (collectively, the “Content”) and the trademarks, service marks,
              and logos contained therein (the “Marks”) are owned or controlled
              by us or licensed to us, and are protected by copyright and
              trademark laws.
            </p>
            <p className="border-l-2 border-gold/50 pl-4 italic text-gray-400">
              <strong>Note on Audio Productions:</strong> Rights to audiobooks
              produced through our services are governed by the specific
              Production Agreements signed between CineSonic and the Rights
              Holder (Author/Publisher). These Terms of Use do not supersede
              those specific contract terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              3. User Representations
            </h2>
            <p>
              By using the Site, you represent and warrant that: (1) all
              registration information you submit will be true, accurate,
              current, and complete; (2) you will maintain the accuracy of such
              information; (3) you have the legal capacity and you agree to
              comply with these Terms of Use; and (4) you are not a minor in the
              jurisdiction in which you reside.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              4. Payment Terms & Cancellations
            </h2>
            <ul className="list-disc pl-5 space-y-3 marker:text-gold">
              <li>
                <strong>Deposits:</strong> A non-refundable deposit is required
                to book talent and schedule studio time.
              </li>
              <li>
                <strong>Milestones:</strong> Production payments are
                milestone-based (e.g., Upon Booking, Upon Checkpoint Approval,
                Upon Final Delivery).
              </li>
              <li>
                <strong>Late Fees:</strong> We reserve the right to charge late
                fees on overdue invoices as stipulated in your Production
                Agreement.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              5. Modifications and Interruptions
            </h2>
            <p>
              We reserve the right to change, modify, or remove the contents of
              the Site at any time or for any reason at our sole discretion
              without notice. We will not be liable to you or any third party
              for any modification, price change, suspension, or discontinuance
              of the Site. We cannot guarantee the Site will be available at all
              times. We may experience hardware, software, or other problems or
              need to perform maintenance related to the Site, resulting in
              interruptions, delays, or errors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              6. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and defined following the laws of
              the State of California. CineSonic Production House and yourself
              irrevocably consent that the courts of California shall have
              exclusive jurisdiction to resolve any dispute which may arise in
              connection with these terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
