import { ExerciseLevel } from "@/enums/settings/ExerciseLevel";
import { Gender } from "@/enums/settings/Gender";
import { MeasurementSystem } from "@/enums/settings/MeasurementSystem";

import { DrinkHistoryItem } from "@/models/DrinkHistoryItem";

import { type UnixDate } from "@/types/UnixDate";

import {
  ALCOHOL_DENSITY,
  ALCOHOL_ELIMINATION_RATE_PER_HOUR,
  DISTRIBUTION_RATIO_FEMALE,
  DISTRIBUTION_RATIO_MALE,
  DISTRIBUTION_RATIO_OTHER,
  AVOIRDUPOIS_POUND_FACTOR,
  MIN_PER_HOUR,
  MS_PER_HOUR,
  ONE_THOUSAND,
  inputDrinkConfig,
} from "@/utils/constants";
import { drinkTypeList } from "@/utils/maps";

/**
 * @param {*} timeMs - time in milliseconds to wait
 * @returns a promise that resolves in the given time
 */
const sleep = (timeMs: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
};

/**
 * Function to format a number to the nearest integer
 *
 * @param {*} num - the number to format
 * @returns the rounded number or zero if the result would be negative
 */

const formatNumber = (num: number): number => {
  const roundedNumber = Math.round(num);
  return Math.max(0, roundedNumber);
};

/**
 *
 * @param {*} num - the numerator
 * @param {*} denom - the denominator
 * @returns the positive percentage
 */
const displayPositivePercent = (num: number, denom: number): number => {
  return denom === 0 ? 0 : Math.max(0, formatNumber((num / denom) * 100));
};

/**
 *
 * @param {*} num - the number to format
 * @param {*} decimals - the number of decimal places
 * @returns the formatted number
 */
const formatDecimals = (num: number, decimals: number): number => {
  /**
   * The EPSILON constant ensures the rounding is more correct
   * (for instance 1.005 is rounded correctly, etc.)
   */
  const adjustedNumer = num + Number.EPSILON;
  const fixedNum: string = adjustedNumer.toFixed(decimals);
  const parsedNum: number = parseFloat(fixedNum);

  return parsedNum;
};

const numToString = (num: number | null) => {
  if (num === null || isNaN(num)) {
    return "";
  }

  return String(num);
};

/**
 * TODO: CURRENTLY UNUSED
 *
 * @param {*} totalIntake - the total intake in milliliters
 * @returns a string depicting formatted beverage quantity in metric units
 */
const metricUnitConversion = (totalIntake: number): string => {
  let retVal = `${totalIntake} ml`;

  if (totalIntake > 500 && totalIntake < ONE_THOUSAND) {
    retVal = `${formatNumber(totalIntake / 100)} dl`;
  } else if (totalIntake >= ONE_THOUSAND && totalIntake < ONE_THOUSAND) {
    retVal = `${formatNumber(formatDecimals(totalIntake, 1) / ONE_THOUSAND)} l`;
  } else if (totalIntake > 5_000) {
    retVal = `${formatNumber(totalIntake / ONE_THOUSAND)} l`;
  }

  return retVal;
};

/**
 *
 * @param {*} inputValue - weight input from the user
 * @param {*} measurementSystem - current measurement system
 * @returns the weight converted to kilograms
 */
export function convertWeightInputToKg(
  inputValue: string,
  measurementSystem: MeasurementSystem
): number {
  const value = Number(inputValue);
  if (measurementSystem === MeasurementSystem.Imperial) {
    return value * AVOIRDUPOIS_POUND_FACTOR;
  } else {
    return value;
  }
}

/**
 *
 * @param {*} drinkHistory - array of drink history records
 * @returns the total quantity of consumed beverages
 */
const totalDrinkQuantity = (drinkHistory: DrinkHistoryItem[]) => {
  return drinkHistory.reduce((acc, val) => acc + val.quantity, 0);
};

/**
 *
 * @param {*} drinkHistory - array of drink history records
 * @returns the net hydration quantity
 *
 * Meaning Drinking 500ml of water returns 500ml water
 * Drinking 500ml of beer returns -80ml
 * Drinking 250ml of tea returns 225ml, etc.
 */

const totalHydratingDrinkQuantity = (drinkHistory: DrinkHistoryItem[]) => {
  const hydroFactorMap = Object.fromEntries(
    drinkTypeList.map(item => [item.typeID, item.drinkType])
  );

  return (
    drinkHistory.reduce((acc, item) => {
      const drinkType = hydroFactorMap[item.typeID];
      const drinkConfig = inputDrinkConfig.find(config => config.drinkType === drinkType);

      if (!drinkConfig) return acc; // Skip if no match is found

      const hydrationQuantity = item.quantity * drinkConfig.hydroFactor;
      return acc + hydrationQuantity;
    }, 0) ?? 0
  );
};


/**
 *
 * @param {*} unixDate - the unix timestamp
 * @returns a string with the hours and minutes
 * in the following format: hh:mm
 */
const getHoursMinutesFromUnixDate = (unixDate: UnixDate): string => {
  const date = new Date(unixDate);

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure minutes are two digits

  const timeString = `${hours}:${minutes}`;

  return timeString;
};

/**
 *
 * @param {*} drinkVolumeInMilliLitres - volume of alcoholic beverage consumed in MILLILITERS
 * @param {*} abv - alcohol content of alcoholic beverage consumed (ABV - Alcohol By Volume)
 * @param {*} gender - gender of user
 * @param {*} weightInKg - weight of user in KILOGRAMS
 * @returns the percentage of BAC (Blood Aclohol Content) of the user
 *
 * Calculated using the Widmark Equation
 * (Dose in grams/(Body weight in grams x Distribution ratio "r"))x100
 * where r(male)=.68 r(female)=.55 and assuming an average constant rate of -0.016 BAC per hour.
 *
 *
 */
const calculateBacAfterDrink = (
  drinkVolumeInMilliLitres: number,
  abv: number | undefined,
  gender: Gender | null,
  weightInKg: number | null
) => {
  const alcoholInGrams =
    drinkVolumeInMilliLitres * (abv ?? 0) * ALCOHOL_DENSITY;

  const weightHelper =
    (weightInKg ?? 0) * ONE_THOUSAND * distributionRatioByGender(gender);

  let bac = 0;

  if (alcoholInGrams > 0 && weightHelper > 0) {
    bac = (alcoholInGrams / weightHelper) * 100;
  }

  const roundedBAC = formatDecimals(bac, 3);

  return roundedBAC;
};

/**
 * Calculates the current Blood Alcohol Concentration (BAC) level of the user.
 *
 * @param {*} drinkHistory - array of DrinkHistoryItems representing the user's drinking history
 * @param {*} gender - gender of the user, used to calculate BAC
 * @param {*} weight - weight of the user in kilograms, used to calculate BAC
 * @param {*} decimals - number of decimal places for the BAC calculation
 *
 * @returns the current BAC level of the user, accurate to the specified number of decimal places
 */
const calculateCurrentBAC = (
  drinkHistory: DrinkHistoryItem[],
  gender: Gender | null,
  weight: number | null,
  decimals: number = 3
) => {
  const abvMap = Object.fromEntries(drinkTypeList.map(item => [item.typeID, item.drinkType]));
  const abvConfigMap = Object.fromEntries(inputDrinkConfig.map(item => [item.drinkType, item.abv]));

  const currentDate = new Date();
  let currentBAC = 0;
  let previousDrinkTimestamp: UnixDate | null = null;

  drinkHistory.forEach((historyItem) => {
    const drinkType = abvMap[historyItem.typeID];
    const abv = drinkType ? abvConfigMap[drinkType] ?? 0 : 0;

    const drinkDate = historyItem.date;
    const initialBAC = calculateBacAfterDrink(
      historyItem.quantity,
      abv,
      gender,
      weight
    );

    if (previousDrinkTimestamp) {
      const elapsedTimeHours =
        (drinkDate - previousDrinkTimestamp) / MS_PER_HOUR;
      currentBAC = Math.max(
        currentBAC - elapsedTimeHours * ALCOHOL_ELIMINATION_RATE_PER_HOUR,
        0
      );
    }

    currentBAC += initialBAC;
    previousDrinkTimestamp = drinkDate;
  });

  const elapsedTimeSinceLastDrinkHours =
    (currentDate.getTime() - (previousDrinkTimestamp ?? 0)) / MS_PER_HOUR;
  currentBAC = Math.max(
    currentBAC -
    elapsedTimeSinceLastDrinkHours * ALCOHOL_ELIMINATION_RATE_PER_HOUR,
    0
  );

  return formatDecimals(currentBAC, decimals);
};

/**
 *
 * @param {*} currentBAC - current BAC level of the user
 * @returns hours left (with decimals!) until user is sober
 */
const hoursUntilSober = (currentBAC: number) => {
  return currentBAC / ALCOHOL_ELIMINATION_RATE_PER_HOUR;
};

/**
 *
 * @param {*} currentBAC - current BAC level of the user
 * @returns hours left (integer!) until user is sober
 */
const hoursUntilSoberInteger = (currentBAC: number) => {
  return Math.floor(hoursUntilSober(currentBAC));
};

/**
 *
 * @param {*} currentBAC - current BAC level of the user
 * @returns minutes left (with decimals!) until user is sober
 */
const minsUntilSober = (currentBAC: number) => {
  return hoursUntilSober(currentBAC) * MIN_PER_HOUR;
};

/**
 *
 * @param {*} currentBAC - current BAC level of the user
 * @returns minutes left until user is sober EXCLUDING full hours(!!)
 */
const minsUntilSoberInteger = (currentBAC: number) => {
  return Math.floor(minsUntilSober(currentBAC) % MIN_PER_HOUR);
};

/**
 *
 * @param {*} gender - gender of user
 * @returns the distribution ratio based on gender - needed for the Widmark Equation
 */
const distributionRatioByGender = (gender: Gender | null): number => {
  if (!gender) return DISTRIBUTION_RATIO_OTHER;

  switch (gender) {
    case Gender.Female:
      return DISTRIBUTION_RATIO_FEMALE;
    case Gender.Male:
      return DISTRIBUTION_RATIO_MALE;
    default:
      return DISTRIBUTION_RATIO_OTHER;
  }
};

/**
 *
 * @param {*} weightInKg - weight of user in kg
 * @param {*} exerciseLvl - exercise level of user
 * @returns the daily hydration goal of the user in ml
 */
const calculateDailyHydrationGoalInMl = (
  weightInKg: number,
  exerciseLvl: ExerciseLevel
) => {
  /** Round daily hydration goal to nearest hundred milliliters */
  let dailyHydrationGoalInMl = Math.round((weightInKg * 33.33) / 100) * 100;

  switch (exerciseLvl) {
    case ExerciseLevel.Sometimes:
      dailyHydrationGoalInMl += 500;
      break;
    case ExerciseLevel.Often:
      dailyHydrationGoalInMl += 1000;
      break;
  }

  return dailyHydrationGoalInMl;
};

/* Empty function that does nothing */
const emptyFunc = () => { };

export {
  sleep,
  formatNumber,
  metricUnitConversion,
  totalDrinkQuantity,
  totalHydratingDrinkQuantity,
  displayPositivePercent,
  getHoursMinutesFromUnixDate,
  formatDecimals,
  numToString,
  calculateBacAfterDrink,
  calculateCurrentBAC,
  minsUntilSober,
  minsUntilSoberInteger,
  hoursUntilSober,
  hoursUntilSoberInteger,
  calculateDailyHydrationGoalInMl,
  emptyFunc,
};
