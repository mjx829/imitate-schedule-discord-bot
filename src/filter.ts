import { Cell, CellFilter } from "@/types";

// URL制限(正規表現)
export const hasValidUrl = (pattern: RegExp) => (cell: Cell): boolean =>
    pattern.test(cell.url);

// 作者名制限
export const notInAuthorDenyList = (list: string[]) => (cell: Cell): boolean =>
    !list.includes(cell.author);

// バッジ制限
export const notInBadgeDenyList = (list: string[]) => (cell: Cell): boolean =>
    ![...cell.badge].some(char => list.includes(char));

// カテゴリ制限
export const inCategoryAllowList = (list: string[]) => (cell: Cell): boolean =>
    list.includes(cell.category);

// フィルタ本体
export const applyFilters = (cells: Cell[], ...filters: CellFilter[]): Cell[] =>
    cells.filter(cell => filters.every(filter => filter(cell)));
