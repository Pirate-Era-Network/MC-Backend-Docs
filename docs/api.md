---
sidebar_position: 11
---

# API engine

**Live** for the staff socket check. pirate-era-api is a shared Python process. Bounty posters are the first feature. Later scripts use the same host, port, and handshake. Host and port are in Backend `rules.dsc`. The token is not.

## Live bind

Wings allocation is `172.18.0.1:8000`. Paper uses that address. `127.0.0.1` inside Paper is Paper. The public node IP hairpins.

Listen `0.0.0.0` inside the API container is fine when Wings publishes only `172.18.0.1`. Do not open `8000` on `0.0.0.0` or the public IP.

UFW already allows the Docker net, same shape as Mongo:

```
/usr/sbin/ufw allow from 172.18.0.0/16 to 172.18.0.1 port 8000 proto tcp
```

`Connect timed out` from Paper is that rule missing. `Connection refused` is nothing listening on the allocation.

## Token

| Side | Where | Name |
| --- | --- | --- |
| Egg | env | `API_HANDSHAKE_TOKEN` |
| Denizen | `plugins/Denizen/secrets.secret` | `api_handshake_token` |
| Backend | `rules.dsc` | `api_host`, `api_port`, `api_secret_key` |

`api_secret_key` is the secrets file key name. It is not the token. Do not put the token in YAML or git. The values on the egg and in `secrets.secret` must match.

```
api_handshake_token: TOKEN
```

## Routes

`GET /health` has no token and does not ping Mongo. A down database is not a down renderer.

`GET /health/auth` requires header `X-Pirate-Token`. A match returns `{"status":"ok"}`. A missing egg token, a missing header, or a mismatch is `401`.

Mongo on startup stays for later. Health does not wait on it.

## Poster render

`POST /posters/render` uses the same `X-Pirate-Token` header. Body is resolved text, not a Denizen stat name.

- `background` is a file name under `bountyposter/backgrounds/`. Default is `dressrosa.png`.
- `face` plus `username` asks for a mineskin bust. A failed bust still returns the poster with no face.
- `fields` is a list of `{text, y}`.

The response is `image/png`, 128 by 128. Paths resolve from the package directory.

`/packposter refresh` and place call this route, then write `PEUtils/mapImages/posters/<map id>.png` and run `peimagemap`. Map ids `1` to `10` stay on posters. Sprays start at `11`.

```
/packposter place poster_dressrosa_bounty PlayerName
/packposter remove
/packposter refresh
/packposter list
/packposter clear
```

Place while looking at a block. The frame is an invisible `item_frame` with a `filled_map`. Start and reload restore missing frames and repaint. They are not wiped.

## Staff ping

`/packapi ping` (op or console) calls `GET /health/auth` with `timeout:3s`. Chat is `api ok`, `api is down` (timeout or any non-2xx except 401), or `api unauthorized` (`401`). Reload scripts, then run it from the game server. A browser on the public IP is not this test.

## What can go wrong

- Calling `0.0.0.0:8000` or the public IP from Paper
- Opening `8000` on `0.0.0.0/0`
- Putting `API_HANDSHAKE_TOKEN` in the repo
- Treating `GET /` or a browser on the public IP as the Paper socket test
