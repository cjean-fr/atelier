import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import php from 'highlight.js/lib/languages/php';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import twig from 'highlight.js/lib/languages/twig';
import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';

for (const [name, grammar] of Object.entries({ bash, php, json, yaml, twig, xml, javascript, typescript })) {
    hljs.registerLanguage(name, grammar);
}

function highlightCode() {
    for (const block of document.querySelectorAll('pre code')) {
        const language = [...block.classList].find(name => name.startsWith('language-'))?.slice(9);
        if (language && hljs.getLanguage(language)) {
            hljs.highlightElement(block);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlightCode, { once: true });
} else {
    highlightCode();
}
