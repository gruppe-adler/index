import { join } from 'path';

/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: join(__dirname, '..', '.env') });

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

    readmeText = await insertTopicPills(readmeText);

    writeFileSync(OUTPUT_PATH, readmeText);
})().catch(err => {
    console.error(err);
    process.exit(1);
});
