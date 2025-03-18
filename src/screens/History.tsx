import { StyleSheet, View } from "react-native";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { SettingsButton } from "@/components/buttons";
import { HistoryItem, HistoryBottom } from "@/components/history";
import { GradientWrapper } from "@/components/wrappers";
import { PrimaryText } from "@/components/texts";
import { CustomFlatList } from "@/components/lists";

import { MainRouteName } from "@/enums/routes/MainRouteName";

import { ONE_MIN, SCREEN_SIZE } from "@/utils/constants";
import { headerFontSize } from "@/utils/constants/components/typography";

import { useDisplayUnits, usePeriodicRerender, useTodaysDrinks } from "@/hooks";
import { ScreenSize } from "@/enums/maps/ScreenSize";

const numberOfRows = SCREEN_SIZE === ScreenSize.SMALL ? 4 : 5;

function History() {
  const { t } = useTranslation();

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const drinkHistory = useTodaysDrinks();
  const { displayRoundedVolume } = useDisplayUnits();

  const totalDrinkQuantityToday = drinkHistory.reduce(
    (acc, val) => acc + displayRoundedVolume(val.quantity),
    0
  );

  const condition = drinkHistory.length > 0;
  const interval = ONE_MIN;
  usePeriodicRerender(condition, interval);

  return (
    <GradientWrapper style={styles.wrapper}>
      <View style={styles.settingsButtonWrapper}>
        <SettingsButton
          onPress={() => navigation.navigate(MainRouteName.Settings)}
        ></SettingsButton>
      </View>
      <View style={styles.tabsWrapper}>
        <PrimaryText numberOfLines={1} fontSize={headerFontSize}>
          {t("history.header")}
        </PrimaryText>
      </View>
      <CustomFlatList
        data={drinkHistory}
        rowsOfListItemsOnScreen={numberOfRows}
        wrapperStyles={styles.listWrapper}
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            // hydrationQuantity={item.hydrationQuantity}
          ></HistoryItem>
        )}
      ></CustomFlatList>
      <View style={styles.bottomWrapper}>
        <HistoryBottom
          totalDrinkQuantityToday={totalDrinkQuantityToday}
        ></HistoryBottom>
      </View>
    </GradientWrapper>
  );
}

export { History };

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  settingsButtonWrapper: {
    width: "90%",
    left: "5%",
    height: "10%",
    /**
     * Do not use alignItems
     * here, because it would
     * overwrite alignItems
     * in children which is used
     * to position the settings button
     * and the header text
     */
    justifyContent: "center",
  },
  tabsWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: "10%",
  },
  listWrapper: {
    width: "90%",
    left: "5%",
    height: "55%",
    bottom: "25%",
    position: "absolute",
  },
  bottomWrapper: {
    position: "absolute",
    width: "100%",
    height: "25%",
    bottom: 0,
  },
});
