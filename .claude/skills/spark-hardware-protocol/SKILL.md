---
name: spark-hardware-protocol
description: The PlatformIO-based, VS-Code-only workflow for all hardware and firmware work (Arduino, ESP32, sensors). Use whenever a project involves physical hardware. Replaces Arduino IDE entirely.
---

# SPARK Hardware Protocol

Goal: the human writes, uploads, and monitors firmware **entirely from
VS Code**. No Arduino IDE. No copy-pasting sketches from chat.

## Toolchain

**PlatformIO** (VS Code extension + CLI). Not Arduino IDE. Not bare
arduino-cli, unless a project has a specific reason to prefer it — note
that reason in decisions.md if so.

**Prerequisite**: the human installs the PlatformIO IDE extension in
VS Code once. Everything else follows from that.

## Project layout (inside the main repo)

```
hardware/
├── platformio.ini      — board, framework, pinned library versions
├── src/
│   └── main.cpp        — firmware source
├── components.md       — bill of materials
└── wiring.md           — pinout table
```

## What Claude Code CAN do directly

- Write and edit `platformio.ini` and all `.cpp`/`.h` source.
- **Compile**: `pio run` — catches syntax and library errors before the
  human ever sees them. **ALWAYS run this** before returning firmware as
  "ready."

## What only the human can do (needs the physical board)

- **Upload**: `pio run -t upload` — board connected via USB.
- **Monitor**: `pio device monitor -b 115200` — specify the baud rate
  explicitly.
- Physical bench testing: does the sensor actually read, does the relay
  actually click.

Both run in the human's own VS Code terminal, same editor, same repo — no
context switch.

## Bench test protocol (required in every hardware deliverable)

State explicitly:

1. Exact upload command.
2. Exact monitor command + baud rate.
3. Expected output, line by line, in the first ~10 seconds.
4. A symptom → cause → fix table:

   | Symptom                 | Likely cause     | Fix                                                                          |
   | ----------------------- | ---------------- | ---------------------------------------------------------------------------- |
   | No serial output at all | Wrong board/port | Check the port in `pio run -t upload` output; verify board in platformio.ini |
   | Garbled characters      | Wrong baud rate  | Match monitor baud to `Serial.begin()`                                       |
   | `E01` in output         | Sensor wiring    | Recheck pin per wiring.md                                                    |

## Feedback loop when something fails

The human pastes back the **actual serial output** or error. Diagnose from
that evidence specifically. Patch precisely — don't regenerate the whole
sketch blind — then re-run `pio run` to confirm it still compiles, and give
updated bench-test expectations only for what changed.

## Integration boundary with software

Firmware and backend must agree on the exact contract the architect
defined: payload shape, transport, auth, error cases. The software side
builds a **mock** that sends fake device payloads matching that contract,
so backend QA never depends on the physical device being present.

Only true end-to-end (real device → real API) is manual-only, and it goes
on the human's milestone checklist explicitly.
