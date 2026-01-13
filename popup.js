const SITES = ['cmp', 'opal', 'zaius'];
const LABELS = { cmp: 'CMP', opal: 'Opal Standalone', zaius: 'Zaius' };

const toggles = Object.fromEntries(
  SITES.map(key => [key, document.getElementById(`toggle-${key}`)])
);
const statusEl = document.getElementById('status');

function getState() {
  return Object.fromEntries(
    SITES.map(key => [`${key}Enabled`, toggles[key].checked])
  );
}

function updateStatus() {
  const active = SITES.filter(key => toggles[key].checked).map(key => LABELS[key]);
  statusEl.textContent = active.length > 0 ? `Active: ${active.join(', ')}` : 'All disabled';
}

const storageKeys = SITES.map(key => `${key}Enabled`);
chrome.storage.local.get(storageKeys, (result) => {
  for (const key of SITES) {
    toggles[key].checked = result[`${key}Enabled`] === true;
  }
  updateStatus();
});

async function handleToggleChange() {
  const state = getState();
  chrome.storage.local.set(state);
  updateStatus();
  chrome.runtime.sendMessage({ action: 'updateRules', ...state });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.reload(tab.id);
  }
}

for (const key of SITES) {
  toggles[key].addEventListener('change', handleToggleChange);
}
