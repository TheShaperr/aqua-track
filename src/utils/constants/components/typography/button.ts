import { ms } from "react-native-size-matters";

import { ScreenSize } from "@/enums/maps/ScreenSize";

import {
  FONT_SIZE_17,
  FONT_SIZE_20,
  FONT_SIZE_24,
  FONT_SIZE_26,
  SCREEN_SIZE,
} from "@/utils/constants";

const primaryButtonFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_24 : FONT_SIZE_20;
const modalPrimaryButtonFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_26 : FONT_SIZE_17;
const primaryButtonRadius = ms(20);
const primaryButtonWrapperHeight = ms(60);

export {
  primaryButtonFontSize,
  modalPrimaryButtonFontSize,
  primaryButtonRadius,
  primaryButtonWrapperHeight,
};
