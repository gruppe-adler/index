import { generateQueryLink } from './utils/query';
import { ORG_NAME } from './utils/const';
import { replaceAsync } from './utils';
import { writeFileSync } from 'fs';
import { join } from 'path';
import TextToSVG from 'text-to-svg';

const TOPIC_LINK_PATTERN = /<span [^>]*data-topic="([a-z0-9-_]+)"[^>]*>[^<]*<\/span>/gi;

const VERTICAL_PADDING = 4;
const HORIZONTAL_PADDING = 8;
const FONT_SIZE = 14;

const textToSVG = TextToSVG.loadSync(join(__dirname, 'assets', 'Roboto-Regular.ttf'));

const TEXT_TO_SVG_OPTIONS = {
    fontSize: FONT_SIZE,
    anchor: 'middle center' as TextToSVG.Anchor,
    attributes: {
        fill: '#58A6FF'
    },
    y: FONT_SIZE / 2 + VERTICAL_PADDING
};

async function generateTopicImage (topic: string): Promise<{url: string; width: number; height: number }> {
    const { width: textWidth } = textToSVG.getMetrics(topic, TEXT_TO_SVG_OPTIONS);

    const width = textWidth + HORIZONTAL_PADDING * 2;
    const height = TEXT_TO_SVG_OPTIONS.fontSize + VERTICAL_PADDING * 2;

    const svgText = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="red" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 11C0 4.92487 4.92487 0 11 0H${width - 11}C${width - 4.92487} 0 ${width} 4.92487 ${width} 11C${width} 17.0751 ${width - 4.92487} 22 ${width - 11} 22H11C4.92487 22 0 17.0751 0 11Z" fill="#58A6FF" fill-opacity="0.2"/>
        ${textToSVG.getPath(topic, { ...TEXT_TO_SVG_OPTIONS, x: width / 2 })}
    </svg>
    `;

    writeFileSync(join(__dirname, '..', 'img', 'topics', `${topic}.svg`), svgText);

    return { url: `./img/topics/${topic}.svg`, width, height };
}

/**
 * @param topic Topic
 * @returns Rendered topic pill
 */
async function generateTopicPill (topic: string): Promise<string> {
    const { url, width, height } = await generateTopicImage(topic);

    return `<a href="${generateQueryLink({ org: ORG_NAME, topics: [topic] })}"><img valign="middle" src="${url}" alt="${topic}" width="${width}" height="${height}"></a>`;
};

/**
 * Insert topic pills in string
 * @param str
 * @returns String with topics pills
 */
export async function insertTopicPills (str: string): Promise<string> {
    return await replaceAsync(str, TOPIC_LINK_PATTERN, async (match, topic) => {
        return await generateTopicPill(topic);
    });
}
