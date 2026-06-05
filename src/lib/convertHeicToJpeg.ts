//HEICファイル変換用
import heic2any from 'heic2any';

export const convertHeicToJpeg = async (file: File) => {
  if (file.type !== 'image/heic' && file.type !== 'image/heif') {
    return file;
  }

  const convertedBlob = await heic2any({
    //blobとはただのデータの塊
    blob: file, //→変換したい元データ
    toType: 'image/jpeg',
    quality: 0.8,
  });

  //Array.isArray()→その変数は配列ですか？と聞く関数（booleanが変える）
  //trueなら配列の0番目のBlobを取り出す
  const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

  return new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
    type: 'image/jpeg',
  });
};
