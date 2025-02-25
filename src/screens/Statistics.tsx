import { View, StyleSheet } from "react-native";
import { VictoryPie } from "victory-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { t } from "i18next";
import { ms } from "react-native-size-matters";

import { color } from "@/utils/constants";
import { formatNumber, totalDrinkQuantity } from "@/utils/helpers";
import { paragraphVerySmallFontSize } from "@/utils/constants/components/typography";
import {
  pieCornerRadius,
  pieDimensions,
  pieInnerRadius,
  pieLabelRadius,
} from "@/utils/constants/components/pieChart";
import { drinkTypeList } from "@/utils/maps";

import { DrinkHistoryItem } from "@/models/DrinkHistoryItem";
import { useTodaysDrinks } from "@/hooks";

function Statistics() {
  const drinkHistory = useTodaysDrinks();
  const [_, setIsFocused] = useState(false); // State to trigger rerender

  const reducedDrinkHistory: DrinkHistoryItem[] = Object.values(
    drinkHistory.reduce<Record<number, DrinkHistoryItem>>((acc, item) => {
      const existingItem = acc[item.typeID];
      if (!existingItem) {
        acc[item.typeID] = { ...item };
      } else {
        existingItem.quantity += item.quantity;
      }
      return acc;
    }, {})
  );

  // Map color and label properties via drinkTypeList
  const drinkTypeMap = Object.fromEntries(drinkTypeList.map(item => [item.typeID, item]));

  // Map slice color via drinkTypeList
  const sliceColor = reducedDrinkHistory.map(item => drinkTypeMap[item.typeID]?.color ?? color.BLACK);

  /**
   * Prepare the data for the pie chart, including labels.
   */
  const graphicsData = reducedDrinkHistory.map(item => ({
    x: t(drinkTypeMap[item.typeID]?.label ?? ""), 
    y: (item.quantity / totalDrinkQuantity(drinkHistory)) * 100,
  }));

  // Update state when screen is focused
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.pieChartWrapper}>
        <VictoryPie
          padAngle={10}
          animate={{ easing: "exp", duration: 150 }}
          data={graphicsData}
          width={pieDimensions}
          height={pieDimensions}
          colorScale={sliceColor}
          innerRadius={pieInnerRadius}
          labelRadius={pieLabelRadius}
          cornerRadius={pieCornerRadius}
          labels={({ datum }) =>
            `${Math.min(formatNumber(datum.y), 100)}% ${datum.x}`
          }
          style={{
            labels: {
              fontFamily: "Chewy-Regular",
              fill: color.DARK_BLUE,
              fontSize: paragraphVerySmallFontSize,
              padding: ms(16),
            },
          }}
        />
      </View>
    </View>
  );
}

export { Statistics };

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pieChartWrapper: {
    width: "100%",
    height: "100%", // Adjusted to occupy full height since legend is removed
    justifyContent: "center",
    alignItems: "center",
  },
});
