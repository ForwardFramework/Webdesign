/**
 * Netlify runs this automatically after every verified form submission.
 *
 * Its job: email the person who just filled in a lead form a link to the
 * discovery questionnaire, prefilled with what they already told us, so they
 * are never asked the same question twice.
 *
 * Requires one environment variable, set in Netlify under
 * Project configuration -> Environment variables:
 *
 *   RESEND_API_KEY   an API key from resend.com, on a verified sending domain
 *   MAIL_FROM        optional, defaults to hello@forward-framework.com
 *   SITE_URL         optional, defaults to the production domain
 *
 * Without the key it logs and returns 200. A missing key must never fail a
 * submission — the enquiry is already stored, and bouncing it here would show
 * the visitor an error for something that has nothing to do with them.
 */

const SITE = process.env.SITE_URL || 'https://www.forward-framework.com';
const FROM = process.env.MAIL_FROM || 'Forward Framework <hello@forward-framework.com>';
const REPLY_TO = 'hello@forward-framework.com';
const PHONE = '(412) 463-2126';
const TEL = '+14124632126';

/* The questionnaire that matches what they said they wanted. Keys mirror the
   primary_need radio on the homepage form; request_type carries the service
   name on the interior forms. */
const NEED_SLUGS = {
  'A website that converts': 'web-design',
  'More qualified leads': 'marketing',
  'AI + automation': 'automation',
  'Better ad performance': 'ad-management',
};

const FORM_SLUGS = {
  concept: 'web-design',
  'ai-audit': 'ai-consulting',
  blueprint: 'automation',
  visibility: 'marketing',
  audit: 'ad-management',
  'content-plan': 'social-media-marketing',
  'risk-map': 'business-systems',
};

const DELIVERABLE = {
  'web-design': 'a free homepage concept',
  'ai-consulting': 'a free AI Opportunity Audit',
  automation: 'a free automation blueprint',
  marketing: 'a free AI Search Visibility Report',
  'ad-management': 'a free ad account audit',
  'social-media-marketing': 'a free 30-day content plan',
  'business-systems': 'a free Key-Person Risk Map',
};

const TITLE = {
  'web-design': 'Web Design & Development',
  'ai-consulting': 'AI Consulting',
  automation: 'Automation',
  marketing: 'Marketing, SEO & AI Search',
  'ad-management': 'Ad Management',
  'social-media-marketing': 'Social Media Marketing',
  'business-systems': 'Scaffold — Business Systems',
};

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function firstName(full) {
  const n = String(full || '').trim().split(/\s+/)[0];
  return n && n.length < 24 ? n : '';
}

function slugFor(formName, data) {
  if (FORM_SLUGS[formName]) return FORM_SLUGS[formName];
  const need = data.primary_need;
  if (need && NEED_SLUGS[need]) return NEED_SLUGS[need];
  return '';
}

/* Carry across only what they typed themselves, and only the fields the
   questionnaire actually has. Everything else they will fill in there. */
function prefillUrl(slug, data) {
  const base = slug ? `${SITE}/discovery/${slug}` : `${SITE}/discovery/`;
  const carry = ['name', 'email', 'company', 'website', 'phone', 'timeline', 'revenue_band'];
  const params = new URLSearchParams();
  carry.forEach(function (k) {
    if (data[k]) params.set(k, data[k]);
  });
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

function emailHtml(opts) {
  const hi = opts.name ? `Hi ${esc(opts.name)},` : 'Hi,';
  const what = opts.slug
    ? `the ${esc(TITLE[opts.slug])} questionnaire`
    : 'the discovery questionnaire';
  const gets = opts.slug
    ? `It ends with ${esc(DELIVERABLE[opts.slug])} — free, yours to keep.`
    : 'It covers all seven services and tells us which is worth doing first.';

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#EFEBE6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFEBE6;padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid rgba(23,21,18,.14);">
    <tr><td style="padding:28px 32px 0;">
      <div style="font:500 13px/1.2 'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:.26em;color:#171512;">FORWARD</div>
      <div style="font:400 8px/1.4 'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:.34em;color:#6B5E52;">FRAMEWORK</div>
    </td></tr>
    <tr><td style="padding:26px 32px 0;">
      <p style="margin:0 0 16px;font:400 16px/1.6 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#171512;">${hi}</p>
      <p style="margin:0 0 16px;font:400 16px/1.6 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#171512;">
        Thanks — we have your request and a strategist is already looking at it. Your written plan lands within two business days.</p>
      <p style="margin:0 0 16px;font:400 16px/1.6 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#171512;">
        In the meantime, here is ${what}. It takes about ten minutes, and the more of it you answer the sharper the plan we send back — because we stop guessing at the parts you did not tell us. ${gets}</p>
      <p style="margin:0 0 24px;font:400 15px/1.6 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#6B5E52;">
        We have already filled in what you gave us, so you will not be asked any of it twice. Skip anything you do not know — a blank tells us something too.</p>
    </td></tr>
    <tr><td style="padding:0 32px 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="background:#171512;">
          <a href="${esc(opts.url)}" style="display:inline-block;padding:15px 28px;font:500 14px/1 'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#EFEBE6;text-decoration:none;">Open my questionnaire &rarr;</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:20px 32px 28px;">
      <p style="margin:0 0 6px;font:400 13px/1.6 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#6B5E52;">
        Or paste this into your browser:<br>
        <a href="${esc(opts.url)}" style="color:#6B5E52;word-break:break-all;">${esc(opts.url)}</a></p>
    </td></tr>
    <tr><td style="border-top:1px solid rgba(23,21,18,.14);padding:20px 32px 26px;">
      <p style="margin:0 0 6px;font:400 14px/1.6 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#171512;">
        Would rather talk it through? Call <a href="tel:${TEL}" style="color:#171512;">${PHONE}</a> and we will work through it together — a senior strategist answers, not a scheduler.</p>
      <p style="margin:14px 0 0;font:400 12px/1.6 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#8C8880;">
        Forward Framework &middot; ${REPLY_TO} &middot; ${PHONE}<br>
        You are getting this because you asked us for something on our website. Reply to this email and a person reads it.</p>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

function emailText(opts) {
  return [
    opts.name ? `Hi ${opts.name},` : 'Hi,',
    '',
    'Thanks — we have your request and a strategist is already looking at it.',
    'Your written plan lands within two business days.',
    '',
    'In the meantime, here is your questionnaire. About ten minutes, and the',
    'more of it you answer the sharper the plan we send back. We have already',
    'filled in what you gave us, so nothing gets asked twice.',
    '',
    opts.url,
    '',
    `Would rather talk it through? Call ${PHONE} and we will do it together.`,
    '',
    `Forward Framework · ${REPLY_TO} · ${PHONE}`,
  ].join('\n');
}

exports.handler = async function (event) {
  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch (err) {
    console.error('submission-created: unreadable payload', err);
    return { statusCode: 200, body: 'ignored' };
  }

  const formName = payload.form_name || '';
  const data = payload.data || {};

  // Never send the questionnaire to someone who just completed one.
  if (formName === 'discovery' || formName.indexOf('d-') === 0) {
    return { statusCode: 200, body: 'skipped: questionnaire submission' };
  }

  const to = (data.email || '').trim();
  if (!to || to.indexOf('@') < 1) {
    console.log('submission-created: no usable email on', formName);
    return { statusCode: 200, body: 'skipped: no email' };
  }

  const slug = slugFor(formName, data);
  const opts = {
    name: firstName(data.name),
    slug: slug,
    url: prefillUrl(slug, data),
  };

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log('submission-created: RESEND_API_KEY not set — would have sent',
      opts.url, 'to', to);
    return { statusCode: 200, body: 'skipped: no api key' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        reply_to: REPLY_TO,
        subject: slug
          ? `Your ${TITLE[slug]} questionnaire — 10 minutes, and we stop guessing`
          : 'Your discovery questionnaire — 20 minutes, and we stop guessing',
        html: emailHtml(opts),
        text: emailText(opts),
      }),
    });
    if (!res.ok) {
      console.error('submission-created: send failed', res.status, await res.text());
    } else {
      console.log('submission-created: sent questionnaire to', to, 'for', formName);
    }
  } catch (err) {
    console.error('submission-created: send threw', err);
  }

  // Always 200. The submission is already safely stored either way.
  return { statusCode: 200, body: 'ok' };
};

// Exported for the local test harness.
exports._internals = { prefillUrl, slugFor, emailHtml, emailText, firstName };
