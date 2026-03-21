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
    authorIconUrl: string | null,
}

export type CellFilter = (cell: Cell) => boolean;

export type ParsedDate = {
    year: string
    date: string,
    dateObj: Date,
}

export type YoutubeVideoItem = {
    id: string,
    snippet: {
        title: string,
        channelId: string,
        channelTitle: string,
        publishedAt: string,
    },
    liveStreamingDetails?: {
        scheduledStartTime?: string,
    },
}

export type VideoInfo = {
    id: string,
    title: string,
    channelId: string,
    channelTitle: string,
    publishedAt: Date,
}
