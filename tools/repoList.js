const { writeFileSync } = require('fs');
const { join } = require('path');
const { ORG_NAME } = require('./const');
const { getAllOrgRepos } = require('./getAllRepos');
const { replaceAsync, includesAll } = require('./utils');

const REPO_LIST_PATTERN = /<div [^>]*data-list="([a-z0-9-_\s]+)"[^>]*>[^<]*<\/div>/gi

/**
 * @param {Object[]} repositories Repository names
 * @returns {Promise<string>} Rendered list
 */
async function generateList(repositories) {
    return `<p align="center">\n${(await Promise.all(repositories.map(renderRepo))).join('\n')}\n</p>`;
}

/**
 * @param repo Repository name
 * @returns {Object} Rendered repository
 * @returns {Promise<string>} Rendered repo
 */
async function renderRepo(repo) {
    const { name, description } = repo;

    const url = await generateRepoImage(name, description);

    const str = `<a href="https://github.com/${ORG_NAME}/${name}"><img src="${url}"></a>`;

    return str;
}

async function generateRepoImage(name, description) {
    const svgText = `
    <svg width="384" height="154" viewBox="0 0 384 154" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.5 28.2917C24.5 27.6839 24.7414 27.101 25.1712 26.6712C25.601 26.2414 26.1839 26 26.7917 26H38.875C39.0408 26 39.1997 26.0658 39.3169 26.1831C39.4342 26.3003 39.5 26.4592 39.5 26.625V43.7083C39.5 43.8741 39.4342 44.0331 39.3169 44.1503C39.1997 44.2675 39.0408 44.3333 38.875 44.3333H33.875C33.7092 44.3333 33.5503 44.2675 33.4331 44.1503C33.3158 44.0331 33.25 43.8741 33.25 43.7083C33.25 43.5426 33.3158 43.3836 33.4331 43.2664C33.5503 43.1492 33.7092 43.0833 33.875 43.0833H38.25V39.75H27C26.6685 39.75 26.3505 39.8817 26.1161 40.1161C25.8817 40.3505 25.75 40.6685 25.75 41V41.625C25.75 42.2217 26.1083 42.7367 26.625 42.9625C26.7718 43.032 26.8857 43.156 26.9427 43.3081C26.9997 43.4603 26.9952 43.6286 26.9302 43.7774C26.8652 43.9263 26.7448 44.044 26.5945 44.1056C26.4442 44.1672 26.2758 44.1679 26.125 44.1075C25.642 43.8967 25.2309 43.5495 24.9423 43.1086C24.6537 42.6676 24.4999 42.152 24.5 41.625V28.2917ZM38.25 27.25V38.5H27C26.545 38.5 26.1175 38.6217 25.75 38.8342V28.2917C25.75 27.7167 26.2167 27.25 26.7917 27.25H38.25Z" fill="#30363D"/>
    <path d="M27.8333 41.2083C27.8333 41.1531 27.8553 41.1001 27.8943 41.061C27.9334 41.0219 27.9864 41 28.0416 41H32.2083C32.2636 41 32.3166 41.0219 32.3556 41.061C32.3947 41.1001 32.4166 41.1531 32.4166 41.2083V45.3833C32.4165 45.4217 32.4057 45.4592 32.3855 45.4918C32.3654 45.5244 32.3366 45.5509 32.3024 45.5682C32.2682 45.5855 32.2299 45.5931 32.1917 45.59C32.1535 45.5869 32.1168 45.5734 32.0858 45.5508L30.2475 44.2142C30.2119 44.1883 30.169 44.1743 30.125 44.1743C30.081 44.1743 30.0381 44.1883 30.0025 44.2142L28.1641 45.55C28.1332 45.5725 28.0966 45.586 28.0585 45.5891C28.0203 45.5922 27.9821 45.5848 27.9479 45.5675C27.9137 45.5503 27.885 45.524 27.8647 45.4915C27.8445 45.459 27.8337 45.4216 27.8333 45.3833V41.2083Z" fill="#30363D"/>
    <text x="48" y="36" fill="#58A6FF" font-weight="bold" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji" font-size="16px" alignment-baseline="middle">${name}</text>
    <switch>
        <foreignObject x="24" y="56" width="336" height="74">
        <p xmlns="http://www.w3.org/1999/xhtml" style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; font-size: 14px; line-height: 18px; margin: 0; color:#C9D1D9;">${description}</p>
        </foreignObject>
        <text x="24" y="93" alignment-baseline="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji" font-size="14px" fill="#C9D1D9">Your SVG viewer cannot display html.</text>
    </switch>
    <rect x="0.5" y="0.5" width="383" height="153" rx="5.5" stroke="#30363D"/>
    </svg>
    `;

    writeFileSync(join(__dirname, '..', 'img', 'repositories', `${name}.svg`), svgText);

    return `./img/repositories/${name}.svg`;
}

/**
 * Insert repository lists in string
 * @param {string} str 
 * @returns {string} String with repository lists
 */
async function insertRepoList(str) {
    return replaceAsync(str, REPO_LIST_PATTERN, async (match, topicsStr) => {
        const topics = topicsStr.split(' ');

        const allRepos = await getAllOrgRepos();

        const repos = allRepos.filter(repo => !repo.isArchived && !repo.isPrivate && includesAll(repo.topics, topics))

        return generateList(repos)
    });
}

module.exports = {
    insertRepoList
};