import { CONFIG } from "@/const";
import { log } from "@/utils/logger";
import { Cell, YoutubeVideoItem, VideoInfo } from "@/types";

export const fetchVideoFromId = async (ids: string[]): Promise<VideoInfo[]> => {
    if (!ids) return [];

    const url = `${CONFIG.YOUTUBE.BASE_URL}videos?id=${ids.join(",")}&part=snippet,liveStreamingDetails&key=${CONFIG.YOUTUBE.KEY}`;
    const rowRes = await fetch(url);
    const data = await rowRes.json();

    return data.items.map((item: YoutubeVideoItem): VideoInfo => ({
        id: item.id,
        title: item.snippet.title,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.liveStreamingDetails?.scheduledStartTime || item.snippet.publishedAt)
    }));
}
