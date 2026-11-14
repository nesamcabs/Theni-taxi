// Support types and logic for the AI chat's callback-lead form, shared by every brand's AiChatWidget.

export type ChatLang = 'en' | 'ta';

/** Signed-in profile hints used to pre-fill a callback lead. */
export interface AiLeadCustomer {
  name?: string;
  phone?: string;
  email?: string;
}

/** The active trip draft shown to the AI and recorded on escalated leads. */
export interface AiLeadTripContext {
  pickup?: string;
  drop?: string;
  tripType?: string;
  scheduledAt?: string;
  carType?: string;
  estimatedFare?: number;
}

export interface AiLeadFormDraft {
  name: string;
  phone: string;
  notes: string;
}

export type AiLeadField = keyof AiLeadFormDraft;

export type AiLeadErrors = Partial<Record<AiLeadField, string>>;

const PHONE_RE = /^[+0-9\s()-]{10,18}$/;
const PHONE_DIGITS_RE = /\d/g;

const MESSAGES: Record<ChatLang, Record<'nameRequired' | 'nameShort' | 'phoneRequired' | 'phoneInvalid' | 'notesRequired' | 'notesShort', string>> = {
  en: {
    nameRequired: 'Please enter your name.',
    nameShort: 'Name must be at least 2 characters.',
    phoneRequired: 'Please enter your mobile number.',
    phoneInvalid: 'Enter a valid mobile number.',
    notesRequired: 'Please tell us how we can help.',
    notesShort: 'Please add a few more details.',
  },
  ta: {
    nameRequired: 'உங்கள் பெயரை உள்ளிடவும்.',
    nameShort: 'பெயர் குறைந்தது 2 எழுத்துகள் இருக்க வேண்டும்.',
    phoneRequired: 'உங்கள் மொபைல் எண்ணை உள்ளிடவும்.',
    phoneInvalid: 'சரியான மொபைல் எண்ணை உள்ளிடவும்.',
    notesRequired: 'நாங்கள் எப்படி உதவலாம் என்று கூறவும்.',
    notesShort: 'மேலும் சில விவரங்களைச் சேர்க்கவும்.',
  },
};

export function validateAiLeadField(field: AiLeadField, value: string, lang: ChatLang): string | undefined {
  const msg = MESSAGES[lang];
  const trimmed = value.trim();
  if (field === 'name') {
    if (!trimmed) return msg.nameRequired;
    if (trimmed.length < 2) return msg.nameShort;
    return undefined;
  }
  if (field === 'phone') {
    if (!trimmed) return msg.phoneRequired;
    const digitCount = (trimmed.match(PHONE_DIGITS_RE) ?? []).length;
    if (!PHONE_RE.test(trimmed) || digitCount < 10) return msg.phoneInvalid;
    return undefined;
  }
  if (!trimmed) return msg.notesRequired;
  if (trimmed.length < 4) return msg.notesShort;
  return undefined;
}

export function validateAiLeadForm(draft: AiLeadFormDraft, lang: ChatLang): AiLeadErrors {
  const errors: AiLeadErrors = {};
  (Object.keys(draft) as AiLeadField[]).forEach((field) => {
    const error = validateAiLeadField(field, draft[field], lang);
    if (error) errors[field] = error;
  });
  return errors;
}

/** Drops empty fields and returns undefined when there is nothing worth sending. */
export function compactTripContext(context?: AiLeadTripContext): AiLeadTripContext | undefined {
  if (!context) return undefined;
  const out: AiLeadTripContext = {};
  if (context.pickup?.trim()) out.pickup = context.pickup.trim();
  if (context.drop?.trim()) out.drop = context.drop.trim();
  if (context.tripType?.trim()) out.tripType = context.tripType.trim();
  if (context.scheduledAt?.trim()) out.scheduledAt = context.scheduledAt.trim();
  if (context.carType?.trim()) out.carType = context.carType.trim();
  if (typeof context.estimatedFare === 'number' && Number.isFinite(context.estimatedFare)) out.estimatedFare = context.estimatedFare;
  return Object.keys(out).length ? out : undefined;
}

const CONFUSED_PHRASES = [
  "i'm not sure",
  'i am not sure',
  "i don't understand",
  'i do not understand',
  "i couldn't understand",
  "i'm not able to help",
  'i am not able to help',
  'i cannot help with that',
  "i can't help with that",
];

/** Catches cases the server didn't flag but where the reply itself reads as a non-answer. */
export function detectClientConfusion(input: {
  serverConfused?: boolean;
  confusionReason?: string;
  replyText: string;
  userQuery: string;
}): { confused: boolean; reason?: string } {
  if (input.serverConfused) return { confused: true, reason: input.confusionReason || 'server_flagged' };
  const lower = input.replyText.toLowerCase();
  if (CONFUSED_PHRASES.some((phrase) => lower.includes(phrase))) {
    return { confused: true, reason: 'client_detected' };
  }
  return { confused: false };
}

export function buildAiLeadSubmission(input: {
  brandId: string;
  draft: AiLeadFormDraft;
  email?: string;
  lang: ChatLang;
  aiQuestion: string;
  aiReply: string;
  reason: string;
  tripContext?: AiLeadTripContext;
  pagePath?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  website: string;
}) {
  const tripContext = compactTripContext(input.tripContext);
  return {
    source: 'ai_chat' as const,
    brand: input.brandId,
    language: input.lang,
    name: input.draft.name.trim(),
    phone: input.draft.phone.trim(),
    notes: input.draft.notes.trim(),
    ...(input.email?.trim() ? { email: input.email.trim() } : {}),
    reason: input.reason,
    aiQuestion: input.aiQuestion.trim(),
    aiReply: input.aiReply,
    ...(input.pagePath ? { pagePath: input.pagePath } : {}),
    ...(tripContext ? { tripContext } : {}),
    conversation: input.messages,
    // Honeypot: left blank by real users, filled in by bots. The server rejects a non-empty value.
    website: input.website,
  };
}
