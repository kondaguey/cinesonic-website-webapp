import React from "react";

export const metadata = {
  title: "Cookie Policy | CineSonic Production House",
  description: "Details on how we use cookies and tracking technologies.",
};

export default function CookiePage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-[#020014]">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <h5 className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Legal Documentation
          </h5>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Cookie Policy
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
            <p className="text-lg">
              This Cookie Policy explains how CineSonic Production House ("we",
              "us", and "our") uses cookies and similar technologies to
              recognize you when you visit our website. It explains what these
              technologies are and why we use them, as well as your rights to
              control our use of them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              What are cookies?
            </h2>
            <p>
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners in order to make their websites work, or to work
              more efficiently, as well as to provide reporting information.
              Cookies set by the website owner (us) are called "first party
              cookies". Cookies set by parties other than the website owner are
              called "third party cookies".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              Why do we use cookies?
            </h2>
            <p className="mb-4">
              We use first and third party cookies for several reasons:
            </p>
            <ul className="space-y-4">
              <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                <strong className="text-gold block mb-1">
                  Essential Cookies
                </strong>
                <span className="text-sm text-gray-400">
                  Required for technical reasons in order for our Website to
                  operate (e.g., logging into the Production Hub).
                </span>
              </li>
              <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                <strong className="text-gold block mb-1">
                  Performance & Analytics
                </strong>
                <span className="text-sm text-gray-400">
                  Used to track and analyze user behavior on our site to improve
                  functionality and user experience (e.g., Google Analytics).
                </span>
              </li>
              <li className="bg-white/5 p-4 rounded-lg border border-white/10">
                <strong className="text-gold block mb-1">
                  Functionality Cookies
                </strong>
                <span className="text-sm text-gray-400">
                  Enable us to remember choices you make (such as your user
                  name, language or the region you are in) and provide enhanced,
                  more personal features.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4">
              How can I control cookies?
            </h2>
            <p>
              You have the right to decide whether to accept or reject cookies.
              You can set or amend your web browser controls to accept or refuse
              cookies. If you choose to reject cookies, you may still use our
              website though your access to some functionality and areas of our
              website may be restricted.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
