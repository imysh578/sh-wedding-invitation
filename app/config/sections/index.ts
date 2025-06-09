import { hero } from "./hero";
import { invitation } from "./invitation";
import { weddingDay } from "./weddingDay";
import { gallery } from "./gallery";
import { account } from "./account";
import { location } from "./location";
import { notice } from "./notice";
import { Section } from "../../types";

export { hero, invitation, weddingDay, gallery, account, location };

export const sections: Section[] = [invitation, weddingDay, gallery, account, notice];
