import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAuth } from "firebase/auth";

import { type UserDataState } from "@/types/store/UserDataState";

import { AccountSettingsState } from "@/enums/settings/AccountSettingsState";
import { MainRouteName } from "@/enums/routes/MainRouteName";

import {
  LoginForm,
  RegisterForm,
  AccountDetails,
  ForgotPassword,
} from "@/components/settings";
import { ContentPage } from "@/components/wrappers";

import { useModal, useFirebaseAuth } from "@/hooks";

// TODO: outsource this into themes.js
// --> also use direct fontSizes for PrimaryButton, PrimaryText, etc.

function AccountSettings() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const { firebaseLogout, firebaseRemoveAccount } = useFirebaseAuth();

  // const { resetApp } = useResetApp();

  const isLoggedIn = useSelector(
    (state: UserDataState) => state.userData.userAuth.isLoggedIn
  );

  const [openModal] = useModal();

  const [loading, setLoading] = useState(false);
  const [accountSettingsState, setAccountSettingsState] = useState(
    AccountSettingsState.ShowLogin
  );

  useEffect(() => {
    if (isLoggedIn) {
      setAccountSettingsState(AccountSettingsState.ShowAccount);
    } else if (accountSettingsState === AccountSettingsState.ShowAccount) {
      setAccountSettingsState(AccountSettingsState.ShowLogin);
    }
  }, [isLoggedIn, accountSettingsState]);

  useEffect(() => {
    const getTitle = (state: AccountSettingsState) => {
      switch (state) {
        case AccountSettingsState.ShowAccount:
          return t("settings.account.accountHeader");
        case AccountSettingsState.ShowLogin:
          return t("settings.account.loginHeader");
        case AccountSettingsState.ShowRegister:
          return t("settings.account.registerHeader");
        case AccountSettingsState.ShowForgotPassword:
          return t("settings.account.forgotPwHeader");
        default:
          return t("settings.account.accountSettingsHeader");
      }
    };
    setTitle(getTitle(accountSettingsState));
  }, [accountSettingsState]);

  const [title, setTitle] = useState(t("settings.account.accountHeader"));

  const handleConfirmLogout = () => {
    firebaseLogout(/*clearLocalData*/);
    // navigation.navigate(MainRouteName.Home);
  };

  const handleConfirmRemoveAccount = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const providerId = user?.providerData[0]?.providerId;

    if (!providerId) {
      openModal({
        modalText: t("error.removeAccountErr"),
      });
      return;
    }

    // In case user is logged in with email and password
    if (providerId === "password") {
      navigation.navigate(MainRouteName.DeleteAccount);
    }

    // In case user is logged in with Apple
    else if (providerId === "apple.com") {
      openModal({
        modalText: t("settings.account.removeAccountPrompt"),
        onConfirm: () => firebaseRemoveAccount(""),
        hasDecision: true,
      });
    }

    // Fallback
    else {
      openModal({
        modalText: t("error.removeAccountErr"),
      });
    }
  };

  // const clearLocalData = async () => {
  //   setLoading(true);

  //   try {
  //     await resetApp();
  //   } catch (e) {
  //     console.error("Failed to reset store", e);
  //   }

  //   setLoading(false);
  // };

  const handleLogout = () => {
    openModal({
      modalText: t("settings.account.logoutPrompt"),
      onConfirm: handleConfirmLogout,
      hasDecision: true,
    });
  };

  const handleRemoveAccount = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const providerId = user?.providerData[0]?.providerId;

    if (!providerId) {
      openModal({
        modalText: t("error.removeAccountErr"),
      });
      return;
    }

    if (providerId === "password") {
      navigation.navigate(MainRouteName.DeleteAccount);
      return;
    }

    if (providerId === "apple.com") {
      openModal({
        modalText: t("settings.account.removeAccountPrompt"),
        onConfirm: handleConfirmRemoveAccount,
        hasDecision: true,
      });
      return;
    }
  };

  const renderAccountSettings = () => {
    switch (accountSettingsState) {
      case AccountSettingsState.ShowLogin:
        return (
          <LoginForm
            setAccountSettingsState={setAccountSettingsState}
            loading={loading}
            setLoading={setLoading}
          ></LoginForm>
        );
      case AccountSettingsState.ShowRegister:
        return (
          <RegisterForm
            setAccountSettingsState={setAccountSettingsState}
            setLoading={setLoading}
            loading={loading}
          ></RegisterForm>
        );
      case AccountSettingsState.ShowForgotPassword:
        return (
          <ForgotPassword
            setAccountSettingsState={setAccountSettingsState}
          ></ForgotPassword>
        );
      case AccountSettingsState.ShowAccount:
        return (
          <AccountDetails
            onLogout={handleLogout}
            onRemoveAccount={handleRemoveAccount}
          ></AccountDetails>
        );
    }
  };

  return (
    <ContentPage key={title} title={title}>
      {renderAccountSettings()}
    </ContentPage>
  );
}

export { AccountSettings };
