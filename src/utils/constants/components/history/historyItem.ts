import { ScreenSize } from "@/enums/maps/ScreenSize";
import {
  FONT_SIZE_11,
  FONT_SIZE_13,
  FONT_SIZE_14,
  FONT_SIZE_16,
  FONT_SIZE_20,
  SCREEN_SIZE,
} from "@/utils/constants";
import { mvs } from "react-native-size-matters";

const infoCardCurrentAmountHeight =
  SCREEN_SIZE === ScreenSize.LARGE ? mvs(30) : mvs(25);
const infoCardCurrentAmountWidth =
  SCREEN_SIZE === ScreenSize.LARGE ? mvs(75) : mvs(65);
const infoCardCurrentAmountRadius =
  SCREEN_SIZE === ScreenSize.LARGE ? mvs(10) : mvs(10);
const infoCardCurrentAmountFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_20 : FONT_SIZE_16;
const infoCardTotalAmountFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? mvs(FONT_SIZE_14) : mvs(FONT_SIZE_11);
const infoCardTotalAmountWidth =
  SCREEN_SIZE === ScreenSize.LARGE ? mvs(60) : mvs(50);
const infoCardTotalAmountHeight =
  SCREEN_SIZE === ScreenSize.LARGE ? mvs(25) : mvs(17.5);
const infoCardTotalAmountRadius =
  SCREEN_SIZE === ScreenSize.LARGE ? mvs(10) : mvs(8);
const infoCardSizeTotalFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_16 : FONT_SIZE_13;

export {
  infoCardCurrentAmountHeight,
  infoCardCurrentAmountWidth,
  infoCardCurrentAmountRadius,
  infoCardCurrentAmountFontSize,
  infoCardTotalAmountFontSize,
  infoCardTotalAmountWidth,
  infoCardTotalAmountHeight,
  infoCardTotalAmountRadius,
  infoCardSizeTotalFontSize,
};
