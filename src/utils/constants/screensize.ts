import { Dimensions } from "react-native";

import { ScreenSize } from "@/enums/maps/ScreenSize";

const window = Dimensions.get("window");
const { width, height } = window;

let SCREEN_SIZE: ScreenSize;

if (width < 400 && height < 700) {
  SCREEN_SIZE = ScreenSize.SMALL;
} else if (width < 500 && height < 1000) {
  SCREEN_SIZE = ScreenSize.MEDIUM;
} else {
  SCREEN_SIZE = ScreenSize.LARGE;
}

export { SCREEN_SIZE, height as screenHeight, width as screenWidth };
