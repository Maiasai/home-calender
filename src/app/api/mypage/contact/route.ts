//お問い合わせ送信API
import requireUser from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const POST = async (request: NextRequest) => {
  try {
    const user = await requireUser(request);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { subject, message } = await request.json();

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'mai.22.key@gmail.com',
      replyTo: user.email,
      subject: `【お問い合わせ】${subject}`,
      text: message,
    });

    return NextResponse.json({
      message: '送信完了',
    });
  } catch (error: unknown) {
    console.error('お問い合わせ送信エラー', error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '不明なエラー' }, { status: 500 });
  }
};
