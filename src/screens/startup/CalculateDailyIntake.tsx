import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { FadingText } from "@/components/texts";
import { GradientWrapper } from "@/components/wrappers";
import { HorizontalLoadingIndicator } from "@/components/loading";

import { ONE_SECOND, startupStyles } from "@/utils/constants";
import { calculateDailyHydrationGoalInMl } from "@/utils/helpers";

import { setUserMetrics } from "@/store/userData";

import { type UserDataState } from "@/types/store/UserDataState";

import { UserMetrics } from "@/models/UserMetrics";

// Duration of the loading animation in ms
const duration = 12 * ONE_SECOND;

interface CalculateDailyIntakeProps {
  onCompleteStartup: () => void;
}

function CalculateDailyIntake({
  onCompleteStartup,
}: CalculateDailyIntakeProps) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const userMetrics = useSelector(
    (state: UserDataState) => state.userData.userMetrics
  );

  const textArray = [
    t("settings.profile.calcDailyIntake1"),
    t("settings.profile.calcDailyIntake2"),
    t("settings.profile.calcDailyIntake3"),
  ];

  const { weight, exerciseLvl } = userMetrics;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onCompleteStartup();
    }, duration);

    /** If weight and exercise level are successfully fetched,
     * set the hydration goal, otherwise the fallback value in the store will be used */
    if (weight && exerciseLvl) {
      const dailyHydrationGoalInMl = calculateDailyHydrationGoalInMl(
        weight,
        exerciseLvl
      );

      const updatedMetrics: Partial<UserMetrics> = {
        dailyHydrationGoal: dailyHydrationGoalInMl,
      };

      dispatch(setUserMetrics(updatedMetrics));
    }

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <GradientWrapper style={{ flex: 1 }}>
      <View style={[startupStyles.wrapper, styles.wrapper]}>
        <FadingText rotatingTexts={textArray} duration={duration}></FadingText>
        <HorizontalLoadingIndicator
          duration={duration}
        ></HorizontalLoadingIndicator>
      </View>
    </GradientWrapper>
  );
}

export { CalculateDailyIntake };

const styles = StyleSheet.create({
  wrapper: {
    width: "75%",
    left: "12.5%",
    top: "15%",
  },
});
