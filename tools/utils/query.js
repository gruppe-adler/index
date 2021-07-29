/**
 * @typedef {{ topics?: string[], org?: string }} QueryObj
 */


/**
 * Generate link to GitHub search.
 * @param  {QueryObj} query
 * @returns {string}
 */
function generateQueryLink(query) {
    const queryStr = generateQueryStrings(query).map(encodeURIComponent).join('+');

    return `https://github.com/search?q=${queryStr}`;
};

/**
 * Generate string for GitHub search.
 * @param  {QueryObj} query
 * @returns {string}
 */
function generateQueryString(query) {
    return generateQueryStrings(query).join(' ');
};

/**
 * @param  {QueryObj} query
 * @returns {string[]} 
 */
function generateQueryStrings(query) {
    /**
     * @type {string[]}
     */
    const queries = [];

    if (query.org !== undefined) queries.push(`org:${query.org}`);

    for (const topic of query.topics ?? []) {
        queries.push(`topic:${topic}`);    
    }

    return queries;
}

module.exports = {
    generateQueryString,
    generateQueryLink
};