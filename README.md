# ServiceNow Auto Watchlist

A scoped ServiceNow application that automatically adds users to a task's watch list based on configurable conditions. Define rules with the condition builder, assign recipient groups, and any matching task automatically gets the right people watching it.

## How It Works

1. Admin creates **Recipients** - named entries with an email address (e.g. "Database Team", "dba-team@example.com")
2. Admin creates **Conditions** - rules using the ServiceNow condition builder that match against the `task` table (e.g. "Assignment group is Database" or "Priority is Critical")
3. Each condition is linked to one or more recipients
4. A **before** business rule on the `task` table evaluates all active conditions on every insert/update
5. If a condition matches, the linked recipients are added to the task's `watch_list` field
6. Optionally, a display message is posted as a work note explaining why the watcher was added

## Tables

### Conditions (`x_auto_watchlist_conditions`)

| Field | Type | Description |
|---|---|---|
| Number | String | Auto-generated (AWL prefix) |
| Name | String | Friendly name for the rule |
| Active | Boolean | Enable/disable the rule |
| Condition | Conditions | ServiceNow condition builder targeting the `task` table |
| Table | Reference | Target table |
| Recipient | Reference | Link to the Recipients table (multi-value) |
| Display Message | String | Optional work note posted when the rule triggers |
| Description | String | Internal notes about the rule |

### Recipients (`x_auto_watchlist_recipients`)

| Field | Type | Description |
|---|---|---|
| Name | String | Friendly name (e.g. "Security Team") |
| Email | String | Email address to add to the watch list |
| Description | String | Internal notes |

## Roles

| Role | Purpose |
|---|---|
| `admin` | Full access to conditions and recipients |
| `conditions_user` | Can manage watchlist conditions |
| `recipients_user` | Can manage recipient records |

## ACLs

Both tables have full CRUD ACLs (create, read, write, delete) restricted by role.

## Data Policies

- **Name** and **Email** are mandatory on the Recipients table

## Files

| File | Description |
|---|---|
| `update_set.xml` | Importable update set XML |
| `business_rule.js` | The before business rule that runs on the `task` table and evaluates all conditions |

## Installation

1. Import `update_set.xml` via **System Update Sets > Retrieved Update Sets**
2. Preview and commit the update set
3. Navigate to **Auto Watchlist** in the application navigator

## Example

**Condition:** Assignment group is "Network Operations" AND Priority is 1 - Critical

**Recipient:** "NOC Manager" (noc-manager@example.com)

**Result:** Any time a critical task is assigned to Network Operations, the NOC Manager is automatically added to the watch list and a work note is posted.
