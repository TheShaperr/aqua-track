import { Pressable, Text, Animated, StyleSheet } from "react-native";
import { ms } from "react-native-size-matters";
import { useRef } from "react";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { color, shadow, fontFamily } from "@/utils/constants";
import { animateButtonPress } from "@/utils/animations";
import { animatedScaleValue } from "@/utils/animations/animatedScaleValue";
import {
  backButtonStyle,
  backButtonTextStyle,
} from "@/utils/constants/components/buttons";

function BackButton() {
  const { t } = useTranslation();
  const scaleValue = useRef(animatedScaleValue(1)).current;
  const navigation = useNavigation();
  const popAction = StackActions.pop(1);

  const handlePress = () => {
    navigation.dispatch(popAction);
  };

  const handleOnPressIn = () => {
    animateButtonPress(scaleValue, animatedScaleValue(0.9));
  };

  const handleOnPressOut = () => {
    animateButtonPress(scaleValue, animatedScaleValue(1));
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        style={backButtonStyle(styles.button)}
        onPress={handlePress}
        onPressIn={handleOnPressIn}
        onPressOut={handleOnPressOut}
      >
        <Text style={backButtonTextStyle(styles.text)}>
          {t("button.back").toUpperCase()}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export { BackButton };

const styles = StyleSheet.create({
  text: {
    fontFamily: fontFamily.DEFAULT,
    textAlign: "center",
    letterSpacing: ms(1.2),
    color: color.LIGHTBLUE,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
    backgroundColor: color.WHITE,
  },
});
