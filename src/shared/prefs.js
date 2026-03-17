export const DEFAULT_PREFS = {
    downloadInstantly: false,
    contextMenuLabels: ['JPG', 'PNG', 'WebP', 'GIF'],
    defaultFilename: '',
    enableMaxLength: false,
    maxLength: 255
};

export async function getPrefs() {
    return await chrome.storage.sync.get(DEFAULT_PREFS);
}
