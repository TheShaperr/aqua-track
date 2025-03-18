import { ScreenSize } from "@/enums/maps/ScreenSize";

import { FONT_SIZE_17, FONT_SIZE_19, SCREEN_SIZE } from "@/utils/constants";

const loginFormErrorFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_19 : FONT_SIZE_17;

export { loginFormErrorFontSize };
