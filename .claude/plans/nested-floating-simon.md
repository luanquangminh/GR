# Add Avatar Upload for All Users

## Context
Currently avatars are either static pre-crawled images matched by name (`/teacher-avatars/`) or just show initials as fallback. Users cannot upload/change their own avatar. Goal: allow any user to upload an avatar image, store it on the server, and display it across the app.

---

## Backend Changes

### Step 1: Add `avatar` field to Staff model

**File:** `staffEvaluation-api/prisma/schema.prisma` (line 59-85)

Add to Staff model:
```prisma
avatar String? @map("avatar")
```

Then run `npx prisma db push` to sync.

### Step 2: Create upload endpoint

**File:** `staffEvaluation-api/src/staff/staff.controller.ts`

Add new endpoint using `@UseInterceptors(FileInterceptor(...))` from `@nestjs/platform-express` + multer:

```
POST /staff/:id/avatar
- Auth: JWT (admin or own profile)
- Body: multipart/form-data with `file` field
- Validates: file type (jpg/png/webp), max size (2MB)
- Saves to: uploads/avatars/<staffId>-<timestamp>.<ext>
- Updates staff.avatar field in DB with the relative path
- Deletes old avatar file if exists
- Returns { avatarUrl: '/uploads/avatars/...' }
```

**File:** `staffEvaluation-api/src/staff/staff.service.ts`

Add `updateAvatar(id, filePath, user)` method:
- Same auth check as `update()` (admin or own profile)
- Delete old file if `staff.avatar` exists
- Update `staff.avatar = filePath`

### Step 3: Serve static uploads

**File:** `staffEvaluation-api/src/main.ts`

Add static file serving:
```typescript
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
```

Create directory: `staffEvaluation-api/uploads/avatars/` (add `.gitkeep`)

### Step 4: Update DTO

**File:** `staffEvaluation-api/src/staff/dto/staff.dto.ts`

No change needed — avatar is handled by file upload endpoint, not JSON body.

---

## Frontend Changes

### Step 5: Update Staff interface

**File:** `staffEvaluation-hub/src/hooks/useStaff.ts` (line 5-21)

Add `avatar: string | null;` to Staff interface.

### Step 6: Add avatar upload to Profile page

**File:** `staffEvaluation-hub/src/pages/Profile.tsx` (lines 91-95)

Replace the static Avatar with a clickable avatar that:
- Shows current avatar image (from `staff.avatar`) or fallback to `getTeacherAvatar(name)` or initials
- On click: opens hidden file input
- On file select: uploads via `POST /staff/:id/avatar` (multipart)
- Shows loading spinner during upload
- Refreshes staff data after upload

Add to `api.ts`:
```typescript
uploadFile<T>(path: string, file: File, fieldName = 'file'): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);
  return this.fetch<T>(path, { method: 'POST', body: formData });
  // Note: don't set Content-Type — browser sets it with boundary
}
```

Modify `fetch()` in api.ts: skip setting `Content-Type: application/json` when body is FormData.

### Step 7: Update avatar display across the app

Update all places that show avatars to prefer `staff.avatar` URL:

1. **Profile.tsx** — main profile avatar (line 91)
2. **Assessment.tsx** — colleague avatars in evaluation list
3. **History.tsx** — reviewer avatars, leaderboard avatars
4. **AdminResults.tsx** — staff avatars in results table (if any)

Logic priority: `staff.avatar` (uploaded) → `getTeacherAvatar(name)` (static) → initials fallback

Create a small helper or update existing avatar rendering pattern:
```typescript
function getAvatarUrl(staff: { avatar?: string | null; name: string }): string | null {
  if (staff.avatar) return `${API_URL}${staff.avatar}`;
  return getTeacherAvatar(staff.name);
}
```

---

## Files Summary

| Action | File |
|--------|------|
| Modify | `staffEvaluation-api/prisma/schema.prisma` — add avatar field |
| Modify | `staffEvaluation-api/src/staff/staff.controller.ts` — add upload endpoint |
| Modify | `staffEvaluation-api/src/staff/staff.service.ts` — add updateAvatar method |
| Modify | `staffEvaluation-api/src/main.ts` — add static file serving |
| Create | `staffEvaluation-api/uploads/avatars/.gitkeep` |
| Modify | `staffEvaluation-hub/src/lib/api.ts` — add uploadFile method, fix Content-Type for FormData |
| Modify | `staffEvaluation-hub/src/hooks/useStaff.ts` — add avatar to Staff interface |
| Modify | `staffEvaluation-hub/src/pages/Profile.tsx` — add avatar upload UI |
| Modify | `staffEvaluation-hub/src/pages/Assessment.tsx` — use uploaded avatar |
| Modify | `staffEvaluation-hub/src/pages/History.tsx` — use uploaded avatar |
| Create | `staffEvaluation-hub/src/lib/avatarUtils.ts` — getAvatarUrl helper |

## Execution Order

1. Schema + db push
2. Backend: static serving, upload endpoint, service method
3. Frontend: api.ts uploadFile, Staff interface, avatarUtils helper
4. Frontend: Profile page avatar upload UI
5. Frontend: update Assessment.tsx, History.tsx to use new avatar logic

## Verification

1. Upload avatar on Profile page → image appears immediately
2. Visit Assessment page → colleague shows uploaded avatar
3. Visit History page → leaderboard shows uploaded avatar
4. User without uploaded avatar → falls back to static or initials
5. Backend: `npm run build && npm run test`
