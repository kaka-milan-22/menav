# YAML Snippet for a New Site

Use the following structure when adding a new site to a `sites` list in any of the `.yml` page files.

**Ensure correct indentation** (typically 6 spaces for the `- name:` line if it's under a category's `sites:` list).

```yaml
      - name: "Site Name"
        url: "https://example.com"
        icon: "fab fa-github" # Or 'fas fa-link', 'fab fa-apple', etc.
        description: "A short description of the site."
```

**Key Fields:**
- `name`: The display name for the link. Use `web_fetch` to get the `<title>` of the URL.
- `url`: The full URL.
- `icon`: A Font Awesome icon class. Choose one that fits the site.
- `description`: A brief, one-line description.
