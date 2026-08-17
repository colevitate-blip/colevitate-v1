import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service — Colevitate",
  description: "The terms that govern your use of Colevitate.",
};

const LAST_UPDATED = "August 17, 2026";
const CONTACT_EMAIL = "hello@colevitate.com";

export default function TermsOfServicePage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <p className="text-muted-foreground">
        These Terms of Service (&quot;Terms&quot;) govern your use of Colevitate at colevitate.com (the
        &quot;Service&quot;). By using the Service, you agree to these Terms. If you don&apos;t agree, please
        don&apos;t use the Service.
      </p>

      <section>
        <h2>The Service</h2>
        <p>
          Colevitate offers self-report personality assessments — 16 Personalities-style typology,
          Big Five, Human Design, and 4 Color Types — and combines your results into a single
          profile. The Service is provided for self-insight, reflection, and entertainment
          purposes only. It is not a clinical, diagnostic, or scientific instrument, and it is not
          a substitute for professional advice of any kind (medical, psychological, legal, or
          otherwise).
        </p>
      </section>

      <section>
        <h2>Accounts</h2>
        <p>
          You can use most of the Service without an account, with results kept on your device.
          Creating an account (via Google or email) lets you sync results across devices and
          optionally share your profile. You&apos;re responsible for keeping your account secure and
          for all activity under it.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose or in violation of these Terms.</li>
          <li>Attempt to disrupt, reverse-engineer, or gain unauthorized access to the Service.</li>
          <li>Use automated means to scrape or extract data from the Service at scale.</li>
          <li>Impersonate another person or misrepresent your affiliation with anyone.</li>
        </ul>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          You retain ownership of the answers, notes, and profile information you submit. By
          choosing to make a profile public or share it via a link, you grant us permission to
          display that content to anyone who accesses the link, until you make it private again or
          delete it.
        </p>
      </section>

      <section>
        <h2>Our content</h2>
        <p>
          The Service&apos;s design, questions, scoring logic, and branding are owned by Colevitate or
          our licensors and are protected by intellectual property laws. You may use the Service
          for personal, non-commercial purposes only.
        </p>
      </section>

      <section>
        <h2>Disclaimers</h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind,
          express or implied. Personality results are self-reported reflections, not objective
          facts about you, and shouldn&apos;t be used as the sole basis for medical, legal, financial,
          employment, or other significant decisions.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Colevitate will not be liable for any indirect,
          incidental, or consequential damages arising from your use of the Service.
        </p>
      </section>

      <section>
        <h2>Changes and termination</h2>
        <p>
          We may modify or discontinue the Service, or suspend or terminate access for violations
          of these Terms. We may update these Terms from time to time; continued use after changes
          means you accept the updated Terms.
        </p>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>
          Questions about these Terms? Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalPageShell>
  );
}
