import { GoogleSpreadsheet } from "google-spreadsheet";
import { CONFIG } from "@/const";
import { log } from "@/utils/logger";
import { auth } from "@/auth";

const initDoc = async (): Promise<GoogleSpreadsheet> => {
    const doc = new GoogleSpreadsheet(CONFIG.SPERADSHEET.SHEET_ID, auth());
    await doc.loadInfo();

    return doc;
}
