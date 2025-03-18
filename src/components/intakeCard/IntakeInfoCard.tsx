import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View } from "react-native";
import { CountUp, ReturnValue } from "use-count-up";
import { ScaledSheet } from "react-native-size-matters";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import { PrimaryText } from "@/components/texts";
import { TimeUntilSober } from "@/components/intakeCard/TimeUntilSober";

import { color, FONT_SIZE_28, shadow } from "@/utils/constants";

import {
  // totalDrinkQuantity,
  totalHydratingDrinkQuantity,
  displayPositivePercent,
  calculateCurrentBAC,
  hoursUntilSoberInteger,
  minsUntilSoberInteger,
} from "@/utils/helpers";

import { type DrinkHistoryState } from "@/types/DrinkHistoryState";
import { type UserDataState } from "@/types/store/UserDataState";

import { useTodaysDrinks } from "@/hooks";

function IntakeInfoCard() {
  const drinkHistory = useSelector(
    (state: DrinkHistoryState) => state.drinkHistory
  );
  // const totalDrinkQuantityToday = totalDrinkQuantity(drinkHistory);
  const todaysDrinks = useTodaysDrinks();
  const hydratingDrinkQuantity = totalHydratingDrinkQuantity(todaysDrinks);

  const prevCountUpValue = useRef<ReturnValue | null>(null);

  const { gender, weight, dailyHydrationGoal } = useSelector(
    (state: UserDataState) => state.userData.userMetrics
  );

  /**
   * Calculate BAC down to 10 decimals to get
   * as accurately as possible to be able to
   * update minutes left until sober more frequently
   */
  const currentBAC = calculateCurrentBAC(drinkHistory, gender, weight, 10);
  const hrsUntilSober = hoursUntilSoberInteger(currentBAC);
  const minsUntilSober = minsUntilSoberInteger(currentBAC);
  const hydrationLevelInPercent = Math.min(
    displayPositivePercent(hydratingDrinkQuantity, dailyHydrationGoal),
    100
  );

  const [currentHydrationLevel, setCurrentHydrationLevel] = useState(
    hydrationLevelInPercent
  );
  const [prevHydrationLevel, setPrevHydrationLevel] = useState(
    hydrationLevelInPercent
  );
  const [currentHrsUntilSober, setCurrentHrsUntilSober] =
    useState(hrsUntilSober);
  const [prevHrsUntilSober, setPrevHrsUntilSober] = useState(hrsUntilSober);
  const [currentMinsUntilSober, setCurrentMinsUntilSober] =
    useState(minsUntilSober);
  const [prevMinsUntilSober, setPrevMinsUntilSober] = useState(minsUntilSober);

  /**
   * Update hydration level and time until sober
   * whenever the IntakeInfoCard component comes into focus
   */
  useFocusEffect(
    useCallback(() => {
      setPrevHydrationLevel(currentHydrationLevel);
      if (currentHydrationLevel < 100 && hydrationLevelInPercent === 100) {
        setCurrentHydrationLevel(100);
      } else {
        setCurrentHydrationLevel(hydrationLevelInPercent);
      }

      setPrevHrsUntilSober(currentHrsUntilSober);
      setCurrentHrsUntilSober(hrsUntilSober);

      setPrevMinsUntilSober(currentMinsUntilSober);
      setCurrentMinsUntilSober(minsUntilSober);
    }, [hydrationLevelInPercent, hrsUntilSober, minsUntilSober])
  );

  const handleHapticFeedback = useCallback(() => {
    ReactNativeHapticFeedback.trigger("effectTick");
  }, []);

  const isTimeUntilSoberVisible = hrsUntilSober > 0 || minsUntilSober > 0;

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor:
            currentHydrationLevel == 100 ? color.GREEN : color.WHITE,
        },
      ]}
    >
      <PrimaryText numberOfLines={1} fontSize={FONT_SIZE_28} color={color.BLUE}>
        {/* {metricUnitConversion(totalDrinkQuantityToday)} */}
        <CountUp
          key={currentHydrationLevel}
          isCounting
          start={prevHydrationLevel}
          end={currentHydrationLevel}
          duration={1} // Duration in seconds
          easing={"easeOutCubic"}
          onUpdate={(value) => {
            if (value !== prevCountUpValue.current) {
              handleHapticFeedback();
              prevCountUpValue.current = value;
            }
          }}
        />
        %
        {currentHydrationLevel == 100 && (
          <>
            {" "}
            <Ionicons
              color={color.BLUE}
              size={20}
              name="checkmark-circle-outline"
            />
          </>
        )}
      </PrimaryText>
      {isTimeUntilSoberVisible && (
        <>
          {/**
           * Below pseudo-view needed for space between
           * hydration level and time until sober
           */}
          <View style={{ width: "5%" }}></View>
          <TimeUntilSober
            currentHrsUntilSober={currentHrsUntilSober}
            prevHrsUntilSober={prevHrsUntilSober}
            currentMinsUntilSober={currentMinsUntilSober}
            prevMinsUntilSober={prevMinsUntilSober}
          ></TimeUntilSober>
        </>
      )}
    </View>
  );
}

export { IntakeInfoCard };

const styles = ScaledSheet.create({
  wrapper: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: "20@ms",
    paddingVertical: "8@ms",
    borderRadius: "25@ms",
    color: color.BLUE,
    ...shadow,
  },
});
