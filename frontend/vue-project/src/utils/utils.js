
export {
    /* 🔤 Text & String Utilities */
    truncateText,     // Shorten text by character length
    truncateWords,    // Shorten text by word count
    pluralize,        // Handle singular/plural text
    slugify,          // Convert text to URL-safe slug
    linebreaksbr,     // Convert line breaks to <br>
    lowerCaseText,    // Lowercase with safety
    capFirst,         // Capitalize first letter
    capitalizeWords,
    titleize,         // Capitalize first letter of every word
    toCamelCase,
    toKebabCase,
    truncateMiddle,
    stripHtmlTags,
    escapeHtml,       // Escape unsafe HTML chars

    /* 🔢 Number & Data Utilities */
    clamp,            // Constrain number between min/max
    randomInt,        // Get random int between range
    bytesToSize,      // Convert bytes to human-readable format
    formatNumber,

    /* 🧠 Logic & General Utilities */
    isEmpty,          // Check for empty value (null, undefined, etc.)
    safeJSON,         // Parse JSON safely with fallback (optional)
    isNumeric,
    isObjectEmpty,


    /* 🕒 Timing Utilities */
    debounce,         // Limit function firing frequency (waits)
    sleep,            // Delay execution using async/await
    throttle,         // (Optional: if added) Rate-limit function call
    timeSince,        // humanized time diff
    formatDuration,
    isYesterday,
    isToday,
    formatDate,       // Format a date string nicely
    parseDate,


    /* 🧰 Misc Utilities */
    generateUUID,     // Generate short UUID
    copyToClipboard,  // Copy string to user's clipboard
    defaultIfNone,    // default value 
    yesno,            // converts true/false into yes/no
    pick,
    omit,
    mergeDeep,
    deepClone,
    retryPromise,
    debouncePromise,
    shareLinkSocialMedia,
};


function shareLinkSocialMedia(platform, url, text = '', hashtags = '') {
    let shareUrl = '';
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'reddit':
            shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
            break;
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
            break;
        default:
            console.error('Unsupported social media platform:', platform);
            return;
    }
    // Open the share URL in a new window
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

/* Text & String Utilities */
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function toCamelCase(str) {
    return str
        .toLowerCase()
        .replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

function truncateMiddle(text, maxLength = 20, separator = '...') {
    if (text.length <= maxLength) return text;
    const sepLen = separator.length;
    const charsToShow = maxLength - sepLen;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return text.substr(0, frontChars) + separator + text.substr(text.length - backChars);
}

function stripHtmlTags(html) {
    return html.replace(/<[^>]*>/g, '');
}

/* Number & Data Utilities */
function formatNumber(num) {
    return num.toLocaleString();
}

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

/* Logic & General Utilities */
function isObjectEmpty(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function mergeDeep(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], mergeDeep(target[key], source[key]));
        }
    }
    return Object.assign(target || {}, source);
}

function pick(obj, keys) {
    return keys.reduce((res, key) => {
        if (key in obj) res[key] = obj[key];
        return res;
    }, {});
}

function omit(obj, keys) {
    return Object.keys(obj).reduce((res, key) => {
        if (!keys.includes(key)) res[key] = obj[key];
        return res;
    }, {});
}

/* Timing Utilities */
function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
        h > 0 ? h.toString().padStart(2, '0') : null,
        m.toString().padStart(2, '0'),
        s.toString().padStart(2, '0')
    ].filter(Boolean).join(':');
}

/* Date & Time Utilities */
function parseDate(dateStr) {
    return new Date(dateStr);
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();
}

/* Misc Utilities */
function debouncePromise(fn, wait) {
    let timeout;
    let resolveQueue = [];
    return function (...args) {
        clearTimeout(timeout);
        return new Promise((resolve) => {
            resolveQueue.push(resolve);
            timeout = setTimeout(() => {
                Promise.resolve(fn.apply(this, args)).then((result) => {
                    resolveQueue.forEach(r => r(result));
                    resolveQueue = [];
                });
            }, wait);
        });
    };
}

async function retryPromise(fn, retries = 3, delay = 1000) {
    try {
        return await fn();
    } catch (err) {
        if (retries <= 1) throw err;
        await new Promise(res => setTimeout(res, delay));
        return retryPromise(fn, retries - 1, delay);
    }
}


function safeJSON(str, fallback = {}) {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.error(`safeJSON: ${e}`)
        return fallback;
    }
}

function timeSince(date) {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function yesno(val, yes = 'Yes', no = 'No', maybe = 'Maybe') {
    if (val === true) return yes;
    if (val === false) return no;
    return maybe;
}

function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

function defaultIfNone(val, defaultVal = '') {
    return (val === null || val === undefined) ? defaultVal : val;
}

// Truncate long text
function truncateText(text, length = 100) {
    if (!text) return '';
    return text.length <= length ? text : text.substring(0, length) + '...';
}

function truncateWords(text, wordLimit = 20) {
    if (!text) return '';
    const words = text.split(/\s+/);
    return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(' ') + '...';
}

function pluralize(count, singular, plural = null) {
    return count === 1 ? singular : (plural || singular + 's');
}

function slugify(text) {
    return text
        .toString()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')         // Replace spaces with -
        .replace(/[^\w-]+/g, '')      // Remove non-word chars except -
        .replace(/--+/g, '-');        // Collapse multiple dashes
}

function lowerCaseText(text) {
    return text.toLowerCase()
}

function linebreaksbr(text) {
    return text ? text.replace(/\n/g, '<br>') : '';
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function titleize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    }[m]));
}



// Format ISO string or Date object to readable format
function formatDate(input, locale = 'en-US', options = {}) {
    const date = typeof input === 'string' ? new Date(input) : input;
    return date.toLocaleDateString(locale, options);
}

// Debounce: useful for input fields
function debounce(fn, delay = 300) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Capitalize first letter of string
function capFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// Generate a short unique ID
function generateUUID() {
    return Math.random().toString(36).substr(2, 8);
}

// Check if an object/array/string is empty
function isEmpty(val) {
    return (
        val === null ||
        val === undefined ||
        (typeof val === 'string' && val.trim() === '') ||
        (Array.isArray(val) && val.length === 0) ||
        (typeof val === 'object' && Object.keys(val).length === 0)
    );
}

// 📋 Copy a string to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Clipboard copy failed:', err);
        return false;
    }
}

// Sleep for async delays (e.g., loading simulation)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
