import { getCropDimensions } from "@/utility/getCropDimensions";
import { ImageManipulator, ImageRef, SaveFormat } from "expo-image-manipulator";
type cropProps = {
  uri: string;
  renderedImage?: ImageRef;
  width: number;
  height: number;
  aspectRatio: {
    width: number;
    height: number;
  };
};
export const imageProcessingService = {
  crop: async ({
    uri,
    width,
    height,
    aspectRatio,
    renderedImage,
  }: cropProps) => {
    const result = getCropDimensions({ width, height, aspectRatio });
    const source = renderedImage ? renderedImage : uri;
    const context = ImageManipulator.manipulate(source);
    context.crop({
      height: result.height,
      width: result.width,
      originX: result.originX,
      originY: result.originY,
    });
    const imageRef = await context.renderAsync();
    return imageRef;
  },
  rotate: async (uri: string, degrees: number, renderedImage?: ImageRef) => {
    const source = renderedImage ? renderedImage : uri;
    const context = ImageManipulator.manipulate(source);
    context.rotate(degrees);
    const imageRef = await context.renderAsync();
    return imageRef;
  },
  compress: async (quality: number, image?: ImageRef, uri?: string) => {
    if (!image && !uri) {
      throw new Error("compress requires either an ImageRef or a URI");
    }
    let renderedImage: ImageRef | null = image ? image : null;
    if (uri) {
      const context = ImageManipulator.manipulate(uri);
      renderedImage = await context.renderAsync();
    }
    const result = await renderedImage?.saveAsync({
      format: SaveFormat.JPEG,
      compress: quality,
    });
    return result;
  },
};
