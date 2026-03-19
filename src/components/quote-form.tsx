import { STATUSES, TEMPLATE_KEYS, type Quote } from '@/lib/quotes'

type QuoteFormProps = {
  action: (formData: FormData) => void
  quote?: Quote
  submitLabel: string
}

const fieldClass =
  'mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-0 transition focus:border-zinc-400'

export function QuoteForm({ action, quote, submitLabel }: QuoteFormProps) {
  return (
    <form action={action} className="grid gap-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-zinc-700">
          Client name
          <input className={fieldClass} name="clientName" defaultValue={quote?.clientName} required />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Contact name
          <input className={fieldClass} name="contactName" defaultValue={quote?.contactName} />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Email
          <input className={fieldClass} name="email" type="email" defaultValue={quote?.email} />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Company
          <input className={fieldClass} name="company" defaultValue={quote?.company} />
        </label>
        <label className="block text-sm font-medium text-zinc-700 md:col-span-2">
          Quote title
          <input className={fieldClass} name="title" defaultValue={quote?.title} required />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Value (GBP)
          <input className={fieldClass} name="value" type="number" min="0" step="100" defaultValue={quote?.value} required />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Status
          <select className={fieldClass} name="status" defaultValue={quote?.status ?? 'draft'}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Sent date
          <input className={fieldClass} name="sentDate" type="date" defaultValue={quote?.sentDate} />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Follow-up cadence (days)
          <input
            className={fieldClass}
            name="followUpOffsets"
            defaultValue={quote?.followUpOffsets.join(', ') ?? '2, 5, 9'}
            placeholder="2, 5, 9"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700 md:col-span-2">
          Message template
          <select className={fieldClass} name="templateKey" defaultValue={quote?.templateKey ?? 'friendly'}>
            {TEMPLATE_KEYS.map((template) => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-zinc-700 md:col-span-2">
          Notes
          <textarea className={`${fieldClass} min-h-32`} name="notes" defaultValue={quote?.notes} />
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
        <p className="text-sm text-zinc-500">Tip: set a sent date to generate the chase schedule automatically.</p>
        <button className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
