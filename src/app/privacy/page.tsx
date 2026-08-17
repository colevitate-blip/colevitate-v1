import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Colevitate",
  description: "How Colevitate collects, uses, and protects your data.",
};

const LAST_UPDATED = "August 17, 2026";
const CONTACT_EMAIL = "hello@colevitate.com";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p className="text-muted-foreground">
        Colevitate (&quot;we&quot;, &quot;us&quot;) provides personality assessments — 16 Personalities-style
        typology, Big Five, Human Design, and 4 Color Types — and combines them into a single profile.
        This policy explains what information we collect when you use colevitate.com (the
        &quot;Service&quot;), how we use it, and the choices you have.
      </p>

      <section>
        <h2>Information we collect</h2>
        <p>We collect as little as we need to run the Service:</p>
        <ul>
          <li>
            <strong>Assessment answers and results.</strong> By default these are stored only in
            your browser&apos;s local storage and never sent to our servers. If you create an
            account, your results, combined-profile history, and related preferences are also
            stored in our database so you can access them from other devices.
          </li>
          <li>
            <strong>Account information.</strong> If you sign in with Google, we receive your
            name, email address, and profile picture from Google. If you sign in with an email
            magic link, we collect only your email address.
          </li>
          <li>
            <strong>Profile and sharing settings.</strong> If you choose to make a profile public,
            the display name, avatar, and personality results you select become visible to anyone
            with the share link.
          </li>
          <li>
            <strong>Optional feedback.</strong> If you leave a note about a question (e.g. &quot;this
            was hard to answer&quot;), that note is stored to help us improve the assessments.
          </li>
        </ul>
        <p>
          We do not require or collect sensitive information such as government ID, payment
          details, or health records, and the assessments themselves do not ask for your real
          name, date of birth, or location.
        </p>
      </section>

      <section>
        <h2>How we use information</h2>
        <ul>
          <li>To run the assessments and generate your combined personality profile.</li>
          <li>To let you sign in, sync results across devices, and revisit past results.</li>
          <li>To support the sharing feature, if and when you turn it on.</li>
          <li>To send you sign-in (&quot;magic link&quot;) emails.</li>
          <li>To improve question quality, using anonymized or aggregated feedback where possible.</li>
        </ul>
        <p>We do not sell your personal information, and we do not use your data to serve ads.</p>
      </section>

      <section>
        <h2>Third-party services</h2>
        <p>We rely on a small number of infrastructure providers to operate the Service:</p>
        <ul>
          <li>
            <strong>Google Sign-In</strong> — used as an authentication option. Google&apos;s handling
            of your data is governed by{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Supabase</strong> — hosts our authentication and database, and stores account
            and results data for signed-in users.
          </li>
          <li>
            <strong>Resend</strong> — delivers sign-in emails.
          </li>
        </ul>
      </section>

      <section>
        <h2>Cookies and local storage</h2>
        <p>
          We use local storage to keep your in-progress and completed assessments on your device,
          and essential cookies to keep you signed in. We don&apos;t use third-party advertising or
          tracking cookies.
        </p>
      </section>

      <section>
        <h2>Data retention and deletion</h2>
        <p>
          Locally stored results stay on your device until you clear your browser data. Account
          data is kept while your account is active. You can delete your account and associated
          data at any time from Settings, or by contacting us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct, export, or
          delete your personal information, and to object to or restrict certain processing. To
          exercise any of these rights, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>Children&apos;s privacy</h2>
        <p>
          The Service is not directed to children under 13, and we do not knowingly collect
          personal information from them.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. If we make material changes, we&apos;ll update
          the &quot;Last updated&quot; date above.
        </p>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>
          Questions about this policy or your data? Email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalPageShell>
  );
}
