# Decisions

Fictional submission by Maya Rao.

## What the owner sees

The owner sees every product before confirming. Each invalid row names the field and explains the correction, such as a non-negative numeric price. The owner can edit the spreadsheet and upload it again; the valid rows remain visible in the preview. Nothing is saved while there are errors.

Product codes are trimmed and compared in uppercase, so MUG-01 and mug-01 cannot both be imported from one file. The server repeats validation on confirmation instead of trusting an earlier browser preview. After import the screen shows how many products were added and the session total.

## Priorities and omissions

I built validation, the preview and server-side confirmation first because adding incorrect products is harder to undo than rejecting a file. I used the supplied parser and the in-memory store to stay within three hours. I left field mapping, background imports and checking an existing catalogue out: the task defines three columns, the files are small, and duplicates outside the current file are explicitly out of scope.

## Limits

The catalogue is in memory and clears on restart. This is a small take-home, not a production service.
