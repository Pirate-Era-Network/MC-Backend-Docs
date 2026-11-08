---
sidebar_position: 32
---

# TELEPORT

`TELEPORT` moves each resolved player to `location`. The value is a LocationTag the Backend built. A pack YAML string is not a location, and a missing or non-location value does nothing. A named dock with a cost and a quest arrival is [TRAVEL_TO_WAYPOINT](travel-to-waypoint.md).

Task: `operation_teleport`. Moves each resolved player to `location:`. Missing or non-location is a no-op.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `TELEPORT` |
| `location` | yes | LocationTag (Backend-built maps, not pack YAML strings) |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `/staticloot list` row click.
