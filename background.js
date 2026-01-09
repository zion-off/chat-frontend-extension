const RULESET_ID = 'ruleset_1';

async function setRulesetEnabled(enabled) {
  try {
    if (enabled) {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: [RULESET_ID]
      });
    } else {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: [RULESET_ID]
      });
    }
  } catch (error) {
    console.error('Failed to update ruleset:', error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['enabled'], (result) => {
    const enabled = result.enabled !== false;
    setRulesetEnabled(enabled);
  });
});

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.action === 'toggle') {
    setRulesetEnabled(message.enabled);
  }
});

chrome.storage.local.get(['enabled'], (result) => {
  const enabled = result.enabled !== false;
  setRulesetEnabled(enabled);
});
