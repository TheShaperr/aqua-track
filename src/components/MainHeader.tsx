import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { PrimaryText } from "@/components/texts";

import { FONT_SIZE_24 } from "@/utils/constants";

function MainHeader() {
  const { t } = useTranslation();

  return (
    <View style={{ alignItems: "center" }}>
      <PrimaryText numberOfLines={1} fontSize={FONT_SIZE_24}>
        {t("home.header")}
      </PrimaryText>
    </View>
  );
}

export { MainHeader };
