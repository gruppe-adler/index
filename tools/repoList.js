const { writeFileSync } = require('fs');
const { join } = require('path');
const { ORG_NAME } = require('./utils/const');
const { getAllOrgRepos } = require('./utils/getAllRepos');
const { replaceAsync, includesAll } = require('./utils');
const escape = require('escape-html');

const REPO_LIST_PATTERN = /<div [^>]*data-list="([a-z0-9-_\s]+)"[^>]*>[^<]*<\/div>/gi

/**
 * @param {string[]} repositories Repository names
 * @returns {Promise<string>} Rendered list
 */
async function generateList(topics) {
    const allRepos = await getAllOrgRepos();

    const repositories = allRepos.filter(repo => !repo.isArchived && !repo.isPrivate && includesAll(repo.topics, topics))

    const headline = `The list below includes all repositories, which aren't archived, not private and have the following tags: ${topics.map(t => `<span data-topic="${t}"></span>`).join(' ')}`;

    const renderedRepos = await Promise.all(repositories.map(renderRepo));

    const reposStr = renderedRepos.length <= 8 ? renderedRepos.join('\n') : `${renderedRepos.slice(0, 6).join('\n')}<details align="center"><summary>Show more</summary>${renderedRepos.slice(6).join('\n')}</details>`

    return `${headline}\n<p align="center">\n${reposStr}\n</p>`;
}

/**
 * @param repo Repository name
 * @returns {Object} Rendered repository
 * @returns {Promise<string>} Rendered repo
 */
async function renderRepo(repo) {
    const { name, description, isTemplate } = repo;

    const url = await generateRepoImage(name, description, isTemplate);

    const str = `<a href="https://github.com/${ORG_NAME}/${name}"><img src="${url}"></a>`;

    return str;
}

async function generateRepoImage(name, description, isTemplate) {

    let icon = `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.5 28.2917C24.5 27.6839 24.7414 27.101 25.1712 26.6712C25.601 26.2414 26.1839 26 26.7917 26H38.875C39.0408 26 39.1997 26.0658 39.3169 26.1831C39.4342 26.3003 39.5 26.4592 39.5 26.625V43.7083C39.5 43.8741 39.4342 44.0331 39.3169 44.1503C39.1997 44.2675 39.0408 44.3333 38.875 44.3333H33.875C33.7092 44.3333 33.5503 44.2675 33.4331 44.1503C33.3158 44.0331 33.25 43.8741 33.25 43.7083C33.25 43.5426 33.3158 43.3836 33.4331 43.2664C33.5503 43.1492 33.7092 43.0833 33.875 43.0833H38.25V39.75H27C26.6685 39.75 26.3505 39.8817 26.1161 40.1161C25.8817 40.3505 25.75 40.6685 25.75 41V41.625C25.75 42.2217 26.1083 42.7367 26.625 42.9625C26.7718 43.032 26.8857 43.156 26.9427 43.3081C26.9997 43.4603 26.9952 43.6286 26.9302 43.7774C26.8652 43.9263 26.7448 44.044 26.5945 44.1056C26.4442 44.1672 26.2758 44.1679 26.125 44.1075C25.642 43.8967 25.2309 43.5495 24.9423 43.1086C24.6537 42.6676 24.4999 42.152 24.5 41.625V28.2917ZM38.25 27.25V38.5H27C26.545 38.5 26.1175 38.6217 25.75 38.8342V28.2917C25.75 27.7167 26.2167 27.25 26.7917 27.25H38.25Z" fill="#30363D"/>
    <path d="M27.8333 41.2083C27.8333 41.1531 27.8553 41.1001 27.8943 41.061C27.9334 41.0219 27.9864 41 28.0416 41H32.2083C32.2636 41 32.3166 41.0219 32.3556 41.061C32.3947 41.1001 32.4166 41.1531 32.4166 41.2083V45.3833C32.4165 45.4217 32.4057 45.4592 32.3855 45.4918C32.3654 45.5244 32.3366 45.5509 32.3024 45.5682C32.2682 45.5855 32.2299 45.5931 32.1917 45.59C32.1535 45.5869 32.1168 45.5734 32.0858 45.5508L30.2475 44.2142C30.2119 44.1883 30.169 44.1743 30.125 44.1743C30.081 44.1743 30.0381 44.1883 30.0025 44.2142L28.1641 45.55C28.1332 45.5725 28.0966 45.586 28.0585 45.5891C28.0203 45.5922 27.9821 45.5848 27.9479 45.5675C27.9137 45.5503 27.885 45.524 27.8647 45.4915C27.8445 45.459 27.8337 45.4216 27.8333 45.3833V41.2083Z" fill="#30363D"/>
    `;

    if (isTemplate) {
        icon = '<path d="M26.7917 26C26.1839 26 25.601 26.2414 25.1712 26.6712C24.7414 27.101 24.5 27.6839 24.5 28.2917V29.125C24.5 29.2908 24.5658 29.4497 24.6831 29.5669C24.8003 29.6842 24.9592 29.75 25.125 29.75C25.2908 29.75 25.4497 29.6842 25.5669 29.5669C25.6842 29.4497 25.75 29.2908 25.75 29.125V28.2917C25.75 27.7167 26.2167 27.25 26.7917 27.25H27.625C27.7908 27.25 27.9497 27.1842 28.0669 27.0669C28.1842 26.9497 28.25 26.7908 28.25 26.625C28.25 26.4592 28.1842 26.3003 28.0669 26.1831C27.9497 26.0658 27.7908 26 27.625 26H26.7917ZM30.125 26C29.9592 26 29.8003 26.0658 29.6831 26.1831C29.5658 26.3003 29.5 26.4592 29.5 26.625C29.5 26.7908 29.5658 26.9497 29.6831 27.0669C29.8003 27.1842 29.9592 27.25 30.125 27.25H33.875C34.0408 27.25 34.1997 27.1842 34.3169 27.0669C34.4342 26.9497 34.5 26.7908 34.5 26.625C34.5 26.4592 34.4342 26.3003 34.3169 26.1831C34.1997 26.0658 34.0408 26 33.875 26H30.125ZM36.375 26C36.2092 26 36.0503 26.0658 35.9331 26.1831C35.8158 26.3003 35.75 26.4592 35.75 26.625C35.75 26.7908 35.8158 26.9497 35.9331 27.0669C36.0503 27.1842 36.2092 27.25 36.375 27.25H38.25V29.125C38.25 29.2908 38.3158 29.4497 38.4331 29.5669C38.5503 29.6842 38.7092 29.75 38.875 29.75C39.0408 29.75 39.1997 29.6842 39.3169 29.5669C39.4342 29.4497 39.5 29.2908 39.5 29.125V26.625C39.5 26.4592 39.4342 26.3003 39.3169 26.1831C39.1997 26.0658 39.0408 26 38.875 26H36.375ZM25.75 31.4167C25.75 31.2509 25.6842 31.0919 25.5669 30.9747C25.4497 30.8575 25.2908 30.7917 25.125 30.7917C24.9592 30.7917 24.8003 30.8575 24.6831 30.9747C24.5658 31.0919 24.5 31.2509 24.5 31.4167V34.5417C24.5 34.7074 24.5658 34.8664 24.6831 34.9836C24.8003 35.1008 24.9592 35.1667 25.125 35.1667C25.2908 35.1667 25.4497 35.1008 25.5669 34.9836C25.6842 34.8664 25.75 34.7074 25.75 34.5417V31.4167ZM39.5 31.4167C39.5 31.2509 39.4342 31.0919 39.3169 30.9747C39.1997 30.8575 39.0408 30.7917 38.875 30.7917C38.7092 30.7917 38.5503 30.8575 38.4331 30.9747C38.3158 31.0919 38.25 31.2509 38.25 31.4167V34.5417C38.25 34.7074 38.3158 34.8664 38.4331 34.9836C38.5503 35.1008 38.7092 35.1667 38.875 35.1667C39.0408 35.1667 39.1997 35.1008 39.3169 34.9836C39.4342 34.8664 39.5 34.7074 39.5 34.5417V31.4167ZM25.75 37.0417C25.75 36.8759 25.6842 36.7169 25.5669 36.5997C25.4497 36.4825 25.2908 36.4167 25.125 36.4167C24.9592 36.4167 24.8003 36.4825 24.6831 36.5997C24.5658 36.7169 24.5 36.8759 24.5 37.0417V41.625C24.4998 42.1522 24.6534 42.6679 24.9421 43.1091C25.2307 43.5502 25.6418 43.8975 26.125 44.1083C26.2002 44.1412 26.2812 44.1589 26.3633 44.1604C26.4453 44.1619 26.5269 44.1473 26.6033 44.1173C26.6798 44.0873 26.7495 44.0426 26.8086 43.9856C26.8678 43.9287 26.9151 43.8607 26.9479 43.7854C26.9807 43.7102 26.9984 43.6292 27 43.5471C27.0015 43.4651 26.9869 43.3835 26.9569 43.3071C26.9269 43.2307 26.8822 43.1609 26.8252 43.1018C26.7683 43.0427 26.7002 42.9953 26.625 42.9625C26.3648 42.8489 26.1434 42.6619 25.988 42.4243C25.8325 42.1867 25.7498 41.9089 25.75 41.625V41C25.75 40.6685 25.8817 40.3505 26.1161 40.1161C26.3505 39.8817 26.6685 39.75 27 39.75H27.625C27.7908 39.75 27.9497 39.6842 28.0669 39.5669C28.1842 39.4497 28.25 39.2908 28.25 39.125C28.25 38.9592 28.1842 38.8003 28.0669 38.6831C27.9497 38.5658 27.7908 38.5 27.625 38.5H27C26.545 38.5 26.1175 38.6217 25.75 38.8342V37.0417ZM39.5 37.0417C39.5 36.8759 39.4342 36.7169 39.3169 36.5997C39.1997 36.4825 39.0408 36.4167 38.875 36.4167C38.7092 36.4167 38.5503 36.4825 38.4331 36.5997C38.3158 36.7169 38.25 36.8759 38.25 37.0417V38.5H36.375C36.2092 38.5 36.0503 38.5658 35.9331 38.6831C35.8158 38.8003 35.75 38.9592 35.75 39.125C35.75 39.2908 35.8158 39.4497 35.9331 39.5669C36.0503 39.6842 36.2092 39.75 36.375 39.75H38.25V43.0833H33.875C33.7092 43.0833 33.5503 43.1492 33.4331 43.2664C33.3158 43.3836 33.25 43.5426 33.25 43.7083C33.25 43.8741 33.3158 44.0331 33.4331 44.1503C33.5503 44.2675 33.7092 44.3333 33.875 44.3333H38.875C39.0408 44.3333 39.1997 44.2675 39.3169 44.1503C39.4342 44.0331 39.5 43.8741 39.5 43.7083V37.0417ZM30.125 38.5C29.9592 38.5 29.8003 38.5658 29.6831 38.6831C29.5658 38.8003 29.5 38.9592 29.5 39.125C29.5 39.2908 29.5658 39.4497 29.6831 39.5669C29.8003 39.6842 29.9592 39.75 30.125 39.75H33.875C34.0408 39.75 34.1997 39.6842 34.3169 39.5669C34.4342 39.4497 34.5 39.2908 34.5 39.125C34.5 38.9592 34.4342 38.8003 34.3169 38.6831C34.1997 38.5658 34.0408 38.5 33.875 38.5H30.125ZM28.1642 45.5508C28.1332 45.5734 28.0965 45.5869 28.0583 45.59C28.0201 45.5931 27.9818 45.5855 27.9476 45.5682C27.9134 45.5509 27.8846 45.5245 27.8644 45.4918C27.8443 45.4592 27.8335 45.4217 27.8333 45.3833V41.2083C27.8333 41.1531 27.8553 41.1001 27.8944 41.061C27.9334 41.0219 27.9864 41 28.0417 41H32.2083C32.2636 41 32.3166 41.0219 32.3556 41.061C32.3947 41.1001 32.4167 41.1531 32.4167 41.2083V45.3833C32.4165 45.4217 32.4057 45.4592 32.3856 45.4918C32.3654 45.5245 32.3366 45.5509 32.3024 45.5682C32.2682 45.5855 32.2299 45.5931 32.1917 45.59C32.1535 45.5869 32.1168 45.5734 32.0858 45.5508L30.2475 44.2142C30.2119 44.1883 30.169 44.1743 30.125 44.1743C30.081 44.1743 30.0381 44.1883 30.0025 44.2142L28.1642 45.55V45.5508Z" fill="black"/>'
    }

    const svgText = `
    <svg width="384" height="154" viewBox="0 0 384 154" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${icon}
    <text x="48" y="36" fill="#58A6FF" font-weight="bold" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji" font-size="16px" alignment-baseline="middle">${escape(name)}</text>
    <switch>
        <foreignObject x="24" y="56" width="336" height="74">
        <p xmlns="http://www.w3.org/1999/xhtml" style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; font-size: 14px; line-height: 18px; margin: 0; color:#C9D1D9;">${escape(description)}</p>
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

        return generateList(topics)
    });
}

module.exports = {
    insertRepoList
};