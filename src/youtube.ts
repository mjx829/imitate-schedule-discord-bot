import { CONFIG } from "@/const";
import { log } from "@/utils/logger";
import { Cell, YoutubeVideoItem, VideoInfo } from "@/types";

const channelIconCache = new Map<string, string>();

export const fetchVideoFromIds = async (ids: string[]): Promise<VideoInfo[]> => {
    if (!ids) return [];

    let videoInfo: VideoInfo[] = [];

    for (let i = 0; i < ids.length; i += 50) {
        const chunk = ids.slice(i, i + 50);
        const url = `${CONFIG.YOUTUBE.BASE_URL}videos?id=${chunk.join(",")}&part=snippet,liveStreamingDetails&key=${CONFIG.YOUTUBE.KEY}`;
        const rowRes = await fetch(url);
        const data = await rowRes.json();

        videoInfo.push(...data.items.map((item: YoutubeVideoItem): VideoInfo => ({
            id: item.id,
            title: item.snippet.title,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            publishedAt: new Date(item.liveStreamingDetails?.scheduledStartTime || item.snippet.publishedAt),
        })));

    }

   return videoInfo;
}

/*
export const fetchChannelIconFromIds = async (ids: string[]): Promise<string> => {
    sf (
*/
