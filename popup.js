const toggle = document.getElementById('toggle');
const statusEl = document.getElementById('status');

function updateStatus(enabled) {
  statusEl.textContent = enabled ? 'Redirecting to localhost:9123' : 'Extension disabled';
  statusEl.className = 'status' + (enabled ? ' enabled' : '');
}

chrome.storage.local.get(['enabled'], (result) => {
  const enabled = result.enabled !== false;
  toggle.checked = enabled;
  updateStatus(enabled);
});

toggle.addEventListener('change', async () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled });
  updateStatus(enabled);

  chrome.runtime.sendMessage({ action: 'toggle', enabled });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.reload(tab.id);
  }
});
