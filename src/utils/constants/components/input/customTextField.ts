import { ms } from "react-native-size-matters";

import { ScreenSize } from "@/enums/maps/ScreenSize";

import { SCREEN_SIZE } from "@/utils/constants";

const customTextFieldPadding = SCREEN_SIZE === ScreenSize.LARGE ? 0 : ms(2.5);

export { customTextFieldPadding };
