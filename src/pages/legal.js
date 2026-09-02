const { business: B } = require('../data/site.js');
const { esc, telHref, cityState } = require('../templates/layout.js');
const { page } = require('../templates/shell.js');

const privacy = () => page({
  path: '/privacy-policy/',
  title: `Privacy Policy | ${B.name}`,
  desc: `How ${B.name} collects, uses, and protects the information you send through this website. We never sell or share your details with lead-generation companies.`,
  crumbs: [{ label: 'Privacy Policy' }],
  head: `<h1>Privacy Policy</h1><p class="lede">Last updated <span data-year></span>.</p>`,
  body: `
<section class="section"><div class="wrap wrap-narrow prose">
<h2 style="margin-top:0">What we collect</h2>
<p>When you submit an estimate request on this site we collect the information you type into the form:
your name, phone number, email address, property ZIP code, the service you selected, and anything you
write in the message field. We also record which page the form was submitted from.</p>

<h2>Why we collect it</h2>
<p>Solely to respond to your request, schedule an inspection, prepare an estimate, and communicate with
you about work you have asked us to do. That is it.</p>

<h2>What we do not do</h2>
<ul>
  <li>We do not sell your information.</li>
  <li>We do not rent, trade, or share it with lead-generation companies or other contractors.</li>
  <li>We do not use it for automated marketing you did not ask for.</li>
</ul>
<p>We may share information with a service provider strictly where it is necessary to do the work &mdash;
for example, a material supplier delivering to your address, or your own insurance carrier when you have
asked us to assist with a claim.</p>

<h2>Text messages and calls</h2>
<p>If you give us your phone number, you are agreeing that we may call or text you about your request.
Message and data rates may apply. Reply STOP to any text and we will stop texting you.</p>

<h2>Cookies and analytics</h2>
<p>This site does not set advertising or tracking cookies of its own. Web fonts are loaded from Google
Fonts, which receives your IP address as part of serving those files. If analytics are added in future,
this policy will be updated to say so.</p>

<h2>Data retention</h2>
<p>We keep estimate requests and job records for as long as we need them for warranty, tax, and legal
purposes. You can ask us to delete your information at any time by emailing
<a href="mailto:${esc(B.email)}">${esc(B.email)}</a>, except where we are required to retain it.</p>

<h2>Your choices</h2>
<p>You can ask what we hold about you, ask us to correct it, or ask us to delete it. Email
<a href="mailto:${esc(B.email)}">${esc(B.email)}</a> or call <a href="${telHref}">${esc(B.phone)}</a>.</p>

<h2>Children</h2>
<p>This site is not directed to children and we do not knowingly collect information from anyone under 13.</p>

<h2>Contact</h2>
<p>${esc(B.name)}<br>${esc(cityState)}<br>
<a href="${telHref}">${esc(B.phone)}</a> &middot; <a href="mailto:${esc(B.email)}">${esc(B.email)}</a></p>
</div></section>`
});

const accessibility = () => page({
  path: '/accessibility/',
  title: `Accessibility Statement | ${B.name}`,
  desc: `${B.name} is committed to keeping this website usable for everyone, including visitors using screen readers, keyboard navigation, or magnification.`,
  crumbs: [{ label: 'Accessibility' }],
  head: `<h1>Accessibility</h1><p class="lede">This site should work for everyone. If it does not work for you, tell us and we will fix it.</p>`,
  body: `
<section class="section"><div class="wrap wrap-narrow prose">
<h2 style="margin-top:0">Our commitment</h2>
<p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. That is a moving
target on any site that keeps getting updated, so we treat it as ongoing work rather than a box to tick.</p>

<h2>What is built in</h2>
<ul>
  <li>Semantic HTML landmarks and a skip-to-content link on every page</li>
  <li>Full keyboard operability, including the menu, the photo lightbox, and every form</li>
  <li>Visible focus indicators that meet contrast requirements</li>
  <li>Text and interface colours tested against WCAG AA contrast ratios</li>
  <li>Descriptive alternative text on meaningful images</li>
  <li>Form labels tied to their inputs, with errors announced to assistive technology</li>
  <li>Respect for the operating system's reduced-motion preference</li>
  <li>Layouts that reflow to 320px and support 200% zoom without loss of content</li>
</ul>

<h2>Known limitations</h2>
<p>Content embedded from third parties &mdash; such as links out to Facebook &mdash; is outside our control
and may not meet the same standard.</p>

<h2>Tell us about a problem</h2>
<p>If any part of this site is difficult to use, email
<a href="mailto:${esc(B.email)}">${esc(B.email)}</a> or call
<a href="${telHref}">${esc(B.phone)}</a>. Describe the page and what went wrong, and we will get back to
you. We can also take your information over the phone if the form is not working for you &mdash; you never
have to use this website to hire us.</p>
</div></section>`
});

module.exports = { privacy, accessibility };
