import { RowRange, Cell, ParsedDate } from "@/types";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { CONFIG } from "@/const";
import { log } from "@/utils/logger";
import { auth } from "@/auth";

const initDoc = async (): Promise<GoogleSpreadsheet> => {
    const doc = new GoogleSpreadsheet(CONFIG.SPERADSHEET.SHEET_ID, auth());
    await doc.loadInfo();

    log.write("INFO", "doc wad loaded from spreadsheet.");
    return doc;
}

const fetchSheet = async (doc: GoogleSpreadsheet, sheetTitle: string): Promise<GoogleSpreadsheetWorksheet> => {
    const sheet = doc.sheetsByTitle[sheetTitle];
    if (!sheet) throw new Error(`Sheet ${sheetTitle} was not found`);
    await sheet.loadHeaderRow();

    log.write("INFO", "sheet was loaded from spreadsheet");
    return sheet;
}

const fetchDateColumnsRange = async (sheet: GoogleSpreadsheetWorksheet, index: string, date: string): Promise<RowRange> => {
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
    
    return { offset, range };
}

const fetchCellsFromRange = async (sheet: GoogleSpreadsheetWorksheet, offset: number, range: number) => {
    const rows = await sheet.getRows({ offset: offset, limit: range });

    return rows;
}

const parseDate = (date: Date): ParsedDate => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return {
        year: String(year),
        date: `${month}/${day}`,
        dateObj: date,
    }
}

const parseCellsRows = (rows: GoogleSpreadsheetRow<Record<string, any>>[], date: ParsedDate): Cell[] => {
    let parsedRows = [];
    for (const row of rows) {
        parsedRows.push({
            date: date.dateObj,
            title: String(row.get(CONFIG.SPERADSHEET.HEADER.TITLE)),
            author: String(row.get(CONFIG.SPERADSHEET.HEADER.AUTHOR)),
            badge: String(row.get(CONFIG.SPERADSHEET.HEADER.BADGE)),
            category: String(row.get(CONFIG.SPERADSHEET.HEADER.CATEGORY)),
            url: String(row.get(CONFIG.SPERADSHEET.HEADER.URL)),
            publishedAt: null,
        });
    }

    return parsedRows;
}

export const fetchCellsFromDate = async (date: Date): Promise<Cell[]> => {
    const parsedDate = parseDate(date);
    const doc = await initDoc();
    const sheet = await fetchSheet(doc, parsedDate.year);
    const range = await fetchDateColumnsRange(sheet, "A:A", parsedDate.date);
    const rows = await fetchCellsFromRange(sheet, range.offset, range.range);

    if (!rows) return [];
    const cells = parseCellsRows(rows, parsedDate);

    return cells;
}
