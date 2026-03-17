import { getPrefs, DEFAULT_PREFS } from '../shared/prefs.js';

const UI = {
    form: document.getElementById('options-form'),
    downloadInstantly: document.getElementById('download-instantly'),
    contextMenuLabels: document.querySelectorAll('input[name="context-menu-labels"]'),
    defaultFilename: document.getElementById('default-filename'),
    enableMaxLength: document.getElementById('enable-max-length'),
    maxLengthContainer: document.getElementById('max-length-container'),
    maxLength: document.getElementById('max-length'),
    maxLengthDisplay: document.getElementById('max-length-display'),
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
        defaultFilename: UI.defaultFilename.value.trim(),
        enableMaxLength: UI.enableMaxLength.checked,
        maxLength: parseInt(UI.maxLength.value, 10)
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
    UI.enableMaxLength.checked = items.enableMaxLength;
    UI.maxLength.value = items.maxLength;
    UI.maxLengthDisplay.textContent = items.maxLength;

    UI.enableMaxLength.dispatchEvent(new Event('change'));
}

UI.maxLength.addEventListener('input', (e) => {
    UI.maxLengthDisplay.textContent = e.target.value;
});

UI.enableMaxLength.addEventListener('change', (e) => {
    if (e.target.checked) {
        UI.maxLengthContainer.style.opacity = '1';
        UI.maxLengthContainer.style.pointerEvents = 'auto';
    } else {
        UI.maxLengthContainer.style.opacity = '0.5';
        UI.maxLengthContainer.style.pointerEvents = 'none';
    }
});


document.addEventListener('DOMContentLoaded', restoreOptions);
UI.form.addEventListener('submit', saveOptions);
