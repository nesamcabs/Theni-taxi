import { SUPPORT_PHONE, SUPPORT_WHATSAPP } from '@core/config/constants';

export const telHref = (): string => `tel:${SUPPORT_PHONE}`;

export const whatsappHref = (message?: string): string =>
  `https://wa.me/${SUPPORT_WHATSAPP}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const defaultWhatsappMessage = (context?: string): string =>
  `Hi Theni Taxi, I'd like to book a cab${context ? ` — ${context}` : ''}.`;
