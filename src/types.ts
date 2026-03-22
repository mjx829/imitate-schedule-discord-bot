export type CardData = {
    date: Date,
    title: string,
    author: string,
    badge?: string,
    iconUrl?: string,
}

// spreadsheet

export type RowRange = {
    offset?: number,
    range?: number,
}

export type Cell = {
    date: Date,
    title: string,
    author: string,
    badge: string,
    category: string,
    url: string,
}

export type CellFilter = (cell: Cell) => boolean;

export type ParsedDate = {
    year: string
    date: string,
    dateObj: Date,
}

// youtube

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
export type YoutubeChannelItem = {
    id: string,
    snippet: {
        title: string,
        thumbnails: {
            high: {
                url: string,
            },
        },
    },
}

export type VideoInfo = {
    id: string,
    title: string,
    channelId: string,
    channelTitle: string,
    publishedAt: Date,
}
export type ChannelIcon = {
    channelId: string,
    iconUrl: string,
}
