export type RowRange = {
    offset: number,
    range: number,
}

export type Cell = {
    date: Date,
    title: string,
    author: string,
    badge: string,
    category: string,
    url: string,
    publishedAt: Date | null,
}

export type ParsedDate = {
    year: string
    date: string,
    dateObj: Date,
}
