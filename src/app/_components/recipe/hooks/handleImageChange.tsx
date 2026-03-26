//画像箇所　hook

import { supabase } from "@/_libs/supabase";
import { UseFormSetValue } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { RecipeFormValues } from "../_types/RecipeFormValues";

//画像が選ばれた→supabaseにUP→その結果をreact-hook-formに反映

type Props = {
  event : React.ChangeEvent < HTMLInputElement >;
  setValue : UseFormSetValue < RecipeFormValues >;
  setPreviewUrl : ( url: string | null) => void ;
}

const handleImageChange = async({ event , setValue , setPreviewUrl } : Props )=>{

  //①ファイルを取り出す
  if (!event.target.files || event.target.files.length === 0){//event.target.filesが存在しないか、ファイル数0の場合はreturn
    return;
  }

  let file = event.target.files[0]//ユーザーが選択した画像を取得
  console.log('画像ファイル',file)

  //選択直後プレビュー
  const preview = URL.createObjectURL(file);
  setPreviewUrl(preview);
  console.log('プレビュー',preview)

  const uuid = uuidv4();//ランダムな一意なIDを作る関数
  const fileName = file.name;
  const filePath = `private/${uuid}_${fileName}`;

  //②supabaseにアップロード（uuid名で保存）
  const { data ,error } = await supabase.storage
    .from('post_thumbnail')
    .upload(filePath,file,{
      cacheControl : '3600',
      upsert : false,
    })

    //アップロード失敗した場合
    if(error){
      alert(error.message)
      return
    }

    //ここで公開URL取得
    const publicUrl = supabase.storage
      .from("post_thumbnail")//supabage Storageのpost_thumbnailというパケットにあるdata.pathファイルの外部アクセスURLをくださいと指示
      .getPublicUrl(data.path).data.publicUrl;

    //③formの値を管理
    setValue("thumbnailImageUrl", publicUrl);

}

export default handleImageChange;