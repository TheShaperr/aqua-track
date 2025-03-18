import { ms } from "react-native-size-matters";

import { ScreenSize } from "@/enums/maps/ScreenSize";

import { FONT_SIZE_20, FONT_SIZE_24, SCREEN_SIZE } from "@/utils/constants";

const historyBottomLineBorderTopWidth = ms(1);
const historyBottomLineHeight = ms(20);
const historyBottomTextIndent = ms(20);
const historyBottomFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_24 : FONT_SIZE_20;

export {
  historyBottomLineBorderTopWidth,
  historyBottomLineHeight,
  historyBottomTextIndent,
  historyBottomFontSize,
};
