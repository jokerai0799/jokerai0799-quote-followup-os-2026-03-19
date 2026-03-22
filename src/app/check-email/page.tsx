import { redirect } from 'next/navigation'

export default async function CheckEmailAliasPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  redirect(email ? `/signup/check-email?email=${encodeURIComponent(email)}` : '/signup/check-email')
}
