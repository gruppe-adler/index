import { generateQueryLink } from './utils.mjs';


const TOPIC_LINK_PATTERN = /<span .*data-topic="([a-z0-9-_]+)".*>.*<\/span>/gi

/**
 * @param {string} topic Topic
 * @returns {string}
 */
const generateTopicPill = (topic) => {
    return `<a href="${generateQueryLink({ org: ORG_NAME, topics: [topic] })}"><img valign="middle" src="./img/topics/${topic}.svg"></a>`
};


/**
 * 
 * @param {string} str 
 * @returns {string}
 */
export const insertTopicPills = (str) => {
    return str.replace(TOPIC_LINK_PATTERN, (match, topic) => {
        return generateTopicPill(topic);
    });
}