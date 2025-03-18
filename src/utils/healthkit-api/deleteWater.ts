import appleHealthKit, { HealthValueOptions } from "react-native-health";

import { DrinkHistoryItem } from "@/models/DrinkHistoryItem";

import { ONE_THOUSAND } from "@/utils/constants";

const overwriteWaterEntryWithZero = (startDate: string) => {
  const options = {
    value: 0, // Overwrite with zero
    unit: appleHealthKit.Constants.Units.gram,
    startDate: new Date(startDate).toISOString(),
  };

  appleHealthKit.saveWater(options, (err) => {
    if (err) {
      console.error("Error overwriting water data:", err);
    } else {
      console.log("Water data overwritten with zero successfully!");
    }
  });
};

const deleteWaterFromHealthKit = async (item: DrinkHistoryItem) => {
  const options: HealthValueOptions = {
    value: item.quantity / ONE_THOUSAND,
    unit: appleHealthKit.Constants.Units.gram,
    startDate: new Date(item.date).toISOString(),
  };

  appleHealthKit.getWater(options, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }

    const matchedEntry = Array(results).find(
      (entry) =>
        entry.value === options.value && entry.startDate === options.startDate
    );

    if (matchedEntry) {
      overwriteWaterEntryWithZero(matchedEntry.startDate);
    } else {
      console.log("No matching water entry found.");
    }
  });
};

export { deleteWaterFromHealthKit };
