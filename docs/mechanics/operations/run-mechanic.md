---
sidebar_position: 20
---

# RUN_MECHANIC

`RUN_MECHANIC` loads a `mechanic_*` script and runs it now, then the parent mechanic continues with the next number. This op's `duration` becomes that child's root duration. An op on the child that already has `duration` keeps its own. Nested calls stop after depth 8. A missing script does nothing. Template specialization, where a child script overlays a parent at load, is [inherit](inherit.md). Use this op when a skill should run a finished mechanic and then keep going.

Task: `operation_run_mechanic`. Loads a `mechanic_*` data script and runs it with the current caster/targets. Overlay this op's `duration` as that child's root `duration`, then inherit-resolve (op duration still wins). Nested `RUN_MECHANIC` stops after depth 8 (same as inherit). Missing script is a no-op.

`inherit:` is template specialization (`mechanic_stun_heavy`). `RUN_MECHANIC` is runtime composition (a skill lists stun, then narrate).

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `RUN_MECHANIC` |
| `mechanic` | yes | Script id (`mechanic_stun` or `stun`) |
| `duration` | no | Becomes the child's root duration. Omit to keep the child's own root duration, or omit on both for until-cleanse / persist |

```yaml
operations:
    1:
        type: RUN_MECHANIC
        mechanic: mechanic_stun
        duration: 8s
    2:
        type: NARRATE
        target: TARGET
        transcript: you_were_stunned_text
        text: you were stunned
```

Smoke: `self_run_mechanic_stun` and `self_run_mechanic_stun_3s` in `mechanic_example_control_effects`.
