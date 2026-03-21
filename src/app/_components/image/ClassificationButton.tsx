//すべて、主菜、副菜、未分類　ボタン（レシピ一覧）

"use client"
import React from 'react'

interface ClassificationButtonProps {
  children:string;
  isActive?:boolean;// 選択中なら見た目を変える
  onClick:()=>void;// クリック時に親に通知
}

const ClassificationButton: React.FC<ClassificationButtonProps> = ({
  children,
  isActive=false,//選択中のボタンだけ色を変えられる
  onClick
}) =>{
  return(
    <button
      type="button"
      onClick={onClick}//onClick で親にカテゴリ変更を通知
      className = {`w-[74px] h-[34px] rounded-lg border  ${
        isActive ? "text-white bg-[#EB8A00]":" text-[#E4A000] bg-[#FFF8EB]"
      }` }
      >
      {children}
    </button>
  )
}

export default ClassificationButton;