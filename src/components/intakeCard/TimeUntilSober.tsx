import { View } from "react-native";
import { CountUp } from "use-count-up";
import { useTranslation } from "react-i18next";

import { PrimaryText } from "@/components/texts/PrimaryText";

import { FONT_SIZE_12, FONT_SIZE_16 } from "@/utils/constants";

interface TimeUntilSoberProps {
  currentHrsUntilSober: number;
  prevHrsUntilSober: number;
  currentMinsUntilSober: number;
  prevMinsUntilSober: number;
}

function TimeUntilSober({
  currentHrsUntilSober,
  prevHrsUntilSober,
  currentMinsUntilSober,
  prevMinsUntilSober,
}: TimeUntilSoberProps) {
  const { t } = useTranslation();

  return (
    <View>
      <PrimaryText numberOfLines={1} fontSize={FONT_SIZE_16}>
        {currentHrsUntilSober > 0 && (
          <>
            <CountUp
              key={`${currentHrsUntilSober}h`}
              isCounting
              start={prevHrsUntilSober}
              end={currentHrsUntilSober}
              duration={2} // Duration in seconds
              easing={"easeOutCubic"}
            />
            {currentHrsUntilSober > 0 && `${t("unit.hours")} `}
          </>
        )}
        {currentMinsUntilSober > 0 && (
          <>
            <CountUp
              key={`${currentMinsUntilSober}m`}
              isCounting
              start={prevMinsUntilSober}
              end={currentMinsUntilSober}
              duration={2} // Duration in seconds
              easing={"easeOutCubic"}
            />
            {currentMinsUntilSober > 0 && `${t("unit.minutes")} `}
          </>
        )}
      </PrimaryText>
      <View>
        <PrimaryText numberOfLines={1} fontSize={FONT_SIZE_12}>
          {t("drinks.untilSober")}
        </PrimaryText>
      </View>
    </View>
  );
}

export { TimeUntilSober };
