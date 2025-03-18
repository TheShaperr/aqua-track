import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation, StackActions } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import { ContentPage } from "@/components/wrappers";
import { CustomTextField, CustomSelectBox } from "@/components/input";
import { InputContentWrapper } from "@/components/input";
import { PrimaryButton } from "@/components/buttons";

import { setUserMetrics } from "@/store/userData";

import { type UserDataState } from "@/types/store/UserDataState";

import { UserMetrics } from "@/models/UserMetrics";

import { CustomTextFieldInputType } from "@/enums/CustomTextFieldInputType";
import { Gender } from "@/enums/settings/Gender";
import { ExerciseLevel } from "@/enums/settings/ExerciseLevel";
import { MeasurementSystem } from "@/enums/settings/MeasurementSystem";

import {
  calculateDailyHydrationGoalInMl,
  convertWeightInputToKg,
  numToString,
} from "@/utils/helpers";

import { color, initialUserMetrics, inputFieldHeight } from "@/utils/constants";

import { useDisplayUnits, useModal, useSelectBoxItems } from "@/hooks";

function ProfileSettings() {
  const { t } = useTranslation();

  const { displayVolumeWithUnit, displayRoundedWeight, displayWeightUnit } =
    useDisplayUnits();

  const popAction = StackActions.pop(1);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userMetrics = useSelector(
    (state: UserDataState) => state.userData.userMetrics
  );

  const [openModal] = useModal();

  const [metricObject, setMetricObject] = useState(userMetrics);

  const {
    genderSelectBoxItems,
    measurementSystemSelectBoxItems,
    exerciseLevelSelectBoxItems,
  } = useSelectBoxItems();

  useEffect(() => {
    /* Recalculate daily water intake when weight or exercise level changes
      to make sure it is always up to date */
    recalculateDailyWaterIntakeInMl();
  }, []);

  const recalculateDailyWaterIntakeInMl = () => {
    let dailyHydrationGoalInMl = initialUserMetrics.dailyHydrationGoal;

    if (metricObject.weight && metricObject.exerciseLvl) {
      dailyHydrationGoalInMl = calculateDailyHydrationGoalInMl(
        metricObject.weight,
        metricObject.exerciseLvl
      );
    }

    const updatedMetrics: Partial<UserMetrics> = {
      dailyHydrationGoal: dailyHydrationGoalInMl,
    };
    dispatch(setUserMetrics(updatedMetrics));
  };

  const handleOnChange = <T extends keyof UserMetrics>(
    value: UserMetrics[T],
    name: T
  ) => {
    setMetricObject((prevValue) => {
      const retVal = { ...prevValue };
      retVal[name] = value;
      return retVal;
    });
  };

  const handleOnSave = () => {
    /** Validate weight input */
    if (Number(metricObject.weight) < 10 || Number(metricObject.weight) > 800) {
      openModal({
        modalText: t("validation.invalidWeight"),
      });
      return;
    }
    dispatch(setUserMetrics(metricObject));
    recalculateDailyWaterIntakeInMl();
    navigation.dispatch(popAction);
  };

  return (
    <ContentPage title={t("settings.profile.header")}>
      <InputContentWrapper style={styles.inputWrapper}>
        <CustomSelectBox
          items={genderSelectBoxItems}
          label={t("settings.profile.gender")}
          handleOnSelect={(value) => handleOnChange(value as Gender, "gender")}
          value={metricObject.gender}
        ></CustomSelectBox>
      </InputContentWrapper>
      <InputContentWrapper style={styles.inputWrapper}>
        <CustomSelectBox
          items={measurementSystemSelectBoxItems}
          label={t("settings.profile.measurementSystem")}
          handleOnSelect={(value) =>
            handleOnChange(value as MeasurementSystem, "measurementSystem")
          }
          value={metricObject.measurementSystem}
        ></CustomSelectBox>
      </InputContentWrapper>
      <InputContentWrapper>
        <CustomTextField
          inputType={CustomTextFieldInputType.Number}
          maxLength={3}
          label={t("settings.profile.weight")}
          append={t(displayWeightUnit())}
          value={numToString(displayRoundedWeight(metricObject.weight || 0))}
          // handleOnBlur={() => {
          //   if (
          //     !metricObject.weight ||
          //     metricObject.weight < 25 ||
          //     metricObject.weight > 300
          //   ) {
          //     /** Validate weight input */
          //     openModal({
          //       modalText: t("validation.invalidWeight"),
          //     });
          //   }
          // }}
          handleOnChangeText={(value) => {
            const weightInKg = convertWeightInputToKg(
              value,
              metricObject.measurementSystem || MeasurementSystem.Metric
            );
            handleOnChange(weightInKg, "weight");
          }}
        ></CustomTextField>
        {/* </View> */}
      </InputContentWrapper>
      <InputContentWrapper style={styles.inputWrapper}>
        <CustomSelectBox
          items={exerciseLevelSelectBoxItems}
          label={t("settings.profile.exercisePrompt")}
          handleOnSelect={(value) =>
            handleOnChange(value as ExerciseLevel, "exerciseLvl")
          }
          value={metricObject.exerciseLvl}
        ></CustomSelectBox>
      </InputContentWrapper>
      <InputContentWrapper>
        <CustomTextField
          fullWidth
          readOnly
          label={t("settings.profile.dailyIntake")}
          value={displayVolumeWithUnit(userMetrics.dailyHydrationGoal)}
          inputColor={color.BLUE}
        ></CustomTextField>
      </InputContentWrapper>
      <PrimaryButton onPress={handleOnSave}>
        {t("settings.profile.save").toLocaleUpperCase()}
      </PrimaryButton>
    </ContentPage>
  );
}

export { ProfileSettings };

const styles = StyleSheet.create({
  inputWrapper: {
    height: inputFieldHeight * 1.5,
  },
});
