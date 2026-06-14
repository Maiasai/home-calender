// マイページ＞お問い合わせ

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../recipes/_components/ErrorMessage';
import PrimaryButton from '@/components/button/PrimaryButton';
import { useSupabaseSession } from '../../home/_hooks/useSupabaseSession';

type ContactType = {
  subject: string;
  message: string;
};

const Contact = () => {
  const { token } = useSupabaseSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ContactType>({
    mode: 'onChange',
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactType) => {
    try {
      const res = await fetch('/api/mypage/contact', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}-${text}`);
      }

      alert('お問い合わせを送信しました');
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('エラーが発生しました');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="flex justify-center border-b-2 mb-10">お問い合わせ</nav>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-md mx-auto">
          <div className="flex flex-col p-1">
            <label className="text-sm mb-1">件名</label>
            <input
              {...register('subject', {
                required: '件名は必須です',
                maxLength: {
                  value: 50,
                  message: '50文字以内で入力してください',
                },
              })}
              placeholder="件名を入力"
              className="w-full border px-2 py-1 rounded placeholder:text-sm"
            />
            <div className="my-2 ml-2">
              <ErrorMessage error={errors.subject} />
            </div>

            <label className="text-sm mb-1 mt-4">お問い合わせ内容</label>
            <textarea
              {...register('message', {
                required: 'お問い合わせ内容は必須です',
                maxLength: {
                  value: 1000,
                  message: '1000文字以内で入力してください',
                },
              })}
              placeholder="お問い合わせ内容を入力してください"
              rows={8}
              className="w-full border px-2 py-2 rounded placeholder:text-sm resize-none"
            />
            <div className="my-2 ml-2">
              <ErrorMessage error={errors.message} />
            </div>

            <div className="ml-3">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">
                ※返信が必要な場合は、登録メールアドレス宛にご連絡します。
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mb-10">
                ※内容によっては返信にお時間をいただく場合があります。
              </p>
            </div>

            <div className="flex justify-center">
              <PrimaryButton
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-[100px] h-[30px]"
                variant="primary"
              >
                送信
              </PrimaryButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Contact;
