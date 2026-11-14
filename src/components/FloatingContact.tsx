import { useState } from 'react';
import { SUPPORT_PHONE_DISPLAY } from '@core/config/constants';
import { telHref, whatsappHref, defaultWhatsappMessage } from '@/lib/contact';

export function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="floating-contact">
      {open ? (
        <div className="floating-contact__panel" role="menu">
          <a href={whatsappHref(defaultWhatsappMessage())} target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#2f7d4f" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-1.2-.6-2-1.1-2.8-2.4-.1-.2-.1-.4.1-.5l.6-.7c.1-.2.1-.4 0-.5l-.6-1.4c-.2-.4-.3-.3-.5-.3h-.5c-.2 0-.5.1-.6.3-.2.3-.8 1-.8 2.3s.9 2.7 1 2.9c.1.2 1.5 2.4 3.8 3.3 1.9.7 2.3.6 2.7.5.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3z" />
            </svg>
            WhatsApp
          </a>
          <a href={telHref()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.7 3.6.8.6 0 1 .5 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.2c.5 0 1 .4 1 1 .1 1.3.4 2.5.8 3.6.1.4 0 .8-.2 1L6.6 10.8z" />
            </svg>
            {SUPPORT_PHONE_DISPLAY}
          </a>
        </div>
      ) : null}
      <button
        type="button"
        className={`floating-contact__fab ${open ? 'is-open' : ''}`}
        aria-label={open ? 'Close contact options' : 'Call or WhatsApp Theni Taxi'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.7 3.6.8.6 0 1 .5 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.2c.5 0 1 .4 1 1 .1 1.3.4 2.5.8 3.6.1.4 0 .8-.2 1L6.6 10.8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
