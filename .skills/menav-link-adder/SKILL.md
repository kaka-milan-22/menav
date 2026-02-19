---
name: menav-link-adder
description: "Adds a new link to a specified category within the MeNav project. Use for requests to add URLs to pages like '常用网站' or '项目'."
---

# MeNav Link Adder Skill

This skill provides a structured workflow for adding new links to the MeNav project, ensuring they are placed in the correct file and category with the right format.

## Workflow

1.  **Clarify Destination**: The user will provide a URL. Your first step is to determine the destination.
    - Ask the user which page (e.g., "常用网站", "项目") and which category (e.g., "mac生态", "在线工具") the link should be added to.
    - If unsure which page to use, read the guide at `references/project-files.md` and present the options to the user. Default to `常用网站` (`common.yml`) for general tools and links.

2.  **Gather Link Metadata**:
    - Use the `web_fetch` tool to get the `<title>` of the provided URL. This will be used for the `name` field in the YAML entry.
    - Create a concise, one-line `description` for the link.

3.  **Identify Target File**: Based on the user's choice in step 1, identify the target YAML file.
    - "常用网站" -> `config/user/pages/common.yml`
    - "项目" -> `config/user/pages/projects.yml`
    - (Refer to `references/project-files.md` for others).

4.  **Read and Modify the File**:
    - Read the contents of the target YAML file.
    - Locate the target category block (e.g., `- name: mac生态`).
    - **If the category does not exist**, ask the user if you should create it. If they agree, add the new category structure at the end of the `categories` list. Use `fas fa-folder` as a default icon.
    - Consult `references/yaml-snippets.md` for the correct YAML structure of a new site entry.
    - Prepare a `replace` operation. The `old_string` should be the last site in the target category's `sites` list. The `new_string` will be the `old_string` plus the new, correctly indented site entry.

5.  **Verify with Pre-Commit Check**:
    - After successfully modifying the file, run the `pre-commit` script to ensure the changes adhere to CI standards.
    - Command: `npm run pre-commit`
    - **If this script fails, STOP.** Analyze the output, fix the formatting or syntax errors, and re-run the script until it passes. Do not proceed until this check is successful.

6.  **Commit and Push**:
    - After the pre-commit check passes, directly perform the following git operations without asking for user confirmation:
      1.  `git add <modified_file_path>` (e.g., `git add config/user/pages/common.yml`)
      2.  Create a commit message, for example: `feat(links): Add '[Site Name]' to '[Category] category'`.
      3.  Execute `git commit -m "..."` with the generated message.
      4.  Execute `git push`.

7.  **Confirm Completion**: Once pushed, inform the user that the link has been added and the changes have been pushed to the repository.
