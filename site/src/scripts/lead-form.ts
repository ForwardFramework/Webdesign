/**
 * Client-side behaviour for every lead form on the site.
 *
 * Design notes:
 *  - The form works with JavaScript disabled: the markup is a real POST to
 *    whichever endpoint `src/data/forms.ts` selects. This script only upgrades
 *    that to an inline async submit so the homeowner never loses their place.
 *  - Validation is inline and on blur, never a summary at the top of the page,
 *    and error text sits next to the field it belongs to.
 *  - One aria-live region per form announces both errors and success.
 */

type FieldRule = {
  test: (value: string, form: HTMLFormElement) => boolean;
  message: string;
};

const rules: Record<string, FieldRule> = {
  name: {
    test: (v) => v.trim().length >= 2,
    message: 'Please enter your name.',
  },
  phone: {
    // 10 digits, ignoring formatting. Allows a leading US country code.
    test: (v) => {
      const digits = v.replace(/\D/g, '');
      return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
    },
    message: 'Please enter a 10-digit phone number.',
  },
  email: {
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    message: 'Please enter a valid email address.',
  },
  zip: {
    test: (v) => /^\d{5}$/.test(v.trim()),
    message: 'Please enter a 5-digit ZIP code.',
  },
  service: {
    test: (v) => v.trim().length > 0,
    message: 'Please choose a service.',
  },
  address: {
    test: (v) => v.trim().length >= 6,
    message: 'Please enter your street address.',
  },
};

function fieldError(form: HTMLFormElement, name: string): HTMLElement | null {
  return form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
}

function showError(form: HTMLFormElement, name: string, message: string) {
  const input = form.elements.namedItem(name) as HTMLInputElement | null;
  const box = fieldError(form, name);
  if (input) input.setAttribute('aria-invalid', 'true');
  if (box) {
    box.textContent = message;
    box.hidden = false;
  }
}

function clearError(form: HTMLFormElement, name: string) {
  const input = form.elements.namedItem(name) as HTMLInputElement | null;
  const box = fieldError(form, name);
  if (input) input.removeAttribute('aria-invalid');
  if (box) {
    box.textContent = '';
    box.hidden = true;
  }
}

function validate(form: HTMLFormElement): string[] {
  const invalid: string[] = [];
  for (const [name, rule] of Object.entries(rules)) {
    const input = form.elements.namedItem(name) as HTMLInputElement | null;
    // Only validate fields this particular form actually renders.
    if (!input || input.type === 'hidden' || !input.required) continue;
    if (rule.test(input.value, form)) {
      clearError(form, name);
    } else {
      showError(form, name, rule.message);
      invalid.push(name);
    }
  }
  return invalid;
}

function setStatus(form: HTMLFormElement, tone: 'success' | 'error', title: string, body: string) {
  const status = form.querySelector<HTMLElement>('[data-status]');
  if (!status) return;
  status.dataset.tone = tone;
  status.innerHTML = '';
  const strong = document.createElement('strong');
  strong.textContent = title;
  const p = document.createElement('span');
  p.textContent = body;
  status.append(strong, p);
  status.hidden = false;
}

/** Formats a US phone number as the homeowner types it. */
function attachPhoneMask(input: HTMLInputElement) {
  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) {
      input.value = '';
    } else if (digits.length < 4) {
      input.value = `(${digits}`;
    } else if (digits.length < 7) {
      input.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      input.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  });
}

export function initLeadForm() {
  const forms = document.querySelectorAll<HTMLFormElement>('[data-lead-form]');

  forms.forEach((form) => {
    if (form.dataset.leadFormReady === 'true') return;
    form.dataset.leadFormReady = 'true';

    // Stamp render time for the time-to-submit spam trap.
    const stamp = form.querySelector<HTMLInputElement>('[data-rendered-at]');
    if (stamp) stamp.value = String(Date.now());

    const phone = form.elements.namedItem('phone') as HTMLInputElement | null;
    if (phone) attachPhoneMask(phone);

    // Validate on blur, and clear the error as soon as they start fixing it.
    Object.keys(rules).forEach((name) => {
      const input = form.elements.namedItem(name) as HTMLInputElement | null;
      if (!input || input.type === 'hidden') return;
      input.addEventListener('blur', () => {
        if (!input.required) return;
        if (rules[name].test(input.value, form)) clearError(form, name);
        else if (input.value.trim() !== '') showError(form, name, rules[name].message);
      });
      input.addEventListener('input', () => clearError(form, name));
    });

    form.addEventListener('submit', async (event) => {
      const invalid = validate(form);
      if (invalid.length > 0) {
        event.preventDefault();
        const first = form.elements.namedItem(invalid[0]) as HTMLElement | null;
        first?.focus();
        setStatus(
          form,
          'error',
          'Almost there.',
          `Please check the highlighted ${invalid.length === 1 ? 'field' : 'fields'} and try again.`
        );
        return;
      }

      event.preventDefault();

      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const label = form.querySelector<HTMLElement>('[data-submit-label]');
      const spinner = form.querySelector<HTMLElement>('[data-spinner]');
      const originalLabel = label?.textContent ?? '';

      if (button) button.disabled = true;
      if (label) label.textContent = 'Sending…';
      if (spinner) spinner.hidden = false;

      try {
        /* Netlify Forms matches on the `form-name` field and only parses
           url-encoded bodies — a multipart FormData post is accepted and then
           silently dropped, which is worse than an error. The custom function
           reads either. Sending url-encoded satisfies both. */
        const body = new URLSearchParams(
          [...new FormData(form)].map(([k, v]) => [k, String(v)])
        ).toString();

        const response = await fetch(form.action, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        });

        if (!response.ok) throw new Error(`Request failed with ${response.status}`);

        form.reset();
        if (stamp) stamp.value = String(Date.now());
        setStatus(
          form,
          'success',
          'Got it — thank you.',
          'Your request is on its way to our team. We reply within one business day, and usually a lot sooner. Need us today? Call (412) 438-8364.'
        );
        form.querySelector<HTMLElement>('[data-status]')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'center',
        });
        window.dispatchEvent(new CustomEvent('lead:submitted', { detail: { form: form.id } }));
      } catch {
        // Never strand the homeowner: give them the two channels that always work.
        setStatus(
          form,
          'error',
          'That didn’t go through.',
          'Something went wrong sending your request. Please call (412) 438-8364 or email info@topdogexteriors.com and we’ll take care of you right away.'
        );
      } finally {
        if (button) button.disabled = false;
        if (label) label.textContent = originalLabel;
        if (spinner) spinner.hidden = true;
      }
    });
  });
}
