/**
 * Generate link to GitHub search.
 * @param  {{ topics?: string[], org?: string }}filter
 * @returns 
 */
export const generateQueryLink = (filter) => {

    /**
     * @type {string[]}
     */
    const queries = [];

    if (filter.org !== undefined) queries.push(`org:${filter.org}`);

    for (const topic of filter.topics ?? []) {
        queries.push(`topic:${topic}`);    
    }

    const queryStr = queries.map(encodeURIComponent).join('+');

    return `https://github.com/search?q=${queryStr}`;
};
