# Loader Component

The Loader component is used across the site and the style can be configured by passing in a variable via the html.

Layout: It absolutely positions to the middle of the parent component, but the parent **must** be relatively positioned.

## Options

| Option | Value | Type | Required |
|:-----------|:-----------|:-----------|:-----------|
| theme | | `String(Theme)` | false |

## Themes

| Theme | Description | Default|
|:-----------|:-----------|:-----------|
| (default) | Transparent black background | true |
| loader-light | Transparent white background | false |

#### Example Usage
```html
<loader-component theme="loader-light"></loader-component>
```
