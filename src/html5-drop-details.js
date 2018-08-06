import isUrl from 'is-url';

export const imageSrcRegExp = /<img\s.*?src=(?:'|")([^'">]+)(?:'|")/gim;
export const linkHrefRegExp = /<a\s.*?href=(?:'|")([^'">]+)(?:'|")/gim;

/**
 * Retrieves details about dropped content in a drag-drop operation.
 *
 * Expects the `DragEvent` object of a drop event.
 * Returns an object with info, depending of the kind of content that was dragged.
 *
 * - When dragging files from the local filesystem, `"files"` will be the only set property, the other properties will have empty or default values
 * - When dragging content from another browser window, `"files"` will be always empty, but some or all of the other values might be set
 *
 * @param {DragEvent} event - The `ondrop` event object
 * @return {object} details
 * @property {FileList} files - A list of files dragged in from the local filesystem
 * @property {String} html - The HTML code of an element dragged in from another browser window
 * @property {String} text - A text, e.g. the text of a dragged link, or simply dragged text content
 * @property {Array} links - An array of URLs found in links of dropped HTML content.
 * @property {Array} images - An array of image URLs found in `src` attributes of images in dropped HTML content.
 */
export default function html5DropDetails(event) {
    const html = (event.dataTransfer && event.dataTransfer.getData('text/html')) || '';
    const images = getRegExpMatches(html, imageSrcRegExp) || [];
    let links = getRegExpMatches(html, linkHrefRegExp) || [];
    let text = event.dataTransfer.getData('Text') || '';

    // text is sometimes same as the src for dropped images
    // (with some encoding/escaping differences, normalized via getHtmlText)
    // reset text to null in these cases
    if (text === getHtmlText(images[0]) && html.substr(0, 4) === '<img') {
        text = '';
    }

    // text is sometimes same as the href for dropped links
    // most times, we can get the real text from the html
    if (text === links[0] && html.substr(0, 2) === '<a') {
        text = this.getHtmlText(html);
    }

    // many times the text is a URL, even if sometimes no were detected (e.g. drop address bar)
    if (isUrl(text)) {
        if (links.length === 0) {
            links = [text];
        } else if (links.indexOf(text) === -1) {
            links.push(text);
        }
    }

    // always return empty arrays for links and images instead of e.g. null,
    // this way, callsites can safely check for e.g. images.length or images[0]
    return {
        files: (event.dataTransfer && event.dataTransfer.files) || null,
        html: html || '',
        text: text || '',
        links: links,
        images: images
    };
}

function getHtmlText(str) {
    if (!str) return '';
    const el = document.createElement('div');
    el.innerHTML = str;
    return el.innerText.trim();
}

function getRegExpMatches(str, reg, group = 1) {
    const matches = [];
    if (str) {
        let match = reg.exec(str);
        while (match != null) {
            matches.push(match[group]);
            match = reg.exec(str);
        }
    }
    return matches;
}
