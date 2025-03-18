import { type UID } from "@/types/UID";
import { type UnixDate } from "@/types/UnixDate";

export interface DrinkHistoryItem {
  id: UID;
  quantity: number;
  date: UnixDate;
  typeID: number;
}
