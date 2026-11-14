// Phone OTP sign-in — the same Firebase Auth project as the NESAM apps. A booking
// needs a signed-in uid (createBooking is authenticated), so this gate runs once,
// right before a rider confirms their first trip.
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { auth } from '@core/config/firebase';

let verifier: RecaptchaVerifier | null = null;

function getVerifier(): RecaptchaVerifier {
  if (verifier) return verifier;
  verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
  return verifier;
}

export class AuthFlowError extends Error {}

const DIGITS_ONLY = (v: string) => v.replace(/\D/g, '');

export function isValidTenDigitMobile(v: string): boolean {
  const d = DIGITS_ONLY(v);
  return d.length === 10 && /^[6-9]/.test(d);
}

/** Sends an OTP to a 10-digit Indian mobile number. Throws a friendly message on failure. */
export async function sendOtp(tenDigitNumber: string): Promise<ConfirmationResult> {
  const digits = DIGITS_ONLY(tenDigitNumber);
  if (!isValidTenDigitMobile(digits)) throw new AuthFlowError('Enter a valid 10-digit mobile number.');
  try {
    return await signInWithPhoneNumber(auth, `+91${digits}`, getVerifier());
  } catch (err) {
    verifier?.clear();
    verifier = null;
    const code = (err as { code?: string })?.code || '';
    if (code.includes('too-many-requests')) throw new AuthFlowError('Too many attempts. Please try again in a while.');
    if (code.includes('invalid-phone-number')) throw new AuthFlowError('That mobile number looks invalid.');
    throw new AuthFlowError('Could not send the OTP. Check your connection and try again.');
  }
}

export async function confirmOtp(confirmation: ConfirmationResult, code: string): Promise<void> {
  const digits = DIGITS_ONLY(code);
  if (digits.length !== 6) throw new AuthFlowError('Enter the 6-digit OTP.');
  try {
    await confirmation.confirm(digits);
  } catch (err) {
    const c = (err as { code?: string })?.code || '';
    if (c.includes('invalid-verification-code')) throw new AuthFlowError('That OTP is incorrect.');
    if (c.includes('code-expired')) throw new AuthFlowError('That OTP has expired. Resend and try again.');
    throw new AuthFlowError('Could not verify the OTP. Please try again.');
  }
}
