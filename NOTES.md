# Decisions

Fictional submission by Arun Mehta.

## What the owner sees

The owner previews the products and confirms to import them. Required codes and names, numeric non-negative prices, and duplicate codes are checked. Invalid rows are highlighted and the import button is disabled until the file is corrected. The owner can upload another file without retyping the products.

I use a Set of product codes to block duplicates. The server runs the same validation again when importing. After success the screen reports the number of products added.

## Priorities and omissions

I started with the preview, validation and import button. I used the supplied parser and in-memory server. Later I would add a background worker and a field-mapping editor so this could scale to different shops.

## Limits

The catalogue is in memory and clears on restart. This is a small take-home, not a production service.
