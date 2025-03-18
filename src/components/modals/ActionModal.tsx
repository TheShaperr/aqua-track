import { Modal, StyleSheet, View, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ScaledSheet } from "react-native-size-matters";

import { PrimaryText } from "@/components/texts";
import { PrimaryButton } from "@/components/buttons";

import { color, shadow } from "@/utils/constants";
import { actionModalRadius } from "@/utils/constants/components";
import { animatedScaleValue, springAnimation } from "@/utils/animations";
import {
  modalPrimaryButtonFontSize,
  paragraphMediumFontSize,
} from "@/utils/constants/components/typography";

import { setModalActive } from "@/store/modal";

interface ActionModalProps {
  modalText: string;
  hasDecision?: boolean;
}

function ActionModal({ modalText, hasDecision }: ActionModalProps) {
  const { t } = useTranslation();

  const scaleValue = useRef(animatedScaleValue(0)).current;

  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(true);
  const [blurVisible, setBlurVisible] = useState(true);

  const onConfirm = window.modalHandlers?.onConfirm || (() => {});
  const onCancel = window.modalHandlers?.onCancel || (() => {});

  const closeModal = () => {
    setModalVisible(false);
    dispatch(setModalActive(false));
  };

  const handleOnConfirm = async () => {
    const configObject = { toValue: 0 };

    setBlurVisible(false);
    await springAnimation(scaleValue, configObject);

    onConfirm();
    closeModal();
    // Clear onConfirm to prevent it being saved and called again in case of multiple modals
    if (
      window.modalHandlers &&
      window.modalHandlers.onConfirm &&
      typeof window.modalHandlers.onConfirm === "function"
    )
      window.modalHandlers.onConfirm = () => {};
  };

  const handleOnCancel = async () => {
    const configObject = { toValue: 0, speed: 60 };

    setBlurVisible(false);
    await springAnimation(scaleValue, configObject);
    onCancel();
    closeModal();
  };

  useEffect(() => {
    const configObject = { toValue: 1 };
    springAnimation(scaleValue, configObject);
  }, []);

  return (
    <Modal transparent visible={modalVisible}>
      <View style={styles.centeredView}>
        {/* TODO: tint should be based on currently active mode/theme */}
        {blurVisible && (
          <BlurView style={styles.blurView} intensity={5} tint="light" />
        )}
        <Animated.View
          style={[styles.modalView, { transform: [{ scale: scaleValue }] }]}
        >
          <PrimaryText fontSize={paragraphMediumFontSize}>
            {modalText}
          </PrimaryText>
          <View style={styles.actionButtons}>
            {hasDecision && (
              <>
                <PrimaryButton
                  customStyles={scaledStyles.buttonStyles}
                  fontSize={modalPrimaryButtonFontSize}
                  btnColor={color.WHITE}
                  textStyle={{ color: color.BLUE }}
                  onPress={handleOnCancel}
                >
                  {t("modal.no")}
                </PrimaryButton>
                <PrimaryButton
                  customStyles={scaledStyles.buttonStyles}
                  fontSize={modalPrimaryButtonFontSize}
                  onPress={handleOnConfirm}
                >
                  {t("modal.yes")}
                </PrimaryButton>
              </>
            )}
            {!hasDecision && (
              <PrimaryButton
                customStyles={scaledStyles.buttonStyles}
                fontSize={modalPrimaryButtonFontSize}
                onPress={handleOnConfirm}
              >
                {t("modal.ok")}
              </PrimaryButton>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export { ActionModal };

const scaledStyles = ScaledSheet.create({
  buttonStyles: {
    width: "40%",
    margin: "10@ms",
  },
});

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: actionModalRadius,
    padding: "5%",
    ...shadow,
  },
  actionButtons: {
    justifyContent: "center",
    marginTop: "10%",
    flexDirection: "row",
  },
});
