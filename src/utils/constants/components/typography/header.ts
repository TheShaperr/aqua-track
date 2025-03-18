import { ScreenSize } from "@/enums/maps/ScreenSize";

import { FONT_SIZE_26, FONT_SIZE_34, SCREEN_SIZE } from "@/utils/constants";

const headerFontSize =
  SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_34 : FONT_SIZE_26;

export { headerFontSize };
