/**
 * Referral Tracking Middleware
 * Tracks referral codes from URL parameters and cookies
 */

const REFERRAL_COOKIE_NAME = 'ai_ref';
const REFERRAL_COOKIE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Capture referral code from query parameter and store in cookie
 */
function captureReferral(req, res, next) {
  const referralCode = req.query.ref;

  if (referralCode) {
    // Set referral cookie for 30 days
    res.cookie(REFERRAL_COOKIE_NAME, referralCode, {
      maxAge: REFERRAL_COOKIE_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log(`📎 Referral code captured: ${referralCode}`);
  }

  next();
}

/**
 * Get referral code from cookie
 */
function getReferralCode(req) {
  return req.cookies?.[REFERRAL_COOKIE_NAME] || null;
}

/**
 * Clear referral cookie after conversion
 */
function clearReferralCookie(res) {
  res.clearCookie(REFERRAL_COOKIE_NAME);
}

module.exports = {
  captureReferral,
  getReferralCode,
  clearReferralCookie,
  REFERRAL_COOKIE_NAME
};

