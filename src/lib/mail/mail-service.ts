import type { SetupSnapshot } from '@/types/auth';
import type { Customer, Invoice, Quote } from '@/types/domain';

interface MailDraft {
  to: string;
  subject: string;
  body: string;
}

interface MailResult {
  success: boolean;
  message: string;
}

export function sendQuoteMail(params: {
  quote: Quote;
  customer: Customer | null;
  organization: SetupSnapshot | null;
}): MailResult {
  const draft = createQuoteMailDraft(params);
  return openMailDraft(draft);
}

export function sendInvoiceMail(params: {
  invoice: Invoice;
  customer: Customer | null;
  organization: SetupSnapshot | null;
}): MailResult {
  const draft = createInvoiceMailDraft(params);
  return openMailDraft(draft);
}

function createQuoteMailDraft({ quote, customer, organization }: { quote: Quote; customer: Customer | null; organization: SetupSnapshot | null; }): MailDraft | null {
  if (!customer?.email || !organization) {
    return null;
  }

  const subject = `Offerte van ${organization.organizationName} – ${quote.quoteDate}`;
  const body = [
    `Beste ${customer.contactName || customer.name},`,
    '',
    `Hierbij sturen wij u onze offerte vanuit ${organization.organizationName}.`,
    'Neem gerust contact op als u vragen heeft of iets wilt bespreken.',
    '',
    'Met vriendelijke groet,',
    organization.adminFullName,
    organization.organizationName,
  ].join('\n');

  return {
    to: customer.email,
    subject,
    body,
  };
}

function createInvoiceMailDraft({ invoice, customer, organization }: { invoice: Invoice; customer: Customer | null; organization: SetupSnapshot | null; }): MailDraft | null {
  if (!customer?.email || !organization) {
    return null;
  }

  const numberContext = invoice.invoiceNumber ? `Factuur ${invoice.invoiceNumber}` : 'Factuur';
  const subject = `${numberContext} van ${organization.organizationName}`;
  const body = [
    `Beste ${customer.contactName || customer.name},`,
    '',
    `Hierbij sturen wij u ${numberContext.toLowerCase()} vanuit ${organization.organizationName}.`,
    'Neem gerust contact op als u vragen heeft over dit document.',
    '',
    'Met vriendelijke groet,',
    organization.adminFullName,
    organization.organizationName,
  ].join('\n');

  return {
    to: customer.email,
    subject,
    body,
  };
}

function openMailDraft(draft: MailDraft | null): MailResult {
  if (!draft) {
    return {
      success: false,
      message: 'Mail openen is niet gelukt omdat er geen klant-e-mailadres beschikbaar is.',
    };
  }

  if (typeof window === 'undefined') {
    return {
      success: false,
      message: 'Mail openen is alleen beschikbaar in de browser.',
    };
  }

  const url = `mailto:${encodeURIComponent(draft.to)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  window.location.href = url;

  return {
    success: true,
    message: 'Uw standaard mailapp is geopend met een voorbereide onderwerpregel en berichttekst. De documentstatus is niet gewijzigd.',
  };
}
