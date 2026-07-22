// Native fetch is used (Node 18+)

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Since it's an API, or specify origin
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, lead } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing reCAPTCHA token' });
  }
  if (!lead || !lead.name || !lead.phone) {
    return res.status(400).json({ error: 'Missing required lead data' });
  }

  // Strict Server-Side Validation
  const phoneVal = lead.phone.replace(/[\s()-]/g, '');
  if (!/^[6-9]\d{9}$/.test(phoneVal)) {
    return res.status(400).json({ error: 'Invalid phone number format. Exactly 10 digits required.' });
  }
  if (/^(\d)\1{9}$/.test(phoneVal) || '01234567890'.includes(phoneVal) || '09876543210'.includes(phoneVal)) {
    return res.status(400).json({ error: 'Invalid phone number detected.' });
  }

  if (lead.email) {
    const emailVal = lead.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    const blockedDomains = ['test.com', 'example.com', 'abc.com', '123.com', 'mailinator.com', 'yopmail.com', 'tempmail.com', 'guerrillamail.com'];
    if (blockedDomains.includes(emailVal.split('@')[1])) {
      return res.status(400).json({ error: 'Disposable or test email addresses are not allowed.' });
    }
  }

  try {
    // 1. Verify reCAPTCHA (Log warning on failure, but never block valid lead submissions)
    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      if (secretKey && token && token !== 'fallback-token') {
        const verifyParams = new URLSearchParams({
          secret: secretKey,
          response: token
        });

        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: verifyParams.toString()
        });

        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
          console.warn('reCAPTCHA Verification Notice:', recaptchaData['error-codes']);
        }
      }
    } catch (recaptchaErr) {
      console.warn('reCAPTCHA verification skipped:', recaptchaErr);
    }

    // 2. Submit to downstream providers
    // Note: We use process.env to hold the URLs/keys for maximum security on the backend.
    const API_URL = process.env.API_URL || 'https://hypheningmedia.com/api/portal/7113e45f-468e-40e7-841c-939a5fa04f5a/leads/capture';
    const SHEETS_URL = process.env.SHEETS_URL || 'https://script.google.com/macros/s/AKfycbwCbVNBhfSU3T5WlzRCkaD_3q5HgLqpiHqGp7H3M7g8evd5Hi0v83TEfw4NYYF12mYE7Q/exec';
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rqevbabhqlnjktnggclo.supabase.co/rest/v1/janya_google_leads';
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    // Build payloads
    const apiPayload = {
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      platform: lead.platform,
      source: lead.source,
      campaign_name: lead.utm_campaign || undefined,
      additional_data: {
        treatment_needed: lead.treatment,
        preferred_call_time: lead.preferred_call_time,
        device: lead.device,
        browser: lead.browser,
        language: lead.language,
        timezone: lead.timezone,
        screen_resolution: lead.screen_resolution,
        utm_source: lead.utm_source,
        utm_medium: lead.utm_medium,
        utm_term: lead.utm_term,
        utm_content: lead.utm_content,
        gclid: lead.gclid,
        fbclid: lead.fbclid,
        referrer: lead.referrer,
        landing_page: lead.landing_page
      }
    };

    const sheetsPayload = {
      fullName: lead.name || '',
      phoneNumber: lead.phone || '',
      email: lead.email || '',
      treatment: lead.treatment || '',
      preferredCallTime: lead.preferred_call_time || ''
    };

    const promises = [];

    // Custom API Submit
    promises.push(
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiPayload)
      }).then(async r => {
        const text = await r.text();
        try { return JSON.parse(text); } catch (e) { return text; }
      }).catch(err => console.error('API Error:', err))
    );

    // Google Sheets Submit
    promises.push(
      fetch(SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(sheetsPayload).toString()
      }).then(async r => {
        const text = await r.text();
        try { return JSON.parse(text); } catch (e) { return text; }
      }).catch(err => console.error('Sheets Error:', err))
    );

    // Supabase Submit
    if (SUPABASE_ANON_KEY) {
      promises.push(
        fetch(SUPABASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(lead)
        }).catch(err => console.error('Supabase Error:', err))
      );
    }

    await Promise.allSettled(promises);

    return res.status(200).json({ success: true, message: 'Lead captured successfully' });

  } catch (error) {
    console.error('Backend Submission Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
