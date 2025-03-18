import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDrinkHistory, writeAsyncStorage } from "@/utils/storage";

const storeModalHandlers = (onConfirm, onCancel) => {
  window.modalHandlers = {
    onConfirm: onConfirm || (() => {}),
    onCancel: onCancel || (() => {}),
  };
};

const addDrink = async (newDrink) => {
  try {
    const history = await getDrinkHistory();
    history.push(newDrink);
    await writeAsyncStorage("drinkHistory", history);
  } catch (error) {
    console.error("Error in addDrink:", error);
  }
};

const removeDrink = async (drinkId) => {
  let history = await getDrinkHistory();
  history = history.filter((drink) => drink.id !== drinkId);

  if (!history) {
    history = [];
  }

  await writeAsyncStorage("drinkHistory", history);
};

const middleware = (store) => (next) => async (action) => {
  const result = next(action); // Call the next dispatch method in the middleware chain.
  const newState = store.getState(); // Get the new state after the action is processed.

  const actionType = action.type;
  const actionPayload = action.payload;

  const userAuthAction = actionType.startsWith("userData/setUserAuth");
  const userMetricsAction = actionType.startsWith("userData/setUserMetrics");
  const drinkHistoryAction = actionType.startsWith("drinkHistory");
  const modalAction = actionType.startsWith("modal/setModal");
  const modalContentAction = actionType.startsWith("modal/setModalContent");

  // Update AsyncStorage based on specific actions or state changes.
  if (drinkHistoryAction) {
    const action = actionType.split("drinkHistory/")[1];

    switch (action) {
      case "addToHistory":
        addDrink(actionPayload);
        break;
      case "removeFromHistory":
        removeDrink(actionPayload);
        break;
      case "setHistory":
        await writeAsyncStorage("drinkHistory", actionPayload);
        break;
    }
  }

  if (userMetricsAction) {
    await writeAsyncStorage("userMetrics", newState.userData.userMetrics);
  }

  if (userAuthAction) {
    await writeAsyncStorage("userAuth", newState.userData.userAuth);
  }

  if (
    (modalContentAction &&
      ((actionPayload.onConfirm &&
        typeof actionPayload.onConfirm === "function") ||
        (actionPayload.onCancel &&
          typeof actionPayload.onCancel === "function"))) ||
    (modalAction &&
      ((actionPayload.modalContent?.onConfirm &&
        typeof actionPayload.modalContent?.onConfirm === "function") ||
        (actionPayload.modalContent?.onCancel &&
          typeof actionPayload.modalContent?.onCancel === "function")))
  ) {
    const { onConfirm, onCancel } = actionPayload.modalContent || actionPayload;
    storeModalHandlers(onConfirm, onCancel);
    return next({ ...action });
  }

  return result;
};

export { middleware };
