# ServerMessage How To

#### Format
```
{
    "_id" : ObjectId("59c1bba8149c8d719abbc4a1"),
    "server_message" : "DEFCON 1",
    "message_type" : "ERROR",
    "show_message" : true
}
```

#### Valid Inputs

| Field | Valid Values | Type | Required |
|:-----------|:-----------|:-----------|:-----------|
| server_message | `any string` | `String` | true |
| message_type | `ERROR`, `WARN`, `INFO` | `String` | true |
| show_message | `true`, `false` | `Boolean` | true |
