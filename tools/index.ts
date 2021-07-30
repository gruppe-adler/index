import { join } from 'path';
import mkdirp from 'mkdirp';

/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: join(__dirname, '..', '.env') });

import { readFileSync, writeFileSync } from 'fs';
import { insertTopicPills } from './topicPills';
import { insertRepoList } from './repoList';
import { insertOtherTopics } from './otherTopics';
import { INPUT_PATH, OUTPUT_DIR, OUTPUT_PATH } from './utils/const';

(async function () {
    let readmeText = readFileSync(INPUT_PATH, 'utf-8');

    await mkdirp(OUTPUT_DIR);
    await mkdirp(join(OUTPUT_DIR, 'img', 'topics'));
    await mkdirp(join(OUTPUT_DIR, 'img', 'repositories'));

    readmeText = await insertRepoList(readmeText);

    readmeText = await insertOtherTopics(readmeText);

    readmeText = await insertTopicPills(readmeText);

    writeFileSync(OUTPUT_PATH, readmeText);
})().catch(err => {
    console.error(err);
    process.exit(1);
});
