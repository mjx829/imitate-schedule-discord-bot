import { CardData, Cell } from "@/types";
import { applyFilters, hasValidUrl } from "@/filter";
import { fetchVideoFromIds, fetchChannelIconsFromIds } from "@/youtube";
import { log } from "@/utils/logger";

const YOUTUBE_URL = /^https?:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? match[1] : null;
};

export const fetchCellsInfoFromYt = async (cells: Cell[]): Promise<CardData[]> => {
    const filteredCells = applyFilters(
        cells,
        hasValidUrl(YOUTUBE_URL),
    );

    const idToCell: Map<string, Cell> = new Map(
        filteredCells.flatMap(cell => {
            const id = extractVideoId(cell.url);
            if (!id) return [];
            return [[id, cell]];
        })
    );

    const videoIds = [...idToCell.keys()];

    const videosInfo = await fetchVideoFromIds(videoIds);
    const channelsIcon = await fetchChannelIconsFromIds(videosInfo.map(v => v.channelId));

    let cards = [];

    for (const video of videosInfo) {
        const icon = channelsIcon.find(c => c.channelId === video.channelId);
        const badge = idToCell.get(video.id)?.badge;
        cards.push({
            date: video.publishedAt,
            title: video.title,
            author: video.channelTitle,
            badge: badge,
            iconUrl: icon?.iconUrl,
        });
    }

    log.write("DEBUG", `${cards.length} was fetched.`);
    
    return cards;
}
