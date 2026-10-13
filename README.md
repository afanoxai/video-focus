# Video Focus — a locked browser extension

A small Chromium extension with **no UI at all**: no popup, no options page, no toolbar button,
no storage. It removes short-form shelves and recommendation feeds from video pages so the page
shows only what was deliberately searched for.

It exists because two ordinary controls do not work here:

- **URL block lists and DNS** never see short-form content: it is a single-page-app route inside
  the video host, not a new page navigation.
- **Off-the-shelf distraction blockers** ship a settings panel, so the person the rule is for can
  switch the rule off.

This one is installed by policy (`ExtensionInstallForcelist`), so it cannot be removed or disabled
by the user, and it exposes nothing to toggle.

## Files

| File | Purpose |
|---|---|
| `ext/` | the extension source (manifest, CSS, content script) |
| `extension.crx` | packed and signed build (CRX3) |
| `update.xml` | update manifest the browser polls; `appid` must match the signing key |

The extension id is `dlbblcohgckfehkjpbengiglckadlfmf`. Signing key (`key.pem`) is deliberately
**not** in this repository.

## Install (device policy)

Then set, in the Windows registry (or via ADM/ADMX):

```
HKLM\SOFTWARE\Policies\<Vendor>\<Browser>\ExtensionInstallForcelist
  2 = dlbblcohgckfehkjpbengiglckadlfmf;https://afanoxai.github.io/video-focus/update.xml
```

## Release

1. bump `version` in `ext/manifest.json`, mirror it in `update.xml`
2. `chrome --pack-extension=ext --pack-extension-key=key.pem`
3. commit `extension.crx` + `update.xml`
