import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { CONFIG } from "@/const";
import { log } from "@/utils/logger";
import { auth } from "@/auth";

type RowRange = {
    offset: number,
    range: number,
}

export const initDoc = async (): Promise<GoogleSpreadsheet> => {
    const doc = new GoogleSpreadsheet(CONFIG.SPERADSHEET.SHEET_ID, auth());
    await doc.loadInfo();

    log.write("INFO", "doc wad loaded from spreadsheet.");
    return doc;
}

export const fetchSheet = async (doc: GoogleSpreadsheet, sheetTitle: string): Promise<GoogleSpreadsheetWorksheet> => {
    const sheet = doc.sheetsByTitle[sheetTitle];
    if (!sheet) throw new Error(`Sheet ${sheetTitle} was not found`);
    await sheet.loadHeaderRow();

    log.write("INFO", "sheet was loaded from spreadsheet");
    return sheet;
}

export const fetchDateColumnsRange = async (sheet: GoogleSpreadsheetWorksheet, index: string, date: string): Promise<RowRange> => {
    await sheet.loadCells(index);

    const MAX_EMPTY_CELLS_COUNT = 100;
    let emptyCellsCount = 0;

    let isCollecting = false;
    let offset = 0;
    let range = 0;

    const HEADER_ROW_OFFSET = -1;

    for (let i = 0; i < sheet.rowCount; i++) {
        const cell = sheet.getCell(i, 0);
        if (!cell) break;
        const value = cell.value;
        
        if (value) {
            emptyCellsCount = 0;
        } else {
            emptyCellsCount++;
        }
        if (emptyCellsCount > MAX_EMPTY_CELLS_COUNT) break;

        if (value === date && !isCollecting) {
            isCollecting = true;
            offset = i + HEADER_ROW_OFFSET;
        }
        if (!isCollecting) continue;

        if (value && value !== date) {
            break;
        } else {
            range++;
        }
    }

    log.write("DEBUG", "");
    return { offset, range };
}
export const fetchCellsFromRange = async (sheet: GoogleSpreadsheetWorksheet, offset: number, range: number) => {
    const rows = await sheet.getRows({ offset: offset, limit: range });

    return rows;
}

