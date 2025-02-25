import { View, StyleSheet, Image, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { ScaledSheet } from "react-native-size-matters";

import { PrimaryText, SecondaryText } from "@/components/texts";
import { InfoCard } from "@/components/cards";
import { HistoryDeleteButton } from "@/components/history/HistoryDeleteButton";

import { DrinkHistoryItem } from "@/models/DrinkHistoryItem";

import {
  useDisplayUnits,
  useGroupedDrinkHistoryQuantity,
  useTodaysDrinks,
} from "@/hooks";

import { drinkImageMap, drinkTypeList } from "@/utils/maps";
import { color, cardBorderWidth, fontFamily } from "@/utils/constants";
import {
  infoCardCurrentAmountHeight,
  infoCardCurrentAmountWidth,
  infoCardCurrentAmountRadius,
  infoCardCurrentAmountFontSize,
  infoCardTotalAmountFontSize,
  infoCardTotalAmountHeight,
  infoCardTotalAmountWidth,
  infoCardTotalAmountRadius,
  infoCardSizeTotalFontSize,
} from "@/utils/constants/components/history";
import { getHoursMinutesFromUnixDate } from "@/utils/helpers";
import { cardBorderRadius } from "@/utils/constants/components/buttons";
import {
  paragraphLargeFontSize,
  paragraphMediumFontSize,
} from "@/utils/constants/components/typography";

function HistoryItem({ item }: { item: DrinkHistoryItem }) {
  const { date, quantity, typeID } = item;
  const { label: title = "", imageSrc = "" } = drinkTypeList.find((item) => item.typeID === typeID) ?? {};

  const todaysDrinks = useTodaysDrinks();
  const { displayVolumeWithUnit, displayVolumeUnit } = useDisplayUnits();
  const { t } = useTranslation();

  const groupedDrinkHistoryQuantity = useGroupedDrinkHistoryQuantity(
    typeID,
    todaysDrinks
  );

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardImageWrapper}>
        <Image
          style={styles.cardImage}
          source={drinkImageMap[imageSrc]}
        ></Image>
      </View>
      <View style={styles.cardInfoWrapper}>
        <PrimaryText numberOfLines={1} fontSize={paragraphLargeFontSize}>
          {t(title)}
        </PrimaryText>
        <SecondaryText fontSize={paragraphMediumFontSize}>
          {getHoursMinutesFromUnixDate(date)}
        </SecondaryText>
      </View>
      <View style={scaledStyles.cardTotalWrapper}>
        <View style={styles.cardTotalTop}>
          <InfoCard
            secondary
            height={infoCardCurrentAmountHeight}
            width={infoCardCurrentAmountWidth}
            borderRadius={infoCardCurrentAmountRadius}
            fontSize={infoCardCurrentAmountFontSize}
          >
            {`+${displayVolumeWithUnit(quantity)}`}
          </InfoCard>
        </View>
        <View style={styles.cardTotalBottom}>
          <Text style={scaledStyles.cardTotalBottomText}>{`${t(
            "history.total"
          )}:`}</Text>
          <InfoCard
            fontSize={infoCardTotalAmountFontSize}
            width={infoCardTotalAmountWidth}
            height={infoCardTotalAmountHeight}
            borderRadius={infoCardTotalAmountRadius}
          >
            {`${groupedDrinkHistoryQuantity} ${t(displayVolumeUnit())}`}
          </InfoCard>
        </View>
      </View>
      <View style={styles.cardDeleteButtonWrapper}>
        <HistoryDeleteButton item={item}></HistoryDeleteButton>
      </View>
    </View>
  );
}

export { HistoryItem };

const scaledStyles = ScaledSheet.create({
  cardTotalBottomText: {
    fontFamily: fontFamily.DEFAULT,
    color: color.BLUE,
    marginRight: "10@ms",
    fontSize: infoCardSizeTotalFontSize,
  },
  cardTotalWrapper: {
    width: "30%",
    top: "10@ms",
    height: "80%",
  },
});

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: color.WHITE,
    borderColor: color.LIGHTBLUE,
    borderRadius: cardBorderRadius,
    borderWidth: cardBorderWidth,
    height: "90%",
    width: "100%",
    flexDirection: "row",
  },
  cardImageWrapper: {
    height: "100%",
    width: "20%",
  },
  cardImage: {
    width: "75%",
    height: "75%",
    left: "12.5%",
    top: "12.5%",
    objectFit: "contain",
  },
  cardInfoWrapper: {
    justifyContent: "center",
    width: "35%",
    height: "100%",
  },
  cardTotalTop: {
    height: "50%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  cardTotalBottom: {
    height: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  cardDeleteButtonWrapper: {
    width: "15%",
    height: "100%",
  },
});
