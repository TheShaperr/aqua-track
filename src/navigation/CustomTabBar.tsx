import { View, Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { TabNavigationState, ParamListBase } from "@react-navigation/native";
import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";
import { NavigationHelpers } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ScaledSheet } from "react-native-size-matters";

import { WaterDropButton } from "@/components/navigation";

import { color, shadow, fontFamily } from "@/utils/constants";
import {
  customTabBarFontSize,
  customTabBarRadius,
} from "@/utils/constants/components";

import { DrinkRouteName } from "@/enums/routes/DrinkRouteName";
import { MainRouteName } from "@/enums/routes/MainRouteName";

interface CustomTabBarProps {
  state: TabNavigationState<ParamListBase>;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}

function CustomTabBar({ state, navigation }: CustomTabBarProps) {
  const { t } = useTranslation();

  return (
    <View style={[{ flexDirection: "row" }, scaledStyles.navigationBar]}>
      {state.routes.map((route, index) => {
        let label = "";

        switch (route.name) {
          case MainRouteName.Home:
            label = t("tabBar.home");
            break;
          case MainRouteName.History:
            label = t("tabBar.history");
            break;
        }

        const isFocused = state.index === index;

        const dynamicBgStyle = {
          backgroundColor: isFocused ? color.LIGHTBLUE : color.WHITE,
        };

        const dynamicTextStyle = {
          color: isFocused ? color.WHITE : color.LIGHTBLUE,
        };

        const onPress = () => {
          if (!isFocused) {
            if (route.name === DrinkRouteName.DrinkInput) {
              navigation.navigate(DrinkRouteName.DrinkSelection); // Update the navigation target for AddDrink
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        // Render the WaterDropButton for the AddDrink tab
        if (route.name === DrinkRouteName.DrinkInput) {
          return (
            <WaterDropButton
              style={scaledStyles.waterDropButton as ViewStyle}
              key={label}
              onPress={onPress}
            />
          );
        } else {
          // Render standard button for other tabs
          return (
            <Pressable
              key={label}
              onPress={onPress}
              style={scaledStyles.wrapper}
            >
              <View style={[styles.container, dynamicBgStyle]}>
                <Text
                  style={[
                    scaledStyles.text,
                    dynamicTextStyle,
                    { fontSize: customTabBarFontSize },
                  ]}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        }
      })}
    </View>
  );
}

export { CustomTabBar };

const scaledStyles = ScaledSheet.create({
  wrapper: {
    flex: 1,
    padding: "9@ms",
  },
  navigationBar: {
    position: "absolute",
    bottom: "10@ms",
    left: "5%",
    backgroundColor: color.WHITE,
    ...shadow,
    borderRadius: customTabBarRadius,
    height: "60@ms",
    width: "90%",
  },
  text: {
    fontFamily: fontFamily.DEFAULT,
    textTransform: "uppercase",
  },
  waterDropButton: {
    bottom: "39@ms",
  },
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    borderRadius: customTabBarRadius,
    justifyContent: "center",
    alignItems: "center",
  },
});
