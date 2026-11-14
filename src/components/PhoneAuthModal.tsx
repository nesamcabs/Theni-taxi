import { useEffect, useRef, useState, type FormEvent } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import type { ConfirmationResult } from 'firebase/auth';
import { auth, db } from '@core/config/firebase';
import { CUSTOMERS_COLLECTION, mapProfile } from '@core/services/userService';
import { useAuth, completeSignup } from './AuthProvider';
import { sendOtp, confirmOtp, isValidTenDigitMobile, AuthFlowError } from '@/lib/authService';
import { isValidEmail, isValidName } from '@core/utils/format';

type Step = 'phone' | 'otp' | 'profile' | 'checking';

export function PhoneAuthModal() {
  const { modalOpen, closeModal, resolveModal, user } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!modalOpen) return;
    setError('');
    setBusy(false);
    setStep(user ? 'profile' : 'phone');
  }, [modalOpen, user]);

  if (!modalOpen) return null;

  async function handlePhoneSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      confirmationRef.current = await sendOtp(phone);
      setStep('otp');
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err instanceof AuthFlowError ? err.message : 'Could not send the OTP. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleOtpSubmit(e: FormEvent) {
    e.preventDefault();
    if (!confirmationRef.current) return;
    setError('');
    setBusy(true);
    try {
      await confirmOtp(confirmationRef.current, otp.join(''));
      setStep('checking');
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('missing-uid');
      const snap = await getDoc(doc(db, CUSTOMERS_COLLECTION, uid));
      if (snap.exists()) {
        resolveModal(mapProfile(uid, snap.data()));
      } else {
        setStep('profile');
      }
    } catch (err) {
      setStep('otp');
      setError(err instanceof AuthFlowError ? err.message : 'Could not verify that OTP. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!isValidName(name)) return setError('Enter your name.');
    if (email && !isValidEmail(email)) return setError('Enter a valid email, or leave it blank.');
    setBusy(true);
    try {
      await completeSignup(name, email);
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('missing-uid');
      const snap = await getDoc(doc(db, CUSTOMERS_COLLECTION, uid));
      if (snap.exists()) resolveModal(mapProfile(uid, snap.data()));
    } catch {
      setError('Could not save your details. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function handleOtpDigit(i: number, v: string) {
    const d = v.replace(/\D/g, '').slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < 5) otpRefs.current[i + 1]?.focus();
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal-card">
        <button type="button" className="modal-close" aria-label="Close" onClick={closeModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit}>
            <h2>Verify your mobile number</h2>
            <p>We&rsquo;ll text a one-time code to confirm it&rsquo;s you before your trip is booked.</p>
            <div className="field">
              <label htmlFor="auth-phone">Mobile number</label>
              <div className="phone-field">
                <span className="phone-field__prefix">+91</span>
                <input
                  id="auth-phone"
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>
            {error ? <p className="alert alert--error" style={{ marginTop: 12 }}>{error}</p> : null}
            <button type="submit" className="btn btn--primary btn--block" style={{ marginTop: 16 }} disabled={busy || !isValidTenDigitMobile(phone)}>
              {busy ? <span className="spinner" /> : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <h2>Enter the OTP</h2>
            <p>Sent by SMS to +91 {phone.replace(/\D/g, '')}.</p>
            <div className="otp-boxes">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  autoFocus={i === 0}
                  onChange={(e) => handleOtpDigit(i, e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Backspace' && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                />
              ))}
            </div>
            {error ? <p className="alert alert--error">{error}</p> : null}
            <button type="submit" className="btn btn--primary btn--block" disabled={busy || otp.some((d) => !d)}>
              {busy ? <span className="spinner" /> : 'Verify & continue'}
            </button>
            <p className="resend-row">
              Wrong number? <button type="button" onClick={() => setStep('phone')}>Change it</button>
            </p>
          </form>
        )}

        {step === 'checking' && (
          <div style={{ display: 'grid', justifyItems: 'center', gap: 12, padding: '24px 0' }}>
            <span className="spinner spinner--brand" />
            <p>Checking your account…</p>
          </div>
        )}

        {step === 'profile' && (
          <form onSubmit={handleProfileSubmit}>
            <h2>Just your name</h2>
            <p>One last step before your trip is booked.</p>
            <div className="field" style={{ marginBottom: 12 }}>
              <label htmlFor="auth-name">Full name</label>
              <input id="auth-name" type="text" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="auth-email">Email (optional)</label>
              <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            {error ? <p className="alert alert--error" style={{ marginTop: 12 }}>{error}</p> : null}
            <button type="submit" className="btn btn--primary btn--block" style={{ marginTop: 16 }} disabled={busy}>
              {busy ? <span className="spinner" /> : 'Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
