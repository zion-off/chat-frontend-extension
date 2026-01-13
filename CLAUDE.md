# Chat Frontend Chrome Extension

Chrome extension for local Opal chat development. Per-site toggles that:
1. Remove CSP headers from the toggled site
2. Redirect `cdn.opal.optimizely.com/opal-chat/*` requests to local dev server (only for requests originating from the toggled site)

## How It Works

When a site toggle is enabled:
- **CSP Rule**: Removes `Content-Security-Policy` header from responses for that domain
- **Redirect Rule**: Redirects `cdn.opal.optimizely.com/opal-chat/*` → `opal-frontend-localdev.optimizely.com:9123/*` (only for requests initiated from that domain via `initiatorDomains`)

## Adding a New Site

1. **background.js**: Add entry to `SITES` with unique `cspRuleId` and `redirectRuleId`
2. **popup.html**: Add toggle-container with `id="toggle-{key}"`
3. **popup.js**: Add key to `SITES` array and `LABELS` object
4. **manifest.json**: Add domain to `host_permissions` and `content_scripts.matches`

## Files

- `background.js` - Service worker, declarativeNetRequest rules (CSP removal + redirect)
- `popup.js` - Toggle state management, sends messages to background
- `popup.html` - Popup UI
- `content.js` - Removes CSP meta tags from page DOM
- `manifest.json` - Extension permissions and content script config
