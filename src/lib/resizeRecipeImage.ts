//画像ファイルを加工するだけの共通処理
const MAX_SIZE = 1600;
const QUALITY = 0.82;

export const resizeRecipeImage = async (file: File): Promise<File> => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();

    const scale = Math.min(
      1,
      MAX_SIZE / Math.max(image.naturalWidth, image.naturalHeight),
    );

    if (scale === 1) return file;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);

    const context = canvas.getContext('2d');
    if (!context) return file;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, QUALITY),
    );

    if (!blob) return file;

    const extension = outputType === 'image/png' ? 'png' : 'jpg';

    return new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
      type: outputType,
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};
