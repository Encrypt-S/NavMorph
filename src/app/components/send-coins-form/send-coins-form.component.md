# Send Coins Form Component

The Send Coins Form component is used across the site and the style can be configured by passing in a variable via the html.

Layout is controlled by the parent.

## Options

| Option | Value | Type | Required |
|:-----------|:-----------|
| theme | `` | `String(Theme)` | false |

## Themes

| Theme | Description | Default|
|:-----------|:-----------|:-----------|
| form-dark | Black text with an opaque grey background | true |
| form-light | Grey text with transparent grey background | false |

#### Example Usage
```html
<send-coins-form-component theme="form-light"></send-coins-form-component>
```
