---
sidebar_position: 21
---

# inherit

`inherit` is not an operation. It is a key on a mechanic script. The resolver loads the parent `data`, overlays the child keys, merges the operation maps, and stamps the root `duration` once onto ops that omitted it. An op that already has `duration` keeps it. Omit duration on both the root and the op, and world locks and overlays last until cleanse, while `SET_STAT` without duration or session persists. Running a finished mechanic at a moment in a skill, then continuing, is [RUN_MECHANIC](run-mechanic.md).

Not an op. On a mechanic map or script `data:`:

```yaml
mechanic_stun_heavy:
    type: data
    data:
        inherit: mechanic_stun
        duration: 10s
```

Resolver: load parent `data`, overlay child keys, merge operation maps (extra keys append), then stamp root `duration` once onto ops that omitted it. An op that already has `duration` keeps it. Omit duration on both root and op: world locks and overlays last until cleanse, `SET_STAT` without duration or session persists. Smoke: `self_apply_stun` in `mechanic_example_control_effects`. Runtime composition of a finished template is `RUN_MECHANIC`, not another inherit.
