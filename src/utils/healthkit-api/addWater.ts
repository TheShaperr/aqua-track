import appleHealthKit, { HealthValueOptions } from "react-native-health";

import { DrinkHistoryItem } from "@/models/DrinkHistoryItem";

import { ONE_THOUSAND } from "@/utils/constants";

const addWaterToHealthKit = (drinkItem: DrinkHistoryItem) => {
  const options: HealthValueOptions = {
    value: drinkItem.quantity / ONE_THOUSAND,
    unit: appleHealthKit.Constants.Units.gram,
    startDate: new Date(drinkItem.date).toISOString(),
  };

  appleHealthKit.saveWater(options, (err) => {
    console.log("Saving water data...");
    if (err) {
      console.error(err);
    } else {
      console.log("Water data saved successfully!");
    }
  });
};

export { addWaterToHealthKit };
