import { ms } from "react-native-size-matters";

const color = {
  TRANSPARENT: "transparent",
  WHITE: "#FFFFFF",
  LIGHTBLUE: "#8FC7FF",
  LIGHTBLUE_OPACITY_0_2: "rgba(143, 199, 255, 0.2)",
  BLUE: "#3C91E6",
  DARK_BLUE: "#003061",
  RED: "#FF7575",
  GREEN: "lightgreen",
  BLACK: "#000000",

  GRADIENT_LIGHTER_BLUE: "#BADCFF",
  GRADIENT_DARKER_BLUE: "#DCEFFF",

  APP_PRIMARY_BACKGROUND_FIRST_GRADIENT: "#FFFFFF", // WHITE
  APP_PRIMARY_BACKGROUND_SECOND_GRADIENT: "#CCE7FF",
  APP_SECONDARY_BACKGROUND: "#516CC9",
};

const fontFamily = {
  DEFAULT: "Chewy-Regular",
  SYSTEM: "System",
  GOOGLE: "Roboto",
};

const shadow = {
  shadowColor: color.BLUE,
  shadowOffset: { width: ms(5), height: ms(5) },
  shadowOpacity: ms(0.2),
  shadowRadius: ms(5),
};

const inputFieldHeight = ms(40);
const cardBorderWidth = ms(1.5);

export { color, shadow, inputFieldHeight, cardBorderWidth, fontFamily };
