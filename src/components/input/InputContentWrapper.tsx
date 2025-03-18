import { View, ViewStyle } from "react-native";
import { ms } from "react-native-size-matters";

interface InputContentWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function InputContentWrapper({
  style,
  children,
  ...props
}: InputContentWrapperProps) {
  return (
    <View style={[{ marginBottom: ms(20) }, style]} {...props}>
      {children}
    </View>
  );
}

export { InputContentWrapper };
