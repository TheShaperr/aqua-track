const inputDrinkConfig = [
  /**
   * Hydrating drink types
   */
  { drinkType: "normal", size: 500, increment: 50, hydroFactor: 1, abv: 0 },
  { drinkType: "tea", size: 500, increment: 50, hydroFactor: 0.9, abv: 0 },
  { drinkType: "soda", size: 500, increment: 50, hydroFactor: 0.85, abv: 0 },
  {
    drinkType: "caffeine",
    size: 500,
    increment: 50,
    hydroFactor: 0.75,
    abv: 0,
  },

  /**
   * Dehydrating drink types
   */
  {
    drinkType: "alcohol_mild",
    size: 500,
    increment: 50,
    hydroFactor: -0.4,
    abv: 0.05,
  },
  {
    drinkType: "alcohol_mid",
    size: 250,
    increment: 25,
    hydroFactor: -1,
    abv: 0.15,
  },
  {
    drinkType: "alcohol_heavy",
    size: 50,
    increment: 10,
    hydroFactor: -3,
    abv: 0.4,
  },
];

/**
 * Hydro factor formula: Consuming 1g of pure alcohol produces 10ml of urine within the next 4 hours
 * meaning, after consuming 10g of pure alcohol, an urination of 100ml (10g x 10ml) is expected
 * so to offset the dehydration caused by the alcohol, drinking 100ml of water is needed
 *
 * To calculate the mass (g) of pure alcohol consumed, take the ABV (%) of an alcoholic beverage
 * meaning 250ml of 13% redwine contains 32.5g of pure alcohol
 * --> drinking 325ml (32.5g x 10ml) of water is required to offset dehydration caused by the alcoholic beverage
 */

/**
 * Constants needed for the Widmark Equation
 */

const ALCOHOL_DENSITY = 0.789;
const ALCOHOL_ELIMINATION_RATE_PER_HOUR = 0.015;

const DISTRIBUTION_RATIO_FEMALE = 0.55;
const DISTRIBUTION_RATIO_MALE = 0.68;
const DISTRIBUTION_RATIO_OTHER =
  (DISTRIBUTION_RATIO_FEMALE + DISTRIBUTION_RATIO_MALE) / 2;

export {
  inputDrinkConfig,
  ALCOHOL_DENSITY,
  ALCOHOL_ELIMINATION_RATE_PER_HOUR,
  DISTRIBUTION_RATIO_FEMALE,
  DISTRIBUTION_RATIO_MALE,
  DISTRIBUTION_RATIO_OTHER,
};
