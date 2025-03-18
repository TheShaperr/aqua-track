import { StyleSheet, View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { ms, ScaledSheet } from "react-native-size-matters";

import { color, fontFamily, inputFieldHeight } from "@/utils/constants";
import { paragraphMediumFontSize } from "@/utils/constants/components/typography";

import { SelectBoxItem } from "@/models/SelectBoxItem";

import { SecondaryText } from "@/components/texts";

interface CustomSelectBoxProps<T> {
  value: T;
  items: SelectBoxItem[];
  handleOnSelect: (value: string) => void;
  isVertical?: boolean;
  label?: string;
}

/**
 * A reusable component that renders a list of selectable items (select boxes).
 * It allows the user to select one item from a list, with the selected item visually highlighted.
 * The component is fully customizable and supports dynamic data and styling.
 *
 * @template T - The type of the value prop.
 *
 * @param {*} value - currently selected value
 * @param {*} items - array of objects representing the selectable items -> each item should have a unique `id` and a `label` string
 * @param {*} handleOnSelect - callback function that is triggered when an item is selected -> function receives the `id` of the selected item as an argument
 * @param isVertical - if true, the selection box will be displayed vertically
 * @param label - label to display above the selection box list
 *
 * @returns a JSX element that renders the custom select box component
 *
 * @example
 *
 * <CustomSelectBox
 *   value={selectedItem}
 *   items={[
 *     { id: "op1", label: "Option 1" },
 *     { id: "op2", label: "Option 2" },
 *     { id: "op3", label: "Option 3" },
 *   ]}
 *   handleOnSelect={(selectedValue) => {
 *     console.log("Selected:", selectedValue);
 *   }}
 *   isVertical
 *   label="Choose an Option"
 * />
 */

function CustomSelectBox<T>({
  value,
  items,
  handleOnSelect,
  isVertical,
  label,
}: CustomSelectBoxProps<T>) {
  const [selectedItemId, setSelectedItemId] = useState("-1");

  useEffect(() => {
    if (value) {
      const selectedItem = items.find((item) => item.id === value);
      if (selectedItem) {
        setSelectedItemId(selectedItem.id);
      }
    }
  }, [value, items]);

  const handleOnPress = (itemId: string) => {
    setSelectedItemId(itemId);
    handleOnSelect(itemId);
  };

  return (
    <>
      {label && (
        <View style={scaledStyles.labelWrapper}>
          <SecondaryText
            fontSize={paragraphMediumFontSize}
            color={color.DARK_BLUE}
          >
            {label}
          </SecondaryText>
        </View>
      )}
      <View
        style={{
          flexDirection: isVertical ? "column" : "row",
          flex: 1,
        }}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.selectBoxItemWrapper,
              {
                left: isVertical ? "10%" : "0%",
                width: isVertical ? "80%" : `${(100 / items.length) * 0.95}%`,
                height: isVertical ? "90%" : "100%",
                marginBottom: isVertical ? ms(10) : "0%",
                marginHorizontal: ms(5),
                backgroundColor:
                  selectedItemId === item.id ? color.BLUE : color.WHITE,
              },
            ]}
            onPress={() => handleOnPress(item.id)}
          >
            <Text
              style={[
                styles.selectBoxText,
                {
                  color:
                    selectedItemId === item.id ? color.WHITE : color.LIGHTBLUE,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

export { CustomSelectBox };

const scaledStyles = ScaledSheet.create({
  labelWrapper: {
    width: "100%",
    marginBottom: "5@ms",
  },
});

const styles = StyleSheet.create({
  selectBoxItemWrapper: {
    borderRadius: inputFieldHeight / 2,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  selectBoxText: {
    fontSize: paragraphMediumFontSize,
    fontFamily: fontFamily.DEFAULT,
  },
});
