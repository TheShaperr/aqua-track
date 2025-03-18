import { ScreenSize } from "@/enums/maps/ScreenSize";
import {
  FONT_SIZE_11,
  FONT_SIZE_15,
  FONT_SIZE_17,
  FONT_SIZE_20,
  FONT_SIZE_24,
  SCREEN_SIZE,
} from "@/utils/constants";

const paragraphVerySmallFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_15 : FONT_SIZE_11;
const paragraphSmallFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_17 : FONT_SIZE_15;
const paragraphMediumFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_20 : FONT_SIZE_17;
const paragraphLargeFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_24 : FONT_SIZE_20;

export {
  paragraphVerySmallFontSize,
  paragraphSmallFontSize,
  paragraphMediumFontSize,
  paragraphLargeFontSize,
};
