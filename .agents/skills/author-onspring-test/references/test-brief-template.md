# Test Brief Template

Normalize incoming test descriptions (pasted requirements, Markdown specs, CSV rows, GitHub issues, or Onspring records) into this structure before starting discovery and implementation:

```markdown
## Test Brief

- **Test ID**: Test-000 (or issue/record key)
- **Title**: <concise behavior statement>
- **Domain**: <e.g., app, survey, report, dashboard, fields, triggers, user, role, sharedLists>
- **Tags**: <none | @notfedramp | @snapshot>
- **Source**: <manual prompt | github-issue#<id> | onspring-record#<id> | csv-row#<n> | markdown-path>

### Persona & Isolation

- **Actor**: `sysAdminActor` | isolated active user (`UserFixture` + `ActorFixture.forUser()`)
- **FedRAMP Support**: Yes | No (skip when `environment.isFedspring()`)

### Preconditions / Seed Data

1. <Required apps, fields, records, reports, roles, or users>

### Steps

1. <User action in plain domain terms>
2. <User action in plain domain terms>

### Expected Assertions

1. <Observable UI, exported file, email, or API outcome>

### Cleanup

- <Fixture `try/finally` deletion and whether `cleanup/global.cleanup.ts` needs coverage>
```
