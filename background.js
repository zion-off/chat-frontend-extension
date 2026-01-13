/*
 * To add a toggle for a new site:
 * 1. Add entry to SITES config below with unique cspRuleId and redirectRuleId
 * 2. In popup.html: add a toggle-container with id="toggle-{key}"
 * 3. In popup.js: add the key to SITES array and LABELS object
 * 4. In manifest.json: add the domain to host_permissions and content_scripts.matches
 */

const SITES = {
  cmp: { domain: 'cmp.optimizely.com', cspRuleId: 2, redirectRuleId: 5 },
  opal: { domain: 'opal.optimizely.com', cspRuleId: 3, redirectRuleId: 6 },
  zaius: { domain: 'app.zaius.com', cspRuleId: 4, redirectRuleId: 7 }
};

function createRedirectRule(id, initiatorDomain) {
  return {
    id,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: {
        regexSubstitution: 'https://opal-frontend-localdev.optimizely.com:9123/\\1'
      }
    },
    condition: {
      regexFilter: '^https://cdn\\.opal\\.optimizely\\.com/opal-chat/(.*)',
      initiatorDomains: [initiatorDomain],
      resourceTypes: ['script', 'xmlhttprequest', 'other']
    }
  };
}

function createCspRule(id, domain) {
  return {
    id,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      responseHeaders: [{ header: 'Content-Security-Policy', operation: 'remove' }]
    },
    condition: {
      urlFilter: `||${domain}`,
      resourceTypes: ['main_frame', 'sub_frame']
    }
  };
}

async function updateRules(state) {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existingRules.map(r => r.id);
  const addRules = [];

  for (const [key, site] of Object.entries(SITES)) {
    if (state[`${key}Enabled`]) {
      addRules.push(createCspRule(site.cspRuleId, site.domain));
      addRules.push(createRedirectRule(site.redirectRuleId, site.domain));
    }
  }

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
  } catch (error) {
    console.error('Failed to update rules:', error);
  }
}

function loadAndApplyRules() {
  const keys = Object.keys(SITES).map(k => `${k}Enabled`);
  chrome.storage.local.get(keys, (result) => {
    const state = {};
    for (const key of keys) {
      state[key] = result[key] === true;
    }
    updateRules(state);
  });
}

chrome.runtime.onInstalled.addListener(loadAndApplyRules);
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateRules') {
    updateRules(message);
  }
});
loadAndApplyRules();
