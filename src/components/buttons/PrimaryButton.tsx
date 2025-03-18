import {
  Pressable,
  Text,
  Animated,
  StyleSheet,
  View,
  ColorValue,
  TextStyle,
} from "react-native";
// import * as Haptics from "expo-haptics";
import { useRef } from "react";
import { ms } from "react-native-size-matters";
import { Circle } from "react-native-animated-spinkit";

import { color, fontFamily, shadow } from "@/utils/constants";
import {
  primaryButtonFontSize,
  primaryButtonRadius,
  primaryButtonWrapperHeight,
} from "@/utils/constants/components/typography/button";
import { animateButtonPress, animatedScaleValue } from "@/utils/animations";

const getTextStyle = (
  flat = false,
  fontSize = primaryButtonFontSize,
  btnColor = color.BLUE
) => ({
  ...styles.text,
  ...(flat && { color: btnColor }),
  fontSize,
});

const getButtonStyle = (
  flat?: boolean,
  pressed?: boolean,
  btnColor?: ColorValue
) => {
  let bgColor;

  if (flat) {
    bgColor = color.TRANSPARENT;
  } else {
    bgColor = btnColor || (pressed ? color.DARK_BLUE : color.BLUE);
  }

  return {
    ...styles.button,
    borderRadius: primaryButtonRadius,
    backgroundColor: bgColor,
  };
};

interface PrimaryButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  btnColor?: string;
  fontSize?: number;
  textStyle?: TextStyle;
  flat?: boolean;
  custom?: boolean;
  isLoading?: boolean;
  customStyles?: StyleSheet.NamedStyles<unknown>;
}

/**
 * PrimaryButton Component
 *
 * A customizable button component for React Native that supports custom stylesand
 * loading states. The button can be used with text
 * or custom components as its children.
 *
 * @param {*} onPress - function to call when the button is pressed
 * @param btnColor - background color of the button
 * @param fontSize - font size of the button text. Defaults to primaryButtonFontSize
 * @param textStyle - custom text styles to apply to the button text
 * @param custom - controls if the button should render custom content -- if false, the button will render text content
 * @param flat - controls if the button style should be flat
 * @param isLoading - indicates if the button should show a loading indicator
 * @param customStyles - custom styles to apply to the button wrapper
 *
 * @returns the rendered PrimaryButton component.
 *
 * @example
 * Usage:
 * <PrimaryButton
 *   onPress={handlePress}
 *   btnColor="#4CAF50"
 *   fontSize={16}
 *   textStyle={{ fontWeight: 'bold' }}
 *   custom={false}
 *   isLoading={false}
 *   customStyles={{ marginVertical: 10 }}
 * >
 *   Click Me
 * </PrimaryButton>
 */
function PrimaryButton({
  btnColor,
  onPress,
  fontSize,
  children,
  textStyle,
  custom,
  flat,
  isLoading,
  customStyles,
}: PrimaryButtonProps) {
  const scaleValue = useRef(animatedScaleValue(1)).current;

  const handleOnPressIn = () => {
    animateButtonPress(scaleValue, animatedScaleValue(0.9));
  };

  const handleOnPressOut = () => {
    animateButtonPress(scaleValue, animatedScaleValue(1));
  };

  const handlePress = () => {
    if (!isLoading) {
      onPress();
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const defaultContent = (
    <View style={styles.textWrapper}>
      <Text style={[getTextStyle(flat, fontSize, btnColor), textStyle]}>
        {children}
      </Text>
    </View>
  );

  const loadingContent = (
    <View style={styles.textWrapper}>
      {/* <ActivityIndicator size="medium" color={color.WHITE} /> */}
      <Circle size={ms(25)} color={color.WHITE}></Circle>
    </View>
  );

  const renderContent = (): React.JSX.Element | React.ReactNode => {
    if (isLoading) {
      return loadingContent;
    } else if (custom) {
      return children;
    } else {
      return defaultContent;
    }
  };

  return (
    <Animated.View
      style={[
        styles.buttonWrapper,
        {
          transform: [{ scale: scaleValue }],
        },
        customStyles,
      ]}
    >
      <Pressable
        style={({ pressed }) => getButtonStyle(flat, pressed, btnColor)}
        onPress={handlePress}
        onPressIn={handleOnPressIn}
        onPressOut={handleOnPressOut}
        disabled={isLoading}
      >
        {renderContent}
      </Pressable>
    </Animated.View>
  );
}

export { PrimaryButton };

const styles = StyleSheet.create({
  buttonWrapper: {
    justifyContent: "center",
    height: primaryButtonWrapperHeight,
    width: "100%",
  },
  textWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: fontFamily.DEFAULT,
    textAlign: "center",
    letterSpacing: ms(1.2),
    color: color.WHITE,
  },
  button: {
    paddingVertical: ms(5),
    paddingHorizontal: ms(10),
    width: "100%",
    height: "75%",
    ...shadow,
  },
});
