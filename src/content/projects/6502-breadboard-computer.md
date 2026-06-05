---
title: 6502 Breadboard Computer
date: 2025-07-27
status: completed
tags: [hardware, "6502", breadboard, retro-computing, ben-eater, wozmon]
summary: Built a working 6502 breadboard computer from scratch following Ben Eater's tutorial, culminating in running Wozmon and loading BASIC.
---

Built a fully working 6502 breadboard computer following [Ben Eater's tutorial series](https://eater.net/6502). The build spans about five weeks — from bare chip with an Arduino monitor to a serial-connected machine running Steve Wozniak's machine-language monitor (Wozmon) and capable of loading BASIC.

## June 22 — Project start

The 6502 project is underway. At this stage: an Arduino monitoring what the chip is doing (address / data / read-write bit in binary and hex in the serial monitor), running off the clock module I built earlier. Next step: hook up the ROM.

<video controls src="/projects/6502/2025-06-22-project-start.mp4"></video>

*[Original post on Bluesky](https://bsky.app/profile/rondalesc.bsky.social/post/3lsa73aj5t22g)*

## June 29 — ROM installed, first real program

Got the ROM installed — can now actually program the microprocessor.

![6502 breadboard computer with ROM and clock module](/projects/6502/2025-06-29-rom-installed-1.jpg)
![Barebones ROM wiring on breadboard 6502](/projects/6502/2025-06-29-rom-installed-2.jpg)
![Close-up of ROM wiring](/projects/6502/2025-06-29-rom-installed-3.jpg)

First program on the 6502 that does meaningful work: writes something to the A register then stores it at a specified memory location (0x6000).

![Logic analyzer output showing first 6502 program execution](/projects/6502/2025-06-29-first-program.jpg)

Following along with [Ben Eater's 6502 tutorial](https://eater.net/6502).

*[Original thread on Bluesky](https://bsky.app/profile/rondalesc.bsky.social/post/3lsrq4da6cc2y)*

## July 5 — ROM + VIA working, and debugging a mysterious crash

First: resolved a crash that had been plaguing the build. The culprit was an LED in the clock module missing a resistor. The blue LED should have had a voltage-controlled output through a gate — it didn't burn the LED out, but it was throwing random garbage to the instruction bus. Found via a [reddit thread in r/beneater](https://www.reddit.com/r/beneater).

Got ROM and VIA hooked up to the 6502. Wrote a simple program that toggles VIA port B between 0xAA and 0x55 (the LEDs show the binary representation). Relieved to get here — the random error debugging was truly daunting.

<video controls src="/projects/6502/2025-07-05-rom-via.mp4"></video>

*[Original post on Bluesky](https://bsky.app/profile/rondalesc.bsky.social/post/3ltajt3bwuc2p)*

## July 9 — Hello, world (sort of)

<video controls src="/projects/6502/2025-07-09-hello-world.mp4"></video>

*[Original post on Bluesky](https://bsky.app/profile/rondalesc.bsky.social/post/3ltinebngss24)*

## July 12 — RAM installed, proper Hello World

6502 now with RAM and a proper Hello World program — and slightly cleaner wiring.

The more I work on this the more impressed I've become with Ben Eater's teaching. He goes through each section in such a thorough and complete way. If you're curious about electronics, [this is a great start](https://eater.net/6502).

<video controls src="/projects/6502/2025-07-12-ram-hello-world.mp4"></video>

*[Original post on Bluesky](https://bsky.app/profile/rondalesc.bsky.social/post/3lts7y6lvwk26) · [Cross-posted to r/beneater](https://www.reddit.com/r/beneater/comments/1lyazqn/6502_up_running_ram_just_installed/)*

## July 16 — Starting the UART module

Starting the UART module for a proper RS232 serial interface — needed to hook up Wozmon and eventually BASIC. Until then, started reading some brain candy my brother recommended: the Scholomance series by Naomi Novik (*A Deadly Education*).

![A Deadly Education book cover](/projects/6502/2025-07-16-scholomance.jpg)

*[Original post on Bluesky](https://bsky.app/profile/rondalesc.bsky.social/post/3lu4jufbhq22f)*

## July 22 — ACIA hooked up

ACIA (Asynchronous Communications Interface Adapter) mostly hooked up. Still need to do the control lines to address the new chip — that'll have to wait until next session.

![6502 with a newly installed ACIA for RS232 serial communication](/projects/6502/2025-07-22-acia.jpg)

*[Original post on Bluesky](https://bsky.app/profile/rondalesc.bsky.social/post/3lujn4t63kc2u)*

## July 27 — Wozmon running

Got Wozmon up and running 🍎 — with an assist from the r/beneater community, who found an issue with the schematic on the Max232 chip. Exciting milestone. Next: load BASIC.

<video controls src="/projects/6502/2025-07-27-wozmon.mp4"></video>

Now reading through the Apple 1 Manual to get a feel for what this thing can actually do.

![Apple 1 Manual open to a page](/projects/6502/2025-07-27-apple1-manual.jpg)

*[Original post on Bluesky](https://bsky.app/profile/rondalesc.bsky.social/post/3luvu4hn4q22r) · [Cross-posted to r/beneater](https://www.reddit.com/r/beneater/comments/1ma974l/6502_with_wozmon/)*
