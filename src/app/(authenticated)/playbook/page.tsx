import { messageTemplates } from '@/lib/quotes'

const steps = [
  {
    title: 'Day 0 — Send the quote cleanly',
    body: 'Make sure the quote goes out with a clear scope, commercial summary, and direct next step. Weak sends create silent pipelines.',
  },
  {
    title: 'Day 2 — Soft check-in',
    body: 'Confirm receipt, offer to answer questions, and remove friction. This should feel helpful, not pushy.',
  },
  {
    title: 'Day 5 — Commercial nudge',
    body: 'Remind them the work is still live, mention availability, and invite a quick decision call if needed.',
  },
  {
    title: 'Day 9 — Close the loop',
    body: 'Ask whether priorities changed. The goal is a decision, not endless open-ended follow-up.',
  },
]

export default function PlaybookPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Playbook</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Default follow-up operating system</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Use this as the default motion for small service businesses: send quickly, follow up predictably, and push toward a clear yes / no / later outcome.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map((step) => (
          <div key={step.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-700">Follow-up step</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Templates</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Built-in message prompts</h3>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {Object.entries(messageTemplates).map(([key, template]) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{key}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{template}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
