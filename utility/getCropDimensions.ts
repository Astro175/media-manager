type getCropDimensionsProps = {
  width: number;
  height: number;
  aspectRatio: {
    width: number;
    height: number;
  };
};

type CropDimensionsReturn = {
  width: number;
  originX: number;
  height: number;
  originY: number;
};

export const getCropDimensions = ({
  width,
  height,
  aspectRatio,
}: getCropDimensionsProps): CropDimensionsReturn => {
  let originX = 0;
  let originY = 0;
  const ratio = aspectRatio.width / aspectRatio.height;
  let cropWidth = width;
  let cropHeight = height;

  const optionAHeight = width / ratio;
  const optionBWidth = height * ratio;

  if (optionAHeight < height && optionBWidth < width) {
    if (optionAHeight * width > optionBWidth * height) {
      originY = (height - optionAHeight) / 2;
      cropHeight = optionAHeight;
    } else {
      originX = (width - optionBWidth) / 2;
      cropWidth = optionBWidth;
    }
  } else if (optionAHeight < height) {
    originY = (height - optionAHeight) / 2;
    cropHeight = optionAHeight;
  } else {
    originX = (width - optionBWidth) / 2;
    cropWidth = optionBWidth;
  }

  return { originX, originY, width: cropWidth, height: cropHeight };
};
