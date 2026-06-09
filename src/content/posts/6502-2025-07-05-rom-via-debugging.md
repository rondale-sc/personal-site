---
title: "6502: ROM + VIA Working, Debugging a Mysterious Crash"
type: project
project: 6502-breadboard-computer
date: 2025-07-05
---

First: resolved a crash that had been plaguing the build. The culprit was an LED in the clock module missing a resistor. The blue LED should have had a voltage-controlled output through a gate — it didn't burn the LED out, but it was throwing random garbage to the instruction bus. Found via a [reddit thread in r/beneater](https://www.reddit.com/r/beneater).

Got ROM and VIA hooked up to the 6502. Wrote a simple program that toggles VIA port B between 0xAA and 0x55 (the LEDs show the binary representation). Relieved to get here — the random error debugging was truly daunting.

<video controls src="/projects/6502/2025-07-05-rom-via.mp4"></video>

*[Original post on Bluesky](https://bsky.app/profile/rondalesc.bsky.social/post/3ltajt3bwuc2p)*
