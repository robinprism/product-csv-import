# Import products from a spreadsheet

Take-home exercise for a Product Engineer.

## The task

A shop owner uploads a CSV of products. Preview the rows, identify mistakes,
and save the products only after the owner confirms.

- The columns are `sku`, `name` and `price`.
- Product codes and names are required.
- Prices must be present, numeric, and zero or greater. Free products are valid.
- Product codes must be unique within this file. Ignore letter case and
  surrounding spaces: `MUG-01` and ` mug-01 ` are the same product code.
- Show the affected row and field, explain what to fix, and allow a corrected
  file to be uploaded. No products should be saved while there are errors.
- Only duplicates within the uploaded file are in scope, not the existing catalogue.

Keep it to about three hours. Open a pull request and add `NOTES.md` explaining
the experience, your priorities, and what you left out.

## Run

Use Node.js 22 or newer. There are no third-party dependencies.

```sh
npm run dev
npm test
```

Open http://localhost:4173. Set `PORT` to use another port.

The starter provides a CSV parser, a page, and an in-memory HTTP server.
Finish `lib/validation.js`, the import endpoint in `server/app.js`, and the
error presentation in `public/app.js`. The parser is supplied so the exercise
can focus on the product behavior. `samples/` has files to try.

`POST /api/preview` checks a file; `POST /api/import` must check it again before
saving. Both accept `{ "csv": "sku,name,price\nMUG-01,Coffee mug,299" }`.
`GET /api/products` shows what was actually saved. Restarting clears the data.

This is a small exercise, not a production shop or a deployment recommendation.

## About this repository

This exercise and the two candidate submissions were authored for a review-workflow
prototype. They do not represent a live vacancy or actual candidate applications.
