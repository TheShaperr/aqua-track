import { StyleSheet, View } from "react-native";

import { BackButton } from "@/components/buttons";
import { PrimaryText } from "@/components/texts";
import { SettingsItem } from "@/components/settings/SettingsItem";
import { GradientWrapper } from "@/components/wrappers";
import { CustomFlatList } from "@/components/lists";
import { useTranslation } from "react-i18next";

import { settingsList } from "@/utils/maps";
import { headerFontSize } from "@/utils/constants/components/typography";
import { SCREEN_SIZE } from "@/utils/constants";
import { ScreenSize } from "@/enums/maps/ScreenSize";

const numberOfRows = SCREEN_SIZE === ScreenSize.SMALL ? 7 : 8;

function SettingsList() {
  const { t } = useTranslation();

  return (
    <GradientWrapper style={styles.wrapper}>
      <View style={styles.backButtonWrapper}>
        <BackButton />
      </View>
      <View style={styles.headerWrapper}>
        <PrimaryText numberOfLines={1} fontSize={headerFontSize}>
          {t("settings.header")}
        </PrimaryText>
      </View>
      <CustomFlatList
        data={settingsList}
        rowsOfListItemsOnScreen={numberOfRows}
        wrapperStyles={styles.settingsListWrapper}
        renderItem={({ item }) => (
          <SettingsItem
            imageSrc={item.imageSrc}
            title={t(item.title)}
            routeName={item.routeName}
          />
        )}
      ></CustomFlatList>
    </GradientWrapper>
  );
}

export { SettingsList };

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  backButtonWrapper: {
    width: "90%",
    left: "5%",
    height: "10%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerWrapper: {
    height: "10%",
    width: "90%",
    left: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsListWrapper: {
    width: "90%",
    left: "5%",
    flex: 1,
  },
});
