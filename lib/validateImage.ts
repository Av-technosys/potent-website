export type ImageValidationOptions = {
  maxSizeMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  ratio?: number; // width / height
};

export async function validateImage(
  file: File,
  options: ImageValidationOptions = {}
) {
  const {
    maxSizeMB = 2,
    maxWidth = 2000,
    maxHeight = 2000,
    ratio = 2000 / 2000,
  } = options;

  // 1️⃣ size check
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    throw new Error(`Image must be smaller than ${maxSizeMB}MB`);
  }

  // 2️⃣ dimension check
  const dimensions = await getImageDimensions(file);

  if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
    throw new Error(
      `Max resolution allowed ${maxWidth}x${maxHeight}px`
    );
  }

  // 3️⃣ ratio check
  const actualRatio = dimensions.width / dimensions.height;
  const tolerance = 0.01;

  // if (Math.abs(actualRatio - ratio) > tolerance) {
  //   throw new Error(`Image must have ${maxWidth}:${maxHeight} aspect ratio`);
  // }

  return dimensions;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };

    img.onerror = reject;
    img.src = url;
  });
}
