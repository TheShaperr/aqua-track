import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { GradientWrapper } from "@/components/wrappers";
import { PrimaryText } from "@/components/texts";
import { PrimaryButton } from "@/components/buttons";
import { CustomSelectBox, CustomTextField } from "@/components/input";

import { startupStyles } from "@/utils/constants";
import { paragraphMediumFontSize } from "@/utils/constants/components/typography";
import { convertWeightInputToKg, numToString } from "@/utils/helpers";

import { useDisplayUnits, useFormValidation, useModal } from "@/hooks";

import { FormInputType } from "@/enums/input/FormInputType";
import { StartupRouteName } from "@/enums/routes/StartupRouteName";
import { CustomTextFieldInputType } from "@/enums/CustomTextFieldInputType";
import { MeasurementSystem } from "@/enums/settings/MeasurementSystem";

import { setUserAuth, setUserMetrics } from "@/store/userData";

import { UserMetrics } from "@/models/UserMetrics";
import { SelectBoxItem } from "@/models/SelectBoxItem";
import { UserAuth } from "@/models/UserAuth";

import { type UserDataState } from "@/types/store/UserDataState";

interface AskWrapperProps {
  question: string;
  inputType: FormInputType;
  nextRoute: StartupRouteName;
  selectBoxItems?: SelectBoxItem[];
}

/**
 * AskWrapper Component
 *
 * A reusable component designed to display a question to the user
 * and prompt them for input, such as a username, weight, or selection from a list.
 *
 * The component dynamically renders different types of input fields based on the
 * `inputType` passed to it and manages the input state internally. It also validates
 * the input using a custom validation hook and dispatches the data to the Redux store
 * upon user confirmation.
 *
 * @param {*} question - question to be displayed to the user
 * @param {*} inputType - type of input expected from the user (e.g., Weight, Username)
 * @param {*} nextRoute - route to navigate to after user clicks on continue button
 * @param selectBoxItems - array of items for select box input types
 *
 * @returns a view component that includes a question, input field, validation error message,
 * and a continue button that navigates to the next route upon successful input.
 *
 * @example
 *
 * <AskWrapper
 *  question={"Do you do exercise?"}
 *  inputType={FormInputType.ExerciseLvl}
 *  nextRoute={StartupRouteName.CalcIntake}
 *  selectBoxItems={[
 *      { id: "no", label: "No" },
 *      { id: "sometimes", label: "Sometimes" },
 *      { id: "often", label: "Often" },
 *  ]}
 * />
 */

function AskWrapper({
  question,
  inputType,
  nextRoute,
  selectBoxItems,
}: AskWrapperProps) {
  const { t } = useTranslation();

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const dispatch = useDispatch();
  const [openModal] = useModal();

  const [input, setInput] = useState<string | number | null>(null);

  const measurementSystem = useSelector(
    (state: UserDataState) => state.userData.userMetrics.measurementSystem
  );

  const { displayRoundedWeight, displayWeightUnit } = useDisplayUnits();

  const {
    validateForm,
    formState,
    formErrors,
    handleInputChange,
    resetInputValidation,
  } = useFormValidation();

  /** Set default input value on component mount */
  useEffect(() => {
    if (selectBoxItems && !input) {
      setInput(selectBoxItems[0]!.id);
    }
  }, [selectBoxItems]);

  /** Display validation error message when there is an error */
  useEffect(() => {
    formErrors[inputType] &&
      openModal({ modalText: formErrors[inputType] || "" });
  }, [formErrors]);

  /**
   * Render a selectbox or a textfield dynamically
   */
  const renderInputField = () => {
    if (selectBoxItems) {
      return (
        <CustomSelectBox
          isVertical
          items={selectBoxItems}
          handleOnSelect={(value) => setInput(value)}
          value={input || t(selectBoxItems[0]!.id)} // If there is no input yet, take first object of select array
        ></CustomSelectBox>
      );
    }

    if (inputType === FormInputType.Weight) {
      return (
        <CustomTextField
          fullWidth
          inputType={CustomTextFieldInputType.Number}
          maxLength={3}
          append={t(displayWeightUnit())}
          value={numToString(displayRoundedWeight(formState.weight || 0))}
          handleOnChangeText={(value) => {
            const weightInKg = convertWeightInputToKg(
              value,
              measurementSystem || MeasurementSystem.Metric
            );
            setInput(value);
            handleInputChange(FormInputType.Weight, weightInKg.toString());
          }}
          handleOnFocus={() => resetInputValidation(FormInputType.Weight)}
        />
      );
    }

    return (
      <CustomTextField
        value={String(
          formState[inputType as keyof typeof formState] || input || ""
        )}
        inputType={CustomTextFieldInputType.Default}
        handleOnChangeText={(text) => {
          setInput(text);
          handleInputChange(inputType, text);
        }}
        handleOnFocus={() => resetInputValidation(inputType)}
        customStyles={{ height: "100%" }}
        fullWidth
      />
    );
  };

  /**
   * Save user input to the redux store
   * and then navigate to the next route
   */
  const handleSaveInput = async () => {
    if (!validateForm(false, inputType)) return;

    let valueToStore = input;

    /**
     * Convert weight input to kg if the user is using the imperial system
     * to ensure proper storage in the redux store and in the database
     */
    if (
      inputType === FormInputType.Weight &&
      measurementSystem === MeasurementSystem.Imperial
    ) {
      valueToStore = convertWeightInputToKg(String(input), measurementSystem);
    }

    if (inputType === FormInputType.Username) {
      const updatedUserAuth: Partial<UserAuth> = {
        userName: String(valueToStore || "Jordan Doe"),
      };

      dispatch(setUserAuth(updatedUserAuth));
    } else {
      const updatedMetrics: Partial<UserMetrics> = {
        [inputType]: valueToStore,
      };
      dispatch(setUserMetrics(updatedMetrics));
    }
    navigation.navigate(nextRoute);
  };

  // const toLoginForm = () => {
  //   navigation.navigate(StartupRouteName.LoginScreen);
  // };

  return (
    <GradientWrapper style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <ScrollView
              alwaysBounceVertical={false}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={startupStyles.wrapper}>
                <View style={styles.questionWrapper}>
                  <PrimaryText fontSize={paragraphMediumFontSize}>
                    {question}
                  </PrimaryText>
                </View>
                <View style={styles.inputFieldWrapper}>
                  {renderInputField()}
                </View>
                <View style={styles.continueButtonWrapper}>
                  <PrimaryButton onPress={handleSaveInput}>
                    {t("button.continue")}
                  </PrimaryButton>
                </View>
              </View>
            </ScrollView>

            {/* TODO: Temporarily disabled already has an account feature */}
            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                paddingBottom: "5%",
              }}
            >
              <PrimaryButton onPress={toLoginForm} flat>
                {t("settings.profile.alreadyHasAccount")}
              </PrimaryButton>
            </View> */}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GradientWrapper>
  );
}

export { AskWrapper };

const styles = StyleSheet.create({
  questionWrapper: {
    height: "30%",
    justifyContent: "center",
  },
  inputFieldWrapper: {
    height: "40%",
    width: "100%",
    justifyContent: "center",
  },
  continueButtonWrapper: {
    height: "30%",
    justifyContent: "center",
  },
});
