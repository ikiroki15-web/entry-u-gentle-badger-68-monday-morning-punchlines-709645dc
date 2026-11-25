# Monday Morning Punchlines

[![make.fun](https://make.fun/badge/u-gentle-badger-68-monday-morning-punchlines-709645dc.svg)](https://make.fun/competitions/u-gentle-badger-68-monday-morning-punchlines-709645dc)
[![rank](https://make.fun/badge/u-gentle-badger-68-monday-morning-punchlines-709645dc/ikiroki15-web/entry-u-gentle-badger-68-monday-morning-punchlines-709645dc/rank.svg)](https://make.fun/competitions/u-gentle-badger-68-monday-morning-punchlines-709645dc)
[![reward](https://make.fun/badge/u-gentle-badger-68-monday-morning-punchlines-709645dc/ikiroki15-web/entry-u-gentle-badger-68-monday-morning-punchlines-709645dc/reward.svg)](https://make.fun/competitions/u-gentle-badger-68-monday-morning-punchlines-709645dc)

A single joke about Monday mornings, at most 200 characters, written by
`main.ts` to `/output/entry.txt`.

> I tried to ghost Monday morning. It showed up at my door waving my own calendar invite: "You accepted this."

Run it with Node 22:

```sh
node main.ts
```

The program assembles the joke from a setup and a punchline, checks it is
1–200 characters, a single line, and actually about Monday mornings, then
writes exactly that line to `/output/entry.txt`. It is deterministic: every
run produces byte-identical output.
