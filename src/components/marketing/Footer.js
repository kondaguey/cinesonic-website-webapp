import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Twitch,
  Facebook,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020014] border-t border-white/5 pt-16 pb-8 overflow-hidden text-center md:text-left">
      {/* --- AMBIENT GLOW --- */}
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none -ml-10 -mb-10" />

      <div className="max-w-7xl container mx-auto px-6 relative z-10">
        {/* === MAIN GRID === */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-10 gap-x-4 md:gap-8 mb-10">
          {/* 1. BRAND COLUMN */}
          {/* Desktop Order: 1 (Leftmost) */}
          <div className="pb-4 col-span-2 md:col-span-5 flex flex-col items-center md:items-start gap-5 md:order-1">
            <div
              className="max-w-lg space-y-6 font-sans font-light leading-loose tracking-wide
                text-white/50 
                [&_p]:text-xs [&_p]:md:text-sm"
            >
              <p>
                CineSonic Audiobooks creates literary audio of the highest
                caliber. We cast from a "professional actor first" mindset,
                ensuring every performance is shaped by expressive talent.
              </p>
              <p>
                Extending our commitment to the craft, we are now{" "}
                <span className="bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent font-medium">
                  pioneering premier education
                </span>
                —empowering authors to narrate their own works and guiding
                aspiring voices as they break into the industry with confidence
                and artistry.
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-8 md:mt-2">
              <SocialIcon
                href="https://instagram.com"
                icon={<Instagram size={16} />}
              />
              <SocialIcon
                href="https://twitter.com"
                icon={<Twitter size={16} />}
              />
              <SocialIcon
                href="https://youtube.com"
                icon={<Youtube size={16} />}
              />
              <SocialIcon
                href="https://linkedin.com"
                icon={<Linkedin size={16} />}
              />
            </div>
          </div>

          {/* 2. PRODUCTION COLUMN */}
          {/* Desktop Order: 3 (Next to Contact) */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start border-r border-gold/30 md:border-none pr-2 md:pr-0 md:order-3">
            <h5 className="text-white font-serif font-bold text-sm mb-4 tracking-widest uppercase">
              Audiobook Services
            </h5>
            <ul className="flex flex-col gap-2 w-full">
              <FooterLink href="/solo-audiobook-production">
                Solo Narration
              </FooterLink>
              <FooterLink href="/dual-audiobook-production">
                Dual Narration
              </FooterLink>
              <FooterLink href="/duet-audiobook-production">
                Duet Narration
              </FooterLink>
              <FooterLink href="/multicast-audiobook-production">
                Full-Cast Audio
              </FooterLink>
            </ul>
          </div>

          {/* 3. COMPANY COLUMN */}
          {/* Desktop Order: 2 (Swapped to Left of Production) */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start pl-2 md:pl-0 md:order-2">
            <h5 className="text-white font-serif font-bold text-sm mb-4 tracking-widest uppercase">
              Company
            </h5>
            <ul className="flex flex-col gap-2 w-full">
              <FooterLink href="/about-us">Production Process</FooterLink>
              <FooterLink href="/talent-submissions">
                Talent Submissions
              </FooterLink>
              <FooterLink href="/blog">Production Blog</FooterLink>
              <FooterLink href="/frequently-asked-questions">FAQ</FooterLink>
              <FooterLink href="/dashboard" highlight>
                Production Hub
              </FooterLink>
            </ul>
          </div>

          {/* 4. CONTACT COLUMN */}
          {/* Desktop Order: 4 (Far Right) */}
          <div className="col-span-2 md:col-span-3 pt-4 md:pt-0 border-t border-white/5 md:border-none flex flex-col items-center md:items-start md:order-4">
            <h5 className="hidden md:block text-white font-serif font-bold text-sm mb-4 tracking-widest uppercase">
              Contact
            </h5>
            <ul className="flex flex-col items-center md:items-start gap-4 md:gap-3 mt-2 md:mt-0">
              <li className="flex items-center md:items-start gap-2 text-xs text-gray-400">
                <Mail size={14} className="text-gold shrink-0" />{" "}
                <a
                  href="mailto:dm@cinesonicaudiobooks.com"
                  className="text-[10px] hover:text-white transition-colors"
                >
                  talent submissions: casting@cinesonicaudiobooks.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* === BOTTOM BAR === */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-6 opacity-50"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-600 tracking-wider">
            &copy; {currentYear} CineSonic Audiobooks. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <LegalLink href="/legal/privacy-policy">Privacy</LegalLink>
            <LegalLink href="/legal/terms-and-conditions">Terms</LegalLink>
            <LegalLink href="/legal/cookie-policy">Cookies</LegalLink>
            <LegalLink href="/legal/accessibility">Accessibility</LegalLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ----------------------------------------
// HELPER COMPONENTS
// ----------------------------------------

function FooterLink({ href, children, highlight = false }) {
  return (
    <li>
      <Link
        href={href}
        className={`text-xs transition-all duration-300 inline-block hover:translate-x-1 ${
          highlight ? "text-gold font-bold" : "text-gray-500 hover:text-gold"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}

function LegalLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-[10px] text-gray-600 hover:text-gold uppercase tracking-widest transition-colors font-medium"
    >
      {children}
    </Link>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-gold hover:border-gold/50 hover:bg-gold/10 transition-all duration-300 hover:-translate-y-1"
    >
      {icon}
    </a>
  );
}
