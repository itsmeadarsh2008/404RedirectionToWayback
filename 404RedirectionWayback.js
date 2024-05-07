// ==UserScript==
// @name         404 to Archive Redirecter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects 404 pages to the Wayback Machine archive
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    // Whitelist of URLs that should not be redirected
    const whitelist = [
        'https://example.com/',// Example URL
        'https://mysite.com/' // Add more URLs as needed
    ];

    // Regex pattern to match localhost URLs
    const localhostPattern = /^https?:\/\/localhost(:\d+)?/;

    // Keywords and phrases to detect 404 errors
    const error404Keywords = [
        '404',
        'Not Found',
        'Sorry, this page isn\'t available',
        'broken link',
        'page removed',
        'page not found',
        'error 404'
    ];

    // Check if the current URL is whitelisted or localhost
    const currentURL = window.location.href;
    const isWhitelisted = whitelist.some(url => currentURL.startsWith(url)) || localhostPattern.test(currentURL);

    if (!isWhitelisted) {
        try {
            // Check if the response status code is 404
            const response = await fetch(currentURL, { method: 'HEAD' });

            if (response.status === 404) {
                // Construct the Wayback Machine URL
                const archiveURL = 'https://web.archive.org/web/*/' + currentURL;

                // Redirect to the Wayback Machine
                window.location.replace(archiveURL);
            }
        } catch (error) {
            console.error('Error checking HTTP status:', error);
        }
    } else {
        // Check if the current page is a 404 error
        const pageContent = document.title + ' ' + document.body.innerText;
        const error404Detected = error404Keywords.some(keyword => pageContent.toLowerCase().includes(keyword.toLowerCase()));

        if (error404Detected) {
            // Get the current URL
            const currentURL = window.location.href;

            // Construct the Wayback Machine URL
            const archiveURL = 'https://web.archive.org/web/*/' + currentURL;

            // Redirect to the Wayback Machine
            window.location.replace(archiveURL);
        }
    }
})();
