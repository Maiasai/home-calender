//栄養チェックUI

'use client';

type Props = {
  title: string;
  cname: string;
  message: string;
  comment: string;
};

export const NutritionResultUi = ({
  title,
  cname,
  message,
  comment,
}: Props) => {
  return (
    <div className="flex flex-col bg-white  mx-4 mt-2 mb-2 p-3 rounded-lg">
      <h2 className="border-b mb-2">{title}</h2>
      <p className={cname}>{message}</p>
      <p className="text-sm mt-2">{comment}</p>
    </div>
  );
};
