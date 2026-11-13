# 02 - Input validation

Users enter data three ways: a form, pasted spreadsheet cells, or an uploaded file. All three funnel
through `validateRows()`, so validation exists in exactly one place.

The preview-before-commit pattern: every row comes back tagged `valid`, `error`, `duplicate` or
`will-overwrite`, with all of its problems listed, so users fix a whole file in one pass.

Try it: `node ../03-allocation-engine/run_demo.js` uses the same CSVs.
