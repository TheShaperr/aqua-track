import { View, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { ms } from "react-native-size-matters";

import { t } from "i18next";

import { ContentPage } from "@/components/wrappers";
import { PrimaryText } from "@/components/texts";
import { CustomTextField } from "@/components/input";
import { PrimaryButton } from "@/components/buttons";

import { useFirebaseAuth, useFormValidation, useModal } from "@/hooks";

import { paragraphMediumFontSize } from "@/utils/constants/components/typography";
import { color } from "@/utils/constants";
import { formErrorStyles } from "@/utils/styles";

import { CustomTextFieldInputType } from "@/enums/CustomTextFieldInputType";
import { FormInputType } from "@/enums/input/FormInputType";

function DeleteAccount() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    validateForm,
    formState,
    formErrors,
    handleInputChange,
    resetInputValidation,
  } = useFormValidation();

  const [openModal] = useModal();

  const { firebaseRemoveAccount } = useFirebaseAuth();

  const handleDeleteAccountPrompt = () => {
    if (!validateForm(false, FormInputType.Password)) return;

    openModal({
      modalText: t("settings.account.removeAccountPrompt"),
      onConfirm: handleDeleteAccount,
      hasDecision: true,
    });
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      firebaseRemoveAccount(formState.password, setIsLoading);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <ContentPage title={t("settings.account.removeAccount")}>
      <>
        <PrimaryText fontSize={paragraphMediumFontSize}>
          {t("settings.account.pwToRemoveAccount")}
        </PrimaryText>
        <CustomTextField
          customStyles={{ marginTop: ms(10) }}
          value={formState.password}
          handleOnChangeText={(text) =>
            handleInputChange(FormInputType.Password, text)
          }
          handleOnFocus={() => resetInputValidation(FormInputType.Password)}
          fullWidth
          inputType={CustomTextFieldInputType.Password}
        ></CustomTextField>
        <View style={styles.errorWrapper}>
          <Text style={styles.errorText}>{formErrors.password}</Text>
        </View>
        <PrimaryButton
          customStyles={styles.button}
          onPress={handleDeleteAccountPrompt}
          isLoading={isLoading}
          btnColor={color.RED}
        >
          {t("settings.account.removeAccount").toUpperCase()}
        </PrimaryButton>
      </>
    </ContentPage>
  );
}

export { DeleteAccount };

const styles = StyleSheet.create({
  button: {
    top: "10%",
  },
  ...formErrorStyles,
});
