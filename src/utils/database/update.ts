import {
  DocumentData,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "../../../firebase";
import { DrinkHistoryItem } from "@/models/DrinkHistoryItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { readAsyncStorage, writeAsyncStorage } from "@/utils/storage";

import { type UID } from "@/types/UID";

const LOCAL_DRINKS_TO_ADD_KEY = "localDrinksToAddSync";
const LOCAL_DRINKS_TO_REMOVE_KEY = "localDrinksToRemoveSync";

/**
 * This function syncs data to the Firestore database
 *
 * @param {*} userId - Firestore ID of currently logged in user
 * @param {*} data - data to sync to the database
 */
const updateUserData = async <T extends DocumentData>(
  userId: string,
  data: T
) => {
  const userDocRef = doc(firestore, "users", userId);
  try {
    await setDoc(userDocRef, data, { merge: true }); // Merges data with existing document
    console.log("--------------");
    console.log("Document successfully updated!");
    console.log("--------------");
  } catch (error) {
    console.log("--------------");
    console.error("Error updating document:", error);
    console.log("--------------");
  }
};

/**
 * This function dispatches an action to add a drink to the local Redux store.
 * If the user is currently logged in, it also attempts to update the user's
 * drink history in the database.
 * In the event of no internet connection,
 * the drink will be saved locally and will automatically sync with the
 * database once the internet connection is restored.
 *
 * @param {*} userId - Firestore ID of currently logged in user
 * @param {*} drink - drink object to be saved
 * @param {*} isInternetReachable - flag indicating internet connection
 */
const addDrinkToUserHistory = async (
  userId: UID,
  drink: DrinkHistoryItem,
  isInternetReachable: boolean
) => {
  if (!isInternetReachable) {
    let drinksToSync: DrinkHistoryItem[] | null = await readAsyncStorage(
      LOCAL_DRINKS_TO_ADD_KEY
    );

    if (drinksToSync === null) {
      drinksToSync = [];
    }

    drinksToSync.push(drink);

    await writeAsyncStorage(LOCAL_DRINKS_TO_ADD_KEY, drinksToSync);
    return;
  }

  const userDocRef = doc(firestore, "users", userId);
  const drinkItem = { userDrinkHistory: arrayUnion(drink) };

  try {
    await updateDoc(userDocRef, drinkItem);
  } catch (error) {
    console.error("Error adding drink:", error);
  }
};

/**
 * This function dispatches an action to remove a drink to the local Redux store.
 * If the user is currently logged in, it also attempts to remove the user's
 * drink in the database.
 * In the event of no internet connection,
 * the drink to remove will be saved locally and will automatically sync with the
 * database once the internet connection is restored.
 *
 * @param {*} userId - Firestore ID of currently logged in user
 * @param {*} drink - drink object to be removed
 * @param {*} isInternetReachable - flag indicating internet connection
 */
const removeDrinkFromUserHistory = async (
  userId: UID,
  drink: DrinkHistoryItem,
  isInternetReachable: boolean
) => {
  if (!isInternetReachable) {
    let drinksToSync: DrinkHistoryItem[] | null = await readAsyncStorage(
      LOCAL_DRINKS_TO_REMOVE_KEY
    );

    /** Fetch the locally stored drinks that are pending synchronization with the database */
    const drinksToAdd: DrinkHistoryItem[] | null = await readAsyncStorage(
      LOCAL_DRINKS_TO_ADD_KEY
    );

    if (drinksToSync === null) {
      drinksToSync = [];
    }

    if (drinksToAdd && drinksToAdd.length > 0) {
      const filteredDrinksToAdd = drinksToAdd.filter(
        (drinkItem) => drinkItem.id !== drink.id
      );

      /**
       * If the drink to be removed is found in the list of drinks pending addition,
       * remove it from the pending additions. This ensures it will not be synced
       * to the database later.
       */
      if (filteredDrinksToAdd.length < drinksToAdd.length) {
        await writeAsyncStorage(LOCAL_DRINKS_TO_ADD_KEY, filteredDrinksToAdd);
        return;
      }
    }

    drinksToSync.push(drink);

    await writeAsyncStorage(LOCAL_DRINKS_TO_REMOVE_KEY, drinksToSync);
    return;
  }

  const drinkId = drink.id;

  const userDocRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists) {
    console.error("No such document!");
    return;
  }

  const drinkHistory = userDoc.data()?.userDrinkHistory || [];
  const drinkToRemove = drinkHistory.find(
    (drink: DrinkHistoryItem) => drink.id === drinkId
  );

  if (drinkToRemove) {
    try {
      await updateDoc(userDocRef, {
        userDrinkHistory: arrayRemove(drinkToRemove),
      });
    } catch (error) {
      console.error("Error removing drink:", error);
    }
  } else {
    console.error("Drink not found in history!");
  }
};

/**
 * Syncs locally saved drink history changes to the user's database record.
 *
 * This function reads locally saved drink history additions and deletions from
 * async storage and applies these changes to the user's document in Firestore.
 * After successfully updating the Firestore document, the local storage keys
 * are cleared.
 *
 * @param {*} userId - Firestore ID of currently logged in user
 */
const syncSavedChangesToDatabase = async (userId: string) => {
  let drinksToAdd: DrinkHistoryItem[] | null = await readAsyncStorage(
    LOCAL_DRINKS_TO_ADD_KEY
  );
  let drinksToRemove: string[] | null = await readAsyncStorage(
    LOCAL_DRINKS_TO_REMOVE_KEY
  );

  if (!drinksToAdd && !drinksToRemove) {
    return;
  }

  const userDocRef = doc(firestore, "users", userId);

  if (drinksToAdd && drinksToAdd.length > 0) {
    const updates = {
      userDrinkHistory: arrayUnion(...drinksToAdd),
    };

    await updateDoc(userDocRef, updates);
    await AsyncStorage.removeItem(LOCAL_DRINKS_TO_ADD_KEY);
  }

  if (drinksToRemove && drinksToRemove.length > 0) {
    const updates = {
      userDrinkHistory: arrayRemove(...drinksToRemove),
    };
    await updateDoc(userDocRef, updates);
    await AsyncStorage.removeItem(LOCAL_DRINKS_TO_REMOVE_KEY);
  }
};

export {
  updateUserData,
  removeDrinkFromUserHistory,
  addDrinkToUserHistory,
  syncSavedChangesToDatabase,
};
