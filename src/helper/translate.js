/**
 * ------------------------
 * Translation helper
 * ------------------------
 */

const replacer = (phrase, placeholder)  => {
    let cleanPhrase = phrase;
    Object.keys(placeholder).forEach(item => {
        const pattern = '\\$\\{' + item + '\\}';
        const regex = new RegExp(pattern, 'g');
        const value = placeholder[item];
        cleanPhrase = cleanPhrase.replace(regex, value);
    });
    return cleanPhrase;
};

const translate = (phrases = {}, key, placeholder = null) => {
    const phrase = phrases[key] || key;
    return placeholder
        ? replacer(phrase, placeholder)
        : phrase;
};

export default translate;
