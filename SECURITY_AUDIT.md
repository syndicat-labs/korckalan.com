# Security Audit — KorckAlan Website

**Date:** May 21, 2026  
**Site:** https://anyway-daytime-comply.ngrok-free.dev  
**Status:** Generally Secure (Static HTML)

---

## ✅ Secure Aspects

- **Static HTML** — No server-side code execution risks
- **HTTPS via ngrok** — Traffic encrypted in transit
- **No database** — No injection vulnerabilities (SQL, etc.)
- **Input validation** — Form has `required` fields
- **No secrets exposed** — No API keys or passwords in frontend code
- **Contact info public** — Expected and necessary for business site

---

## ⚠️ Security Concerns

### 1. Form Submission (CRITICAL BEFORE PRODUCTION)
- **Issue:** Placeholder Formspree endpoint (`xyzpqwer`) not connected to real service
- **Risk:** Form submissions not being sent; users think they've contacted you but you never receive messages
- **Fix Required:** Complete EmailJS setup (Service ID, Template ID, Public Key)
- **Action:** Get credentials from emailjs.com and integrate into form code

### 2. Form Spam/Bot Abuse (HIGH PRIORITY)
- **Issue:** No CAPTCHA or rate limiting on form submissions
- **Risk:** Bot spam, malicious form flooding once live
- **Fix:** Add reCAPTCHA v3 (invisible, no user friction)
- **Timeline:** Add before going to production

### 3. ngrok Tunnel (TEMPORARY DEPLOYMENT)
- **Issue:** Public URL changes on every restart
- **Risk:** Not suitable for permanent production use
- **Note:** This is expected for testing only
- **Fix:** Migrate to permanent hosting (Netlify, Vercel, AWS, etc.) before going live

### 4. Missing HTTP Security Headers
- **Issue:** No Content Security Policy (CSP), X-Frame-Options, X-Content-Type-Options
- **Risk:** Low impact for static site, but good practice
- **Fix:** Configure on final hosting platform (automatic on most modern hosts)

### 5. No Rate Limiting
- **Issue:** Form can be submitted unlimited times from same IP
- **Risk:** Resource abuse, spam
- **Fix:** Implement on backend when form service is configured (EmailJS has built-in abuse prevention)

---

## 📋 Action Items (Priority Order)

1. **[CRITICAL]** Set up EmailJS account and get credentials
2. **[CRITICAL]** Configure real email service for form submissions
3. **[HIGH]** Add CAPTCHA (reCAPTCHA) to quote request form
4. **[MEDIUM]** Migrate from ngrok to permanent hosting (Netlify/Vercel)
5. **[LOW]** Configure CSP headers on production server

---

## Recommendations for Production

- [ ] Domain name (instead of ngrok URL)
- [ ] SSL certificate (included with modern hosts)
- [ ] Monitoring/analytics (Google Analytics)
- [ ] Backup email notifications for quote requests
- [ ] Contact form anti-spam measures
- [ ] Regular security updates for dependencies

---

## Current Vulnerabilities Summary

| Severity | Issue | Status |
|----------|-------|--------|
| 🔴 Critical | Form not sending emails | Pending EmailJS setup |
| 🟠 High | No bot protection | Pending CAPTCHA |
| 🟡 Medium | Temporary ngrok URL | Expected for testing |
| 🟢 Low | Missing headers | Will fix on production host |

