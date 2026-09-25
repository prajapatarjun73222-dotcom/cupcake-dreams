function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function notifyEmailStub(settings, subject, body) {
  if (settings?.notificationEmailEnabled) {
    console.log('[email stub]', {
      to: settings.notificationEmail || settings.email,
      subject,
      body,
    });
  }
}

module.exports = { slugify, notifyEmailStub };
