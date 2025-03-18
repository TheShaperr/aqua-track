import { ms } from "react-native-size-matters";
import { SCREEN_SIZE } from "../../screensize";
import { ScreenSize } from "@/enums/maps/ScreenSize";

const historyButtonIconSize = ms(25);
const historyButtonRadius =
  SCREEN_SIZE === ScreenSize.LARGE ? ms(10) : ms(12.5);

export { historyButtonIconSize, historyButtonRadius };
