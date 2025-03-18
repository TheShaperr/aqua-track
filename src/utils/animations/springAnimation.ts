import { Animated } from "react-native";

const springAnimation = (
  scaleValue: Animated.Value,
  confObj?: Partial<Animated.SpringAnimationConfig>,
  callback?: () => void
) => {
  const defaultConfig: Animated.SpringAnimationConfig = {
    toValue: 0,
    speed: 30,
    useNativeDriver: true,
  };

  const finalConfig = { ...defaultConfig, ...confObj };

  // If a callback is provided, use it
  if (callback) {
    Animated.spring(scaleValue, finalConfig).start(() => {
      callback();
    });
    return;
  }

  // Otherwise, resolve the promise
  return new Promise((resolve) => {
    Animated.spring(scaleValue, finalConfig).start(() => {
      resolve(true);
    });
  });
};

export { springAnimation };
