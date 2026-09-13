# UI Copywriting Specification

Guidelines for writing clear, concise, and user-centric interface text.

---

## 1. Core Writing Rules

### User-Centric Perspective
- Focus on what the user accomplishes, not what the system or internal service provides.
- Avoid first-person pronouns ("we", "us", "our") unless communicating from customer support or manual auditing.
- **Do**: "Enter your phone number" / "Export 30-day report"
- **Don't**: "We support entering phone numbers" / "Our system will generate and provide report downloads"

### Brevity & Clarity
- Omit unnecessary filler words and obvious facts. State actions directly.
- **Do**: "Organization unassigned"
- **Don't**: "This project currently has not been assigned to any organization, please check"

### Plain Terminology
- Avoid internal developer jargon, database field names, or raw HTTP error codes.
- **Do**: "Unable to connect to the server"
- **Don't**: "Socket ETIMEDOUT: 504 Gateway Timeout"

### Strict Consistency
- Use one term for one concept across the entire product suite (e.g., choose either "Create" or "New", "Delete" or "Remove", "Settings" or "Preferences").
- The action button label must match the destination modal or page title (e.g., clicking "Add Member" opens a modal titled "Add Member", never "Create User").

### Constructive & Actionable Tone
- Avoid blaming the user for errors.
- Frame errors as objective states rather than failures. Always provide a recovery path.
- **Do**: "Incorrect password. Enter your password again or [Reset Password]."
- **Don't**: "Wrong input! Password error!"

---

## 2. Punctuation & Formatting Rules

- **Titles & Buttons**: Never use terminal punctuation (no periods, colons, or semicolons at the end of titles, button labels, or menu items).
- **Tooltips & Helper Text**: Omit periods for single short phrases. Use periods for complete multi-sentence paragraphs.
- **Exclamation Marks**: Avoid exclamation marks (`!`). Convey importance through visual hierarchy and color tokens instead.
