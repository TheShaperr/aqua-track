import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { ms } from "react-native-size-matters";

import { FONT_SIZE_22, FONT_SIZE_26, SCREEN_SIZE } from "@/utils/constants";

import { ScreenSize } from "@/enums/maps/ScreenSize";

const backButtonTextStyle = (styles: StyleProp<TextStyle>) => ({
  ...(styles as ViewStyle),
  fontSize: SCREEN_SIZE === ScreenSize.LARGE ? FONT_SIZE_26 : FONT_SIZE_22,
});

const backButtonStyle = (styles: StyleProp<ViewStyle>) => ({
  ...(styles as ViewStyle),
  width: ms(85),
  height: ms(50),
  borderRadius: ms(25),
});

export { backButtonTextStyle, backButtonStyle };
