import { DrinkHistoryItem } from "@/models/DrinkHistoryItem";
import { useDisplayUnits } from "@/hooks/useDisplayUnits";

/**
 * Custom hook for calculating the total quantity of a specific drink type.
 *
 * @param {*} typeID - the ID of the drink type to group by
 * @param {*} drinkList - the list of drink history items to calculate from
 * @returns the total quantity of the specified drink type
 */

function useGroupedDrinkHistoryQuantity(
  typeID: number,
  drinkList: DrinkHistoryItem[]
): number {
  const { displayRoundedVolume } = useDisplayUnits();

  const totalQuantity = drinkList
    .filter((item) => item.typeID === typeID)
    .reduce((total, item) => total + displayRoundedVolume(item.quantity), 0);

  return totalQuantity;
}

export { useGroupedDrinkHistoryQuantity };
