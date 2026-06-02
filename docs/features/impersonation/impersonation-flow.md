# Impersonation Flow

Detailed lifecycle for starting and stopping an impersonation session.

---

## Start Impersonation Flow

```mermaid
sequenceDiagram
    actor Admin
    participant ActionCell as ActionCell<br/>(UserTable)
    participant Dialog as ImpersonateUserDialog
    participant Context as GlobalProtectedContext
    participant Apollo as Apollo Client
    participant API as FastAPI Backend
    participant Router as Next.js Router

    Admin->>ActionCell: Clicks Key icon (impersonate)
    Note over ActionCell: Checks canImpersonate(currentRole, targetRole)<br/>and !isImpersonating and user.status === ACTIVE
    ActionCell->>Dialog: Opens ImpersonateUserDialog (user details)
    Admin->>Dialog: Clicks "Impersonate" button
    Dialog->>Context: startImpersonation(targetUserId)
    Context->>Apollo: mutation START_IMPERSONATION { input: { targetUserId } }
    Apollo->>API: GraphQL mutation
    API-->>Apollo: { success: true, message }
    Apollo-->>Context: data.startImpersonation.success === true

    Context->>Apollo: refetch GET_IMPERSONATION_STATUS
    Apollo->>API: GraphQL query
    API-->>Context: { isImpersonating, targetUser, impersonator }

    Context->>Apollo: refetch GET_CURRENT_USER
    Context->>Apollo: refetch GET_ROLES_LIST
    Context->>Context: updateCookiesFromUser(targetUser)<br/>Sets PSP_ID, BRAND_ID, STORE_ID, USER_ROLE cookies
    Context->>Context: Set IS_IMPERSONATING=true cookie
    Context->>Context: toast.success("Impersonation started")
    Context->>Apollo: client.clearStore() — wipe all cached data
    Context->>Router: router.push(PROTECTED_ROOT_ROUTE)
    Context->>Router: router.refresh()

    Note over Admin: Page reloads with target user's context<br/>ImpersonationBanner is now visible
```

---

## Stop Impersonation Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Banner as ImpersonationBanner
    participant Context as GlobalProtectedContext
    participant Apollo as Apollo Client
    participant API as FastAPI Backend
    participant Window as Browser Window

    Admin->>Banner: Clicks "End Session" button
    Banner->>Context: stopImpersonation()
    Context->>Apollo: mutation STOP_IMPERSONATION
    Apollo->>API: GraphQL mutation
    API-->>Apollo: { success: true, message }
    Apollo-->>Context: data.stopImpersonation.success === true

    Context->>Context: updateCookiesFromUser(impersonator)<br/>Restores PSP_ID, BRAND_ID, STORE_ID, USER_ROLE cookies
    Context->>Context: Clear IS_IMPERSONATING cookie
    Context->>Window: window.location.href = PROTECTED_ROOT_ROUTE
    Note over Admin: Full page reload — Apollo cache fully reset<br/>Admin's own identity is restored
```

---

## Cookie State Machine

The following cookies are managed throughout the impersonation lifecycle. The server reads these in `ProtectedRootLayout` to seed the initial client state with zero waterfall.

```mermaid
stateDiagram-v2
    [*] --> NormalSession : User logs in

    NormalSession : Normal Session
    NormalSession : IS_IMPERSONATING = (unset)
    NormalSession : USER_ROLE = admin role
    NormalSession : PSP_ID / BRAND_ID / STORE_ID = admin entity

    NormalSession --> ImpersonatingSession : startImpersonation() success

    ImpersonatingSession : Impersonating Session
    ImpersonatingSession : IS_IMPERSONATING = true
    ImpersonatingSession : USER_ROLE = target user's role
    ImpersonatingSession : PSP_ID / BRAND_ID / STORE_ID = target user's entity

    ImpersonatingSession --> NormalSession : stopImpersonation() success
    ImpersonatingSession --> NormalSession : GET_IMPERSONATION_STATUS returns false\n(cookie sync useEffect clears IS_IMPERSONATING)
```

---

## ImpersonationBanner Logic

The banner (`ImpersonationBanner`) is rendered inside `ProtectedRootLayout` above all page content. It:

1. Reads `isImpersonating` from `GlobalProtectedContext`.
2. If `false` → renders `null` (invisible).
3. If `true` → renders a fixed top bar (`z-50`) with:
   - A message showing the **impersonated user's role** and **entity name** (PSP / Brand / Store name derived from `currentUserData`).
   - An **End Session** button that calls `stopImpersonation()`.

The `useImpersonatedEntityName()` hook inside the banner maps the impersonated user's role to the correct entity name:

| Role          | Entity Name Source  |
| ------------- | ------------------- |
| `PSP_ADMIN`   | `me.psps[0].name`   |
| `BRAND_ADMIN` | `me.brands[0].name` |
| `STORE_ADMIN` | `me.stores[0].name` |

---

## API Error Codes

The following backend error codes are handled and translated in all three locales (`en`, `es`, `fr`):

| Error Code                            | Meaning                                                 |
| ------------------------------------- | ------------------------------------------------------- |
| `IMPERSONATION_ALREADY_ACTIVE`        | A session is already in progress                        |
| `IMPERSONATION_CHAIN_NOT_ALLOWED`     | Nested impersonation is forbidden                       |
| `IMPERSONATION_DISABLED`              | Feature is disabled server-side                         |
| `IMPERSONATION_ENTITY_SCOPE_MISMATCH` | Target user's entity scope doesn't match required scope |
| `IMPERSONATION_FAILED_START`          | General start failure                                   |
| `IMPERSONATION_FAILED_STOP`           | General stop failure                                    |
| `IMPERSONATION_INVALID_TARGET`        | Target user ID is invalid                               |
| `IMPERSONATION_NOT_ACTIVE`            | No active session to stop                               |
| `IMPERSONATION_NOT_ALLOWED`           | Caller lacks permission to impersonate this user        |
| `IMPERSONATION_TARGET_INACTIVE`       | Target user is not active                               |
| `IMPERSONATION_TARGET_NOT_FOUND`      | Target user does not exist                              |
| `IMPERSONATION_TOKEN_MISSING`         | Impersonation token absent from request                 |

---

Last Update:- 11/05/2026
Agent name:- doc-updater
Author:- Vishav Ranta
