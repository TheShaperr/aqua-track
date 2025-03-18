import { SCREEN_SIZE } from "@/utils/constants";

const drinkAmountSensitivityObj = {
  SMALL: 0.35,
  MEDIUM: 0.325,
  LARGE: 0.25,
};

const drinkAmountSensitivity = drinkAmountSensitivityObj[SCREEN_SIZE];

export { drinkAmountSensitivity };
