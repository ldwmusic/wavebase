---
name: michiel-feedback
description: >
  Workflow for implementing Michiel's feedback on the SurfGoose website, tracked
  in the "To Do's" table on the Surf Goose dashboard in Overture. Use this skill
  whenever Lode asks to work on feedback or to-do's for SurfGoose — in English or
  Dutch — e.g. "implementeer de feedback", "pak de to do's aan", "werk punt X af",
  "wat staat er nog open?", "michiel feedback", "doe de volgende to do", "zet die
  op review", or when he references a specific feedback item by name or category.
  Also use it when asked to list, prioritise or update the status of these items.
---

# Michiel-feedback workflow (SurfGoose)

Michiel reviews surfgoose.com and his feedback lands as rows in an Overture table.
Each row is one feedback point to implement on the website. This skill defines
where that table lives, who has authority over what, and how status flows.

## Where the to-do's live

Overture MCP (`mcp__overture__*` tools), local server — check `app_info` if unreachable.

- Dashboard: **🌍 Surf Goose** (page id `mq9p78saeba050b8`)
- Table page: **📄 To Do's** (page id `mq9y30yv75514a82`, **table_id `mq9y30ywfbce13dc`**)
- Read with `query_table`, update rows with `update_table_row` (row ids come from `query_table`).

## Reading a row

| Column | Meaning |
|---|---|
| Name | Short title of the feedback point |
| Status | `To do` / `In progress` / `Review` / `Done` |
| Details | **Michiel's feedback** — the description of what he wants changed |
| Image | Optional screenshot clarifying the feedback |
| Notes | **Lode's annotations** on that feedback |
| Category | Site area (Home, Phone, Maps, Branding, …) |

Always read Details **and** Notes together before implementing. Fetch the
screenshot when there is one — it often disambiguates what Michiel means:

```
curl -s -o /tmp/todo_img.png "http://localhost:4789<Image-path>"
```

then Read /tmp/todo_img.png. (Image paths look like `/files/u/<name>.png`; the
port comes from `app_info`, normally 4789.)

## Authority: Lode has the final word

Michiel gives feedback; **Lode decides**. When a Note contradicts, narrows or
redirects the Details, the Note wins — implement what the Note says, not what
Michiel asked. Examples of how Notes typically modify feedback: "only change it
on the phone", "just remove that button", "don't implement the goose, only the
zoom". Treat instructions Lode gives in conversation the same way: they override
both columns. Never edit Lode's Notes.

## Status discipline

Update the row's Status so the table reflects reality:

1. **Starting work on an item** → set Status to `In progress`.
2. **Implemented and verified** (preview checked, pushed if that's the flow) →
   set Status to `Review`. In the chat, tell Lode it's ready for him to check.
3. **`Done` is Lode's call alone.** Never set Done on your own judgment — only
   when Lode explicitly says the item is done or tells you to mark it.

If work on an item is abandoned or blocked, set it back to `To do` and say why.

## Working an item

1. `query_table` to get current rows and statuses.
2. If Lode named an item, work that one. If he says "pak de volgende" or similar
   without naming one, propose a pick (consider category coherence and effort)
   and confirm — don't silently choose for him.
3. Read Details + Notes + Image. If they still leave real ambiguity, ask Lode
   before building.
4. Set `In progress`, implement on the website. All visual/UX work follows the
   **surfgoose-design** skill (brand tokens, motion language, engineering rules)
   — read it before touching design.
5. Verify in the preview (phone items: verify at mobile viewport too).
6. Set `Review`, report to Lode what changed and where to look.

Several items in one session is fine — keep statuses in sync per item, not in
one batch at the end.

## Don'ts

- Don't set `Done` (see above).
- Don't add or delete rows unless Lode asks; new feedback enters via Lode.
- Don't rewrite Details (Michiel's words) or Notes (Lode's words).
- Don't relitigate feedback Lode has already decided on in a Note — build it.
