# Send Coins Form Component

The Send Coins Form component is used across the site and the style can be configured by passing in a variable via the html.

Layout is controlled by the parent.

## Options

| Option | Value | Type | Required |
|:-----------|:-----------|:-----------|:-----------|
| theme | | `String(Theme)` | false |
| loaderTheme | | `String(Theme)` | false |

## Themes

| Theme | Description | Default|
|:-----------|:-----------|:-----------|
| form-dark | Black text with an opaque grey background | true |
| form-light | Grey text with transparent grey background | false |

## Loader Themes
See the loader components documention for details on the availible theming options

#### Example Usage
```html
<send-coins-form-component theme="form-light" loaderTheme="loader-white"></send-coins-form-component>
```
