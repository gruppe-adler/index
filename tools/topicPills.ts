import { generateQueryLink } from './utils/query';
import { ORG_NAME } from './utils/const';

const TOPIC_LINK_PATTERN = /<span [^>]*data-topic="([a-z0-9-_]+)"[^>]*>[^<]*<\/span>/gi;

/**
 * @param {string} topic Topic
 * @returns {string}
 */
function generateTopicPill (topic: string): string {
    return `<a href="${generateQueryLink({ org: ORG_NAME, topics: [topic] })}"><img valign="middle" src="./img/topics/${topic}.svg" alt="${topic}"></a>`;
};

/**
 * Insert topic pills in string
 * @param {string} str
 * @returns {string} String with topics pills
 */
export function insertTopicPills (str: string): string {
    return str.replace(TOPIC_LINK_PATTERN, (match, topic) => {
        return generateTopicPill(topic);
    });
}
