import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { insertTopicPills } from './topicPills';
import { insertRepoList } from './repoList';
import { insertOtherTopics } from './otherTopics';

const INPUT_PATH = join(__dirname, '..', 'README_TEMPLATE.md');
const OUTPUT_PATH = join(__dirname, '..', 'dist', 'README.md');

(async function () {
    let readmeText = readFileSync(INPUT_PATH, 'utf-8');

    readmeText = await insertRepoList(readmeText);

    readmeText = await insertOtherTopics(readmeText);

    readmeText = insertTopicPills(readmeText);

    writeFileSync(OUTPUT_PATH, readmeText);
})().catch(err => {
    console.error(err);
    process.exit(1);
});
