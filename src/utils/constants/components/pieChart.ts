import { SCREEN_SIZE } from "@/utils/constants";

const pieDimensionsObj = {
  SMALL: 300,
  MEDIUM: 350,
  LARGE: 500,
};

const pieInnerRadiusObj = {
  SMALL: 60,
  MEDIUM: 70,
  LARGE: 110,
};

const pieLabelRadiusObj = {
  SMALL: 80,
  MEDIUM: 90,
  LARGE: 150,
};

const pieCornerRadiusObj = {
  SMALL: 10,
  MEDIUM: 12.5,
  LARGE: 30,
};

const pieDimensions = pieDimensionsObj[SCREEN_SIZE];
const pieInnerRadius = pieInnerRadiusObj[SCREEN_SIZE];
const pieLabelRadius = pieLabelRadiusObj[SCREEN_SIZE];
const pieCornerRadius = pieCornerRadiusObj[SCREEN_SIZE];

export { pieDimensions, pieInnerRadius, pieLabelRadius, pieCornerRadius };
