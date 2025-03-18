import {
  StyleSheet,
  View,
  TextInput,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ms, ScaledSheet } from "react-native-size-matters";

import { CustomTextFieldInputType } from "@/enums/CustomTextFieldInputType";

import { SecondaryText } from "@/components/texts";

import { color, fontFamily, inputFieldHeight } from "@/utils/constants";
import { paragraphMediumFontSize } from "@/utils/constants/components/typography";
import { customTextFieldPadding } from "@/utils/constants/components/input";

interface CustomTextFieldProps {
  value: string;
  handleOnChangeText?: (input: string) => void;
  handleOnBlur?: () => void;
  handleOnFocus?: () => void;
  label?: string;
  labelColor?: string;
  inputColor?: string;
  placeholder?: string;
  customStyles?: StyleProp<ViewStyle>;
  readOnly?: boolean;
  inputType?: CustomTextFieldInputType;
  maxLength?: number;
  append?: string;
  fullWidth?: boolean;
}

/**
 * CustomTextField Component
 *
 * A customizable text field component for React Native that supports various input types,
 * labels, and additional appended text. This component can handle input changes, focus, and
 * blur events, and can be styled according to the provided custom styles.
 *
 * @param {*} value - value of the text input
 * @param handleOnChangeText - function to call when the text input value changes
 * @param handleOnBlur - function to call when the text input loses focus
 * @param handleOnFocus - function to call when the text input gains focus
 * @param label - label text to display above the text input
 * @param labelColor - color of label text to display above the text input
 * @param placeholder - placeholder text to display inside the textfield
 * @param customStyles - custom styles to apply to the text field wrapper
 * @param readOnly - indicates if the text input should be read-only
 * @param inputType - type of the text input (e.g., number, email, password)
 * @param maxLength - maximum length of the text input
 * @param append - additional text to display at the end of the text input
 * @param fullWidth - indicates if the text input should take the full width of its container
 *
 * @returns the rendered CustomTextField component.
 *
 * @example
 *
 * <CustomTextField
 *   value={inputValue}
 *   handleOnChangeText={handleInputChange}
 *   handleOnBlur={handleInputBlur}
 *   handleOnFocus={handleInputFocus}
 *   label="Email"
 *   customStyles={{ marginVertical: 10 }}
 *   readOnly={false}
 *   inputType={CustomTextFieldInputType.Email}
 *   maxLength={50}
 *   append="@example.com"
 *   fullWidth={true}
 * />
 */
function CustomTextField({
  value,
  handleOnChangeText,
  handleOnBlur,
  handleOnFocus,
  label,
  labelColor,
  inputColor,
  placeholder,
  customStyles,
  readOnly,
  inputType,
  maxLength,
  append,
  fullWidth,
  ...props
}: CustomTextFieldProps) {
  let keyboardType: CustomTextFieldInputType = CustomTextFieldInputType.Default;
  let textAlign: TextStyle["textAlign"] = "auto";
  let isPassword = false;

  switch (inputType) {
    case undefined:
    case null:
      break;
    case CustomTextFieldInputType.Default:
      textAlign = "center";
      break;
    case CustomTextFieldInputType.Number:
      textAlign = "center";
      keyboardType = inputType;
      break;
    case CustomTextFieldInputType.Email:
      keyboardType = inputType;
      break;
    case CustomTextFieldInputType.Password:
      isPassword = true;
      break;
  }

  let textFieldWidth = "50%";

  if (fullWidth) {
    textFieldWidth = "100%";
  }

  return (
    <View
      style={[
        {
          flex: 1,
          width: textFieldWidth,
          justifyContent: "center",
        } as StyleProp<ViewStyle>,
        customStyles,
      ]}
      {...props}
    >
      <View
        style={{
          marginBottom: label ? ms(10) : 0,
          width: fullWidth ? "100%" : "50%",
        }}
      >
        {label && (
          <SecondaryText
            fontSize={paragraphMediumFontSize}
            color={labelColor ?? color.DARK_BLUE}
          >
            {label}
          </SecondaryText>
        )}
      </View>
      <View
        style={[
          scaledStyles.textInputWrapper,
          {
            paddingLeft: readOnly ? "0%" : customTextFieldPadding,
            backgroundColor: readOnly ? "" : color.WHITE,
            width: textFieldWidth,
          } as StyleProp<ViewStyle>,
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            {
              textAlign,
              width: append ? "65%" : "90%",
              color: inputColor ?? color.DARK_BLUE,
            },
          ]}
          autoCapitalize={
            keyboardType === CustomTextFieldInputType.Email
              ? "none"
              : "sentences"
          }
          readOnly={readOnly ?? false}
          keyboardType={keyboardType}
          secureTextEntry={isPassword}
          maxLength={maxLength}
          value={value}
          placeholder={placeholder}
          onChangeText={handleOnChangeText}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
        ></TextInput>
        {append && (
          <View style={styles.appendWrapper}>
            <Text style={styles.append}>{append}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export { CustomTextField };

const scaledStyles = ScaledSheet.create({
  textInputWrapper: {
    paddingRight: "10@ms",
    height: inputFieldHeight,
    flexDirection: "row",
    borderRadius: inputFieldHeight / 2,
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  appendWrapper: {
    height: "100%",
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  append: {
    textAlign: "center",
    fontFamily: fontFamily.DEFAULT,
    color: color.DARK_BLUE,
    fontSize: paragraphMediumFontSize,
  },
  textInput: {
    height: "100%",
    fontFamily: fontFamily.DEFAULT,
    color: color.DARK_BLUE,
    fontSize: paragraphMediumFontSize,
  },
});
