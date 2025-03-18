import { Pressable, Animated, View, StyleSheet } from "react-native";
import { useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ms } from "react-native-size-matters";

import { animateButtonPress, animatedScaleValue } from "@/utils/animations";
import { color, shadow } from "@/utils/constants";
import { settingsButtonIconSize } from "@/utils/constants/components/settings";

interface SettingsButtonProps {
  onPress: () => void;
}

function SettingsButton({ onPress }: SettingsButtonProps) {
  const scaleValue = useRef(animatedScaleValue(1)).current;

  const handleOnPressIn = () => {
    animateButtonPress(scaleValue, animatedScaleValue(0.8));
  };

  const handleOnPressOut = () => {
    animateButtonPress(scaleValue, animatedScaleValue(1));
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          { transform: [{ scale: scaleValue }] },
          styles.baseButton,
          { width: ms(48), height: ms(48), borderRadius: ms(24) },
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={handleOnPressIn}
          onPressOut={handleOnPressOut}
        >
          <Ionicons
            color={color.BLUE}
            size={settingsButtonIconSize}
            name="menu"
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

export { SettingsButton };

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  baseButton: {
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
    backgroundColor: color.WHITE,
  },
});
