async function replaceAsync(str, regex, asyncFn) {
    const promises = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args);
        promises.push(promise);
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}

const includesAll = (arr, values) => values.every(v => arr.includes(v));

module.exports = {
    includesAll,
    replaceAsync
}