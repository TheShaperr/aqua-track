import { ScreenSize } from "@/enums/maps/ScreenSize";
import { FONT_SIZE_18, FONT_SIZE_24, SCREEN_SIZE } from "@/utils/constants";

const customTabBarRadiusObj = {
  SMALL: 26,
  MEDIUM: 36,
  LARGE: 72,
};

const customTabBarFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_24 : FONT_SIZE_18;

const customTabBarRadius = customTabBarRadiusObj[SCREEN_SIZE];

export { customTabBarRadius, customTabBarFontSize };
