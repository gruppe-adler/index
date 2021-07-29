import { generateQueryLink } from './utils/query';
import { ORG_NAME } from './utils/const';
import { getAllOrgRepos } from './utils/getAllRepos';
import { replaceAsync } from './utils';

const OTHER_TAGS_PATTERN = /<div[^>]*data-other-tags="([a-z0-9-_\s]*)"[^>]*>[^<]*<\/div>/gi;

const TOPICS_COUNT_PROMISE = (async () => {
    const allRepos = await getAllOrgRepos();

    const topicsCount = new Map<string, number>();

    for (const repo of allRepos) {
        if (repo.isArchived || repo.isPrivate) continue;

        for (const topic of repo.topics) {
            const cur = topicsCount.get(topic) ?? 0;
            topicsCount.set(topic, cur + 1);
        }
    }

    return Array.from(topicsCount.entries()).sort((a, b) => b[1] - a[1]);
})();

export async function insertOtherTopics (str: string): Promise<string> {
    return await replaceAsync(str, OTHER_TAGS_PATTERN, async (match, excludedTopicStr) => {
        const excludedTopic = excludedTopicStr.split(' ');
        const topicsCount = await TOPICS_COUNT_PROMISE;

        return topicsCount.filter(([t, c]) => c > 2 && !excludedTopic.includes(t)).map(([topic, count]) => {
            const link = generateQueryLink({ org: ORG_NAME, topics: [topic], archived: false });

            return `- <span data-topic="${topic}"></span> ${count} repositories ([search non archived](${link}))`;
        }).join('\n');
    });
}
