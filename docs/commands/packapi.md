---
sidebar_position: 29
---

# /packapi

Pings the engine API. Op or console.

## System

Host and port are `rules.dsc` `api_host` and `api_port`. The token is `secrets.secret` under the key named by `api_secret_key`. The command calls `GET /health/auth` with header `X-Pirate-Token` and a 3 second timeout.

Poster place and refresh use the same host and token on the render route. This command only checks the socket.

| Piece | Where |
| --- | --- |
| Command | [Api/api_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Api/api_command.dsc) |
| Option catalog | [api](../api.md) |

## Use

```text
/packapi
/packapi ping
```

| Result | Meaning |
| --- | --- |
| ok | Body status is `ok`. Token matched. |
| unauthorized | HTTP 401. Missing token, wrong token, or the egg has no token. |
| down | Timeout, connection refused, or any other non-2xx. |

Anything other than `ping` prints usage.

## What can go wrong

- Calling the public IP or `127.0.0.1` from Paper. The bind is `172.18.0.1` port `8000`, with UFW allowing `172.18.0.0/16`.
- Opening port 8000 on the public interface.
- A browser on `/health` with no token. That route does not check the secret this command sends.
