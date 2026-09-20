import { useState } from 'react';

/**
 * The bottom bar under the main footer.
 *
 * Copyright and legal links on the left; language selector, currency
 * selector and social icons on the right. The two selectors are the only
 * genuinely dynamic controls in the footer — real state, changing the
 * label shown. Everything else is clickable (a real hover state) but goes
 * nowhere, since this is a front-end-only capstone build.
 */

const LANGUAGES = ['English (US)', 'English (UK)', 'Français', 'Español', '日本語', 'Deutsch'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'MXN'];

export default function CopyrightFooter() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  return (
    <div className="copyright-footer">
      <div className="container copyright-footer__inner">
        <div className="copyright-footer__legal">
          <span>&copy; 2022 Airbnb, Inc.</span>
          <span className="copyright-footer__dot" aria-hidden="true">
            &middot;
          </span>
          <button type="button" className="copyright-footer__link">
            Privacy
          </button>
          <span className="copyright-footer__dot" aria-hidden="true">
            &middot;
          </span>
          <button type="button" className="copyright-footer__link">
            Terms
          </button>
          <span className="copyright-footer__dot" aria-hidden="true">
            &middot;
          </span>
          <button type="button" className="copyright-footer__link">
            Sitemap
          </button>
        </div>

        <div className="copyright-footer__controls">
          {/* Globe icon + language select */}
          <label className="copyright-footer__select-wrap">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
              <path d="M8 .25a7.75 7.75 0 1 1 0 15.5A7.75 7.75 0 0 1 8 .25zm1.5 8.5h-3c.1 2.4.8 4.2 1.5 4.9.7-.7 1.4-2.5 1.5-4.9zm-4.5 0H1.8a6.3 6.3 0 0 0 4 5.4c-.5-1.2-.9-3.1-.8-5.4zm9.2 0H11c0 2.3-.3 4.2-.8 5.4a6.3 6.3 0 0 0 4-5.4zM6 1.85l-.2.06a6.3 6.3 0 0 0-4 5.34H5c.1-2.1.4-3.9.9-5.1zM8 1.6l-.1.1c-.7.8-1.3 2.5-1.4 4.7h3c-.1-2.2-.7-3.9-1.4-4.7L8 1.6zm2 .25.14.35c.44 1.16.75 2.87.8 4.75h3.2a6.3 6.3 0 0 0-3.85-5.28L10 1.85z" />
            </svg>
            <select
              className="copyright-footer__select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label="Choose a language"
            >
              {LANGUAGES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {/* Dollar icon + currency select */}
          <label className="copyright-footer__select-wrap">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
              <path d="M8.75 1.5a.75.75 0 0 0-1.5 0v.87c-1.9.3-3.25 1.53-3.25 3.13 0 1.9 1.7 2.67 3.25 3.1v3.3c-.9-.25-1.5-.86-1.63-1.6a.75.75 0 0 0-1.48.24c.24 1.44 1.5 2.5 3.11 2.79v.92a.75.75 0 0 0 1.5 0v-.9c1.93-.28 3.29-1.5 3.29-3.15 0-1.92-1.72-2.68-3.29-3.12V3.72c.82.25 1.38.8 1.53 1.47a.75.75 0 0 0 1.46-.33c-.27-1.32-1.44-2.26-2.99-2.53V1.5zm-1.5 5.65c-1.13-.36-1.75-.82-1.75-1.5 0-.72.65-1.31 1.75-1.55v3.05zm1.5 1.6c1.16.37 1.79.85 1.79 1.55 0 .74-.68 1.34-1.79 1.57V8.75z" />
            </svg>
            <select
              className="copyright-footer__select"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              aria-label="Choose a currency"
            >
              {CURRENCIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {/* Social icons — clickable, a real hover state, but go nowhere */}
          <nav className="copyright-footer__social" aria-label="Social media">
            <button type="button" aria-label="Facebook" className="copyright-footer__social-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
              </svg>
            </button>
            <button type="button" aria-label="Twitter" className="copyright-footer__social-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M22 5.9c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.6c.8-.6 1.5-1.3 2-2z" />
              </svg>
            </button>
            <button type="button" aria-label="Instagram" className="copyright-footer__social-link">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm8.4-11.2a1.5 1.5 0 1 1-3.1 0 1.5 1.5 0 0 1 3.1 0z" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
