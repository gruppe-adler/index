const { generateQueryLink } = require('./query');
const { ORG_NAME } = require('./const');

const TOPIC_LINK_PATTERN = /<span [^>]*data-topic="([a-z0-9-_]+)"[^>]*>[^<]*<\/span>/gi

/**
 * @param {string} topic Topic
 * @returns {string}
 */
function generateTopicPill(topic) {
    return `<a href="${generateQueryLink({ org: ORG_NAME, topics: [topic] })}"><img valign="middle" src="./img/topics/${topic}.svg"></a>`
};


/**
 * Insert topic pills in string
 * @param {string} str 
 * @returns {string} String with topics pills
 */
function insertTopicPills(str) {
    return str.replace(TOPIC_LINK_PATTERN, (match, topic) => {
        return generateTopicPill(topic);
    });
}

module.exports = {
    insertTopicPills
};