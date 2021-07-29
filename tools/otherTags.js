const { generateQueryLink } = require('./utils/query');
const { ORG_NAME } = require('./utils/const');
const { getAllOrgRepos } = require('./utils/getAllRepos');
const { replaceAsync } = require('./utils');

const OTHER_TAGS_PATTERN = /<div[^>]*data-other-tags="([a-z0-9-_\s]*)"[^>]*>[^<]*<\/div>/gi

const TOPICS_COUNT_PROMISE = (async () => {
    const allRepos = await getAllOrgRepos();

    /**
     * @type {Map<string, number>}
     */
    const topicsCount = new Map();

    for (const repo of allRepos) {
        for (const topic of repo.topics) {
            const cur = topicsCount.get(topic) ?? 0;
            topicsCount.set(topic, cur + 1);
        }
    }

    return Array.from(topicsCount.entries()).sort((a, b) => b[1] - a[1]);
})();


/**
 * Insert topic pills in string
 * @param {string} str 
 * @returns {Promise<string>} String with topics pills
 */
async function insertOtherTags(str) {
    return replaceAsync(str, OTHER_TAGS_PATTERN, async (match, excludedTopicStr) => {
        const excludedTopic = excludedTopicStr.split(' ');
        const topicsCount = await TOPICS_COUNT_PROMISE;

        return topicsCount.filter(([t]) => !excludedTopic.includes(t)).map(([topic, count]) => {
            const link = generateQueryLink({ org: ORG_NAME, topics: [topic], archived: false });

            return `- <span data-topic="${topic}"></span> ${count} repositories ([search non archived](${link}))`
        }).join('\n')
    });
}

module.exports = {
    insertOtherTags
};