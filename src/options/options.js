import { getPrefs, DEFAULT_PREFS } from '../shared/prefs.js';

const UI = {
    form: document.getElementById('options-form'),
    downloadInstantly: document.getElementById('download-instantly'),
    contextMenuLabels: document.querySelectorAll('input[name="context-menu-labels"]'),
    defaultFilename: document.getElementById('default-filename'),
    status: document.getElementById('status')
};

// translate  elements with a data-i18n attr
function localizeHtmlPage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const messageKey = element.getAttribute('data-i18n');
        const translatedMessage = chrome.i18n.getMessage(messageKey);

        if (translatedMessage) {
            element.textContent = translatedMessage;
        }
    });
}

async function saveOptions(e) {
    e.preventDefault();

    const selectedLabels = Array.from(UI.contextMenuLabels)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const prefs = {
        ...DEFAULT_PREFS,
        downloadInstantly: UI.downloadInstantly.checked,
        contextMenuLabels: selectedLabels,
        defaultFilename: UI.defaultFilename.value.trim()
    };

    await chrome.storage.sync.set(prefs);

    UI.status.classList.add('show');
    setTimeout(() => {
        UI.status.classList.remove('show');
    }, 2500);
}

async function restoreOptions() {
    localizeHtmlPage();

    const items = await getPrefs();

    UI.downloadInstantly.checked = items.downloadInstantly;
    UI.defaultFilename.value = items.defaultFilename;

    UI.contextMenuLabels.forEach(checkbox => {
        checkbox.checked = items.contextMenuLabels.includes(checkbox.value);
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
UI.form.addEventListener('submit', saveOptions);
