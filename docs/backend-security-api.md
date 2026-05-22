# Backend Security & Settings API Specification

This document defines all API endpoints required to support:
- Two-Factor Authentication (Email OTP or TOTP Authenticator app)
- Password Reset via Email
- Social Account Connections (OAuth)
- Password Change

All endpoints are prefixed with `/api/Auth/`. The `clientId` query param used in auth endpoints is `process.env.NEXT_PUBLIC_CLIENT_ID`.

---

## Authentication Notes

- **Bearer token**: All protected endpoints require `Authorization: Bearer <token>` header.
- **Temp token**: A short-lived JWT (5-minute TTL) used **only** for the 2FA login step. It grants no access to any other endpoint — it only authorizes calling `POST /api/Auth/2fa/login`.
- **Token response shape** (normal login and 2FA login completion):
  ```json
  { "token": "eyJ...", "user": { "id": "...", "email": "...", "name": "..." } }
  ```

---

## Password Change

### `POST /api/Auth/user/change-password`

Change the authenticated user's password.

**Auth:** Bearer token required

**Request body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response 200:**
```json
{ "success": true, "message": "Password updated successfully" }
```

**Error responses:**
| Status | `code` | `message` |
|--------|--------|-----------|
| 400 | `CHANGE_PASSWORD_FAILED` | `"Current password is incorrect"` |
| 400 | `CHANGE_PASSWORD_FAILED` | `"New password must meet complexity requirements"` |
| 401 | — | Token expired / missing |

---

## Password Reset

These endpoints are used when a user forgets their password and needs to reset it via email.

### `POST /api/Auth/password/forgot`

Send a password reset link to the user's email address.

**Auth:** None

**Request body:**
```json
{ "email": "user@example.com" }
```

**Response 200:**
```json
{ "success": true, "message": "Reset link sent" }
```

> **Note:** The response is always 200 regardless of whether the email exists — this prevents user enumeration.

**Error responses:**
| Status | `code` | `message` |
|--------|--------|-----------|
| 400 | `USER_NOT_FOUND` | `"No account found with that email"` |
| 500 | `INTERNAL_ERROR` | Server error |

---

### `POST /api/Auth/password/reset`

Reset the user's password using the token from the reset email.

**Auth:** None

**Request body:**
```json
{
  "email": "user@example.com",
  "token": "<token from email link>",
  "newPassword": "NewSecurePassword1!"
}
```

The `token` is the URL-encoded value that arrives in the reset link query string.

**Response 200:**
```json
{ "success": true, "message": "Password has been reset successfully" }
```

**Error responses:**
| Status | `code` | `message` |
|--------|--------|-----------|
| 400 | `RESET_FAILED` | `"Invalid or expired reset token"` |
| 400 | `RESET_FAILED` | `"Password does not meet requirements"` |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Two-Factor Authentication

Supports two providers:
- **`"Authenticator"`** — TOTP app (Google Authenticator, Authy, etc.) using [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238)
- **`"Email"`** — One-time passcode sent to the user's registered email

A user can only have one active provider at a time. The chosen provider is stored on the account and used for all subsequent 2FA operations.

---

### `GET /api/Auth/2fa/status`

Get the current 2FA status for the authenticated user.

**Auth:** Bearer token required

**Response 200:**
```json
{
  "enabled": true,
  "activatedAt": "2026-05-01T10:30:00Z",
  "provider": "Authenticator"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | bool | Whether 2FA is currently active |
| `activatedAt` | datetime? | UTC timestamp when 2FA was last activated. `null` if never enabled |
| `provider` | string? | `"Email"` or `"Authenticator"`. `null` if 2FA is disabled |

---

### `POST /api/Auth/2fa/setup`

Begin the 2FA setup flow for the chosen provider.

- For **Authenticator**: generates a new TOTP secret (pending — not yet active). Returns the secret and QR URI.
- For **Email**: sends an OTP to the user's registered email. Returns a confirmation message.

Calling this endpoint again before verification resets the pending setup.

**Auth:** Bearer token required

**Request body:**
```json
{ "provider": "Authenticator" }
```
`provider` must be `"Authenticator"` or `"Email"`.

**Response 200 — Authenticator:**
```json
{
  "provider": "Authenticator",
  "secret": "JBSWY3DPEHPK3PXP",
  "qrUri": "otpauth://totp/Vendi360%3Auser%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Vendi360&algorithm=SHA1&digits=6&period=30"
}
```

| Field | Description |
|-------|-------------|
| `secret` | Base32-encoded TOTP secret for manual entry in authenticator apps |
| `qrUri` | Full `otpauth://` URI — pass to a QR code library for display |

**Response 200 — Email:**
```json
{
  "provider": "Email",
  "message": "OTP sent to your email. Enter it to activate 2FA."
}
```

`secret` and `qrUri` are `null` for Email provider.

---

### `POST /api/Auth/2fa/verify`

Verify a code to **activate** 2FA. Must be called after `POST /api/Auth/2fa/setup`.

- For **Authenticator**: verify the 6-digit TOTP code from the app.
- For **Email**: verify the OTP that was emailed during setup.

On success, 2FA is enabled, the provider is stored on the account, and 8 backup codes are generated.

**Auth:** Bearer token required

**Request body:**
```json
{
  "code": "123456",
  "provider": "Authenticator"
}
```

`provider` must match the provider used during `setup`.

**Response 200:**
```json
{
  "success": true,
  "backupCodes": [
    "ABCD-1234", "EFGH-5678", "IJKL-9012", "MNOP-3456",
    "QRST-7890", "UVWX-1234", "YZAB-5678", "CDEF-9012"
  ]
}
```

> **Important:** Backup codes are returned **only once** in plaintext. Show them to the user immediately and instruct them to save them. They cannot be retrieved in plaintext again.

**Error responses:**
| Status | `code` | `message` |
|--------|--------|-----------|
| 400 | `INVALID_CODE` | `"Invalid or expired code."` |

---

### `POST /api/Auth/2fa/disable`

Disable 2FA for the authenticated user. Requires proof of access.

For **Authenticator** users: provide the current 6-digit TOTP code or a backup code.  
For **Email** users: provide an OTP (request one via `POST /api/Auth/2fa/send-code`) or a backup code.

**Auth:** Bearer token required

**Request body:**
```json
{ "code": "123456" }
```

`code` can be:
- A 6-digit TOTP code (Authenticator provider)
- A 6-digit email OTP (Email provider — request one with `2fa/send-code` first)
- A backup code in `XXXX-XXXX` format (either provider)

**Response 200:**
```json
{ "success": true }
```

Clears `twoFactorEnabled`, `provider`, `activatedAt`, and all stored backup codes.

**Error responses:**
| Status | `code` | `message` |
|--------|--------|-----------|
| 400 | `INVALID_CODE` | `"Invalid code."` |
| 400 | `2FA_NOT_ENABLED` | `"2FA is not currently enabled"` |

---

### `POST /api/Auth/2fa/send-code`

Send a fresh email OTP to the authenticated user. Only valid for users with the **Email** 2FA provider.

Use this before calling `2fa/disable` (with Email provider) or when a user's setup OTP has expired.

**Auth:** Bearer token required

**Request body:** *(none)*

**Response 200:**
```json
{ "success": true, "message": "OTP sent to your email." }
```

**Error responses:**
| Status | `code` | `message` |
|--------|--------|-----------|
| 400 | `INVALID_PROVIDER` | `"Email 2FA is not configured for this account."` |

---

### `GET /api/Auth/2fa/backup-codes`

Get the user's current backup codes. Returns masked codes (only the last 4 characters are visible).

**Auth:** Bearer token required

**Response 200:**
```json
{
  "codes": [
    "XXXX-1234", "XXXX-5678", "XXXX-9012", "XXXX-3456",
    "XXXX-7890", "XXXX-1234", "XXXX-5678", "XXXX-9012"
  ]
}
```

Used codes are not returned (the count decreases as codes are consumed). The user can see how many remain.

---

### `POST /api/Auth/2fa/backup-codes/regenerate`

Regenerate all backup codes. Invalidates every existing backup code immediately.

**Auth:** Bearer token required

**Request body:**
```json
{ "code": "123456" }
```

`code` must be a valid TOTP code or email OTP (depending on the user's provider). Backup codes are **not** accepted here to prevent a circular bootstrap problem.

**Response 200:**
```json
{
  "codes": [
    "ABCD-1234", "EFGH-5678", "IJKL-9012", "MNOP-3456",
    "QRST-7890", "UVWX-1234", "YZAB-5678", "CDEF-9012"
  ]
}
```

Returns new codes in **plaintext** — show them to the user once.

**Error responses:**
| Status | `code` | `message` |
|--------|--------|-----------|
| 400 | `INVALID_CODE` | `"Invalid code"` |
| 400 | `2FA_NOT_ENABLED` | `"2FA is not enabled"` |

---

## 2FA Login Flow

When a user has 2FA enabled, the normal `POST /api/Auth/login` does **not** return an auth token. Instead it returns a short-lived temp token. The real auth token is issued only after the 2FA code is verified.

### Step 1 — `POST /api/Auth/login?clientId={clientId}`

**Request body:** *(unchanged)*
```json
{ "email": "string", "password": "string" }
```

**Response when 2FA is disabled** *(unchanged):*
```json
{ "token": "eyJ...", "user": { "id": "...", "email": "...", "name": "..." } }
```

**Response when 2FA is enabled** *(new shape):*
```json
{
  "requiresTwoFactor": true,
  "tempToken": "eyJ...",
  "provider": "Email"
}
```

| Field | Description |
|-------|-------------|
| `requiresTwoFactor` | Always `true` when this shape is returned |
| `tempToken` | Short-lived JWT (5-minute TTL). Only valid for `POST /api/Auth/2fa/login` |
| `provider` | `"Email"` or `"Authenticator"` — tells the frontend which UI to show |

**Provider-specific frontend behaviour:**
- **`provider: "Authenticator"`**: Show a "Enter code from your authenticator app" input immediately.
- **`provider: "Email"`**: Show a "Enter the OTP sent to your email" input. The OTP is **automatically sent** when login returns — no extra API call is needed.

---

### Step 2 — `POST /api/Auth/2fa/login?clientId={clientId}`

Complete the 2FA login step.

**Auth:** No Bearer token. Uses `tempToken` in the body.

**Request body:**
```json
{
  "tempToken": "eyJ...",
  "code": "123456"
}
```

`code` can be:
- 6-digit TOTP code (Authenticator provider)
- 6-digit email OTP (Email provider)
- Backup code in `XXXX-XXXX` format (either provider)

**Response 200:**
```json
{ "token": "eyJ...", "user": { "id": "...", "email": "...", "name": "..." } }
```

Same shape as a normal login success. Store `token` in your auth store.

**Error responses:**
| Status | `code` | `message` |
|--------|--------|-----------|
| 400 | `INVALID_CODE` | `"Invalid or expired code."` |
| 400 | `CODE_EXPIRED` | `"Temp token expired — please sign in again"` |

---

## Social Account Connections (OAuth)

> **Status:** These endpoints are **stubbed** and will return `501 Not Implemented` until OAuth providers are configured.

### `GET /api/Auth/social/connections`

List all social accounts linked to the authenticated user.

**Auth:** Bearer token required

**Response 200:**
```json
{
  "connections": [
    {
      "provider": "google",
      "email": "user@gmail.com",
      "connectedAt": "2026-04-15T08:22:00Z"
    }
  ]
}
```

`provider` values: `"google"` | `"github"` | `"microsoft"`  
Returns an empty array if no accounts are connected.

---

### `GET /api/Auth/social/connect/{provider}`

Initiate the OAuth authorization flow for a provider.

**Auth:** Bearer token required

**URL params:** `provider` — one of `google`, `github`, `microsoft`

**Response 200:**
```json
{ "redirectUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&state=...&redirect_uri=..." }
```

Frontend should `window.location.href = redirectUrl` after receiving this response.

---

### `GET /api/Auth/social/callback/{provider}`

OAuth redirect callback. Called by the OAuth provider after user authorises.

**Auth:** None (validates via `state` parameter)

**Query params:** `code`, `state`

> Currently returns `501 Not Implemented`.

---

### `DELETE /api/Auth/social/disconnect/{provider}`

Remove a social account connection.

**Auth:** Bearer token required

**URL params:** `provider` — one of `google`, `github`, `microsoft`

**Response 200:**
```json
{ "success": true }
```

**Error responses:**
| Status | `code` | `message` |
|--------|--------|-----------|
| 400 | `ALREADY_CONNECTED` | `"Account not connected."` |

---

## Backup Code Format

Backup codes are 9-character strings in `XXXX-XXXX` format (4 chars + dash + 4 chars), generated using a cryptographically secure RNG.

**Storage:** SHA-256 hash of each code is stored. The last 4 characters (suffix) are stored in plaintext for masked display (`XXXX-{suffix}`).

**Verification:**
- Hash the incoming code with SHA-256, compare against stored hashes
- After a successful match, mark the code as used — it cannot be reused
- Used codes are excluded from the `GET /2fa/backup-codes` response

---

## Complete Endpoint Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/Auth/login?clientId=` | None | Sign in; returns token or 2FA temp token |
| `POST` | `/api/Auth/register?clientId=` | None | Register new user |
| `POST` | `/api/Auth/user/change-password` | Bearer | Change current password |
| `POST` | `/api/Auth/password/forgot` | None | Send password reset email |
| `POST` | `/api/Auth/password/reset` | None | Reset password with token from email |
| `GET` | `/api/Auth/2fa/status` | Bearer | Get 2FA enabled state + provider |
| `POST` | `/api/Auth/2fa/setup` | Bearer | Begin 2FA setup (body: `{provider}`) |
| `POST` | `/api/Auth/2fa/verify` | Bearer | Activate 2FA with code (body: `{code, provider}`) |
| `POST` | `/api/Auth/2fa/disable` | Bearer | Disable 2FA (body: `{code}`) |
| `POST` | `/api/Auth/2fa/send-code` | Bearer | Re-send email OTP (Email provider only) |
| `GET` | `/api/Auth/2fa/backup-codes` | Bearer | Get masked backup codes |
| `POST` | `/api/Auth/2fa/backup-codes/regenerate` | Bearer | Regenerate backup codes (body: `{code}`) |
| `POST` | `/api/Auth/2fa/login?clientId=` | None | Complete 2FA login with temp token + code |
| `GET` | `/api/Auth/social/connections` | Bearer | List linked social accounts |
| `GET` | `/api/Auth/social/connect/{provider}` | Bearer | Get OAuth redirect URL |
| `GET` | `/api/Auth/social/callback/{provider}` | None | OAuth callback (501 stub) |
| `DELETE` | `/api/Auth/social/disconnect/{provider}` | Bearer | Unlink a social account |

---

## Error Response Shape

All error responses follow this consistent structure:

```json
{
  "success": false,
  "message": "Human-readable description of what went wrong",
  "code": "MACHINE_READABLE_CODE"
}
```

Common `code` values:

| Code | Meaning |
|------|---------|
| `INVALID_CODE` | TOTP, email OTP, or backup code is wrong |
| `CODE_EXPIRED` | Temp token or code window has expired |
| `2FA_NOT_ENABLED` | Attempted a 2FA operation when 2FA is off |
| `2FA_ALREADY_ENABLED` | Attempted setup when 2FA is already active |
| `INVALID_PROVIDER` | Operation not valid for the user's current 2FA provider |
| `CHANGE_PASSWORD_FAILED` | Current password incorrect or new password invalid |
| `RESET_FAILED` | Reset token invalid, expired, or password too weak |
| `USER_NOT_FOUND` | No account with that email |
| `LOGIN_FAILED` | Incorrect credentials |
| `ALREADY_CONNECTED` | Social account not linked (disconnect) or already linked (connect) |
| `NOT_IMPLEMENTED` | Feature not yet available |
| `INTERNAL_ERROR` | Unexpected server error |
