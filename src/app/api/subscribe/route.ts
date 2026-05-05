export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const BodySchema = z.object({
  email: z.string().email(),
})

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')
  return createClient(url, key)
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { email } = parsed.data
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('theme_studio_subscribers')
    .insert({ email, source: 'organic' })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'already_registered' }, { status: 409 })
    }
    console.error('[subscribe] DB error:', error.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (resendKey && fromEmail) {
    try {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: `Alexander from Theme Studio <${fromEmail}>`,
        to: email,
        subject: "You're on the list — Theme Studio",
        text: `Hey!\n\nThanks for signing up. We'll let you know when the full component library drops.\n\n— Alexander\nhttps://notjustsasha.com`,
      })
    } catch (err) {
      console.error('[subscribe] Email error:', err)
    }
  }

  return NextResponse.json({ success: true })
}
