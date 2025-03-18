import { ms } from "react-native-size-matters";

import { ScreenSize } from "@/enums/maps/ScreenSize";

import { SCREEN_SIZE } from "@/utils/constants";

const settingsButtonIconSize =
  SCREEN_SIZE === ScreenSize.LARGE ? ms(32) : ms(25);

const settingsButtonRadius = SCREEN_SIZE === ScreenSize.LARGE ? ms(35) : ms(24);
const settingsButtonHeight = SCREEN_SIZE === ScreenSize.LARGE ? ms(70) : ms(48);
const settingsButtonWidth = SCREEN_SIZE === ScreenSize.LARGE ? ms(70) : ms(48);

export {
  settingsButtonIconSize,
  settingsButtonRadius,
  settingsButtonHeight,
  settingsButtonWidth,
};
