import { StyleSheet, View, Text } from "react-native";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { ScaledSheet } from "react-native-size-matters";

import { CustomTextField } from "@/components/input";
import { PrimaryText } from "@/components/texts";
import { PrimaryButton } from "@/components/buttons";

import { paragraphVerySmallFontSize } from "@/utils/constants/components/typography";
import { formErrorStyles } from "@/utils/styles";

import { CustomTextFieldInputType } from "@/enums/CustomTextFieldInputType";
import { AccountSettingsState } from "@/enums/settings/AccountSettingsState";
import { FormInputType } from "@/enums/input/FormInputType";

import { useFormValidation, useModal } from "@/hooks";

interface ForgotPasswordProps {
  setAccountSettingsState: (accountSettinsState: AccountSettingsState) => void;
}

function ForgotPassword({ setAccountSettingsState }: ForgotPasswordProps) {
  const { t } = useTranslation();
  const [openModal] = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    validateForm,
    formState,
    formErrors,
    handleInputChange,
    resetInputValidation,
  } = useFormValidation();
  const auth = getAuth();

  const handleSendPasswordResetEmail = async () => {
    if (!validateForm(false, FormInputType.Email)) return;

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, formState.email);
      setIsLoading(false);

      openModal({
        modalText: t("settings.account.forgotPw.confEmailSentSucc"),
        onConfirm: () =>
          setAccountSettingsState(AccountSettingsState.ShowLogin),
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      openModal({
        modalText: t("settings.account.forgotPw.confEmailSentFail"),
      });
    }
  };

  return (
    <>
      <PrimaryText fontSize={paragraphVerySmallFontSize}>
        {t("settings.account.forgotPw.infoText")}
      </PrimaryText>
      <CustomTextField
        customStyles={scaledStyles.textField}
        value={formState.email}
        handleOnChangeText={(text) =>
          handleInputChange(FormInputType.Email, text)
        }
        handleOnFocus={() => resetInputValidation(FormInputType.Email)}
        inputType={CustomTextFieldInputType.Email}
        fullWidth
      ></CustomTextField>
      <View style={styles.errorWrapper}>
        <Text style={styles.errorText}>{formErrors.email}</Text>
      </View>
      <PrimaryButton
        isLoading={isLoading}
        onPress={handleSendPasswordResetEmail}
      >
        {t("settings.account.forgotPw.sendConfEmail").toUpperCase()}
      </PrimaryButton>
    </>
  );
}

export { ForgotPassword };

const scaledStyles = ScaledSheet.create({
  textField: {
    marginVertical: "10@ms",
  },
});

const styles = StyleSheet.create({
  ...formErrorStyles,
});
