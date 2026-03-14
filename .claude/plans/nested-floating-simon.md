# Connect Frontend to NestJS Backend & Remove Supabase

## Context
Frontend (React/Vite) currently calls Supabase directly for both auth and data. Backend (NestJS) already has full REST API with JWT auth, Prisma/PostgreSQL — but frontend doesn't use it. Goal: rewire frontend to use backend API, remove `@supabase/supabase-js` dependency entirely.

## Current State
- **Backend**: Complete REST API at `localhost:3001`. All endpoints require JWT. Auth via `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `POST /auth/refresh`. Microsoft OAuth ready.
- **Frontend**: React 18 + Vite (port 8080). Uses `@supabase/supabase-js` for auth + direct DB queries. TanStack React Query for caching.
- **Gap**: Frontend bypasses backend completely. Two separate auth systems.

---

## Step 1: Create API Client (`src/lib/api.ts`)

Create a centralized HTTP client that:
- Base URL: `VITE_API_URL` env var (default `http://localhost:3001`)
- Attaches `Authorization: Bearer <token>` from localStorage
- Auto-refreshes token on 401 using `/auth/refresh`
- Redirects to `/auth` on refresh failure

```typescript
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(access: string, refresh: string) { ... }
  clearTokens() { ... }

  async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    // attach Bearer token, handle 401 refresh, parse JSON
  }

  get<T>(path: string): Promise<T> { ... }
  post<T>(path: string, body: unknown): Promise<T> { ... }
  patch<T>(path: string, body: unknown): Promise<T> { ... }
  delete<T>(path: string): Promise<T> { ... }
}

export const api = new ApiClient();
```

Token storage: `localStorage` keys `accessToken`, `refreshToken`.

---

## Step 2: Rewrite Auth (`src/hooks/useAuth.tsx`)

Replace Supabase auth with backend JWT auth.

**New AuthContextType:**
```typescript
interface AuthContextType {
  user: { id: string; email: string } | null;
  loading: boolean;
  staffId: number | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}
```

**Flow:**
1. On mount: check localStorage for `accessToken` → call `GET /auth/me` → set user state
2. `signIn`: `POST /auth/login` → store tokens → call `GET /auth/me` → set state
3. `signUp`: `POST /auth/register` → store tokens → call `GET /auth/me` → set state
4. `signOut`: clear tokens + state, navigate to `/auth`

`GET /auth/me` returns: `{ id, email, staffId, roles, profile { staffId } }` — extract `staffId` and `isAdmin` from this.

Remove `Session` and `User` types from `@supabase/supabase-js`.

---

## Step 3: Rewrite Data Hooks (`src/hooks/useStaff.ts`)

Replace all Supabase queries with backend API calls. Keep TanStack React Query pattern.

| Old (Supabase) | New (Backend API) |
|---|---|
| `supabase.from('staff').select('*')` | `api.get('/staff')` |
| `supabase.from('organizationunits').select('*')` | `api.get('/organization-units')` |
| `supabase.from('groups').select('*')` | `api.get('/groups')` |
| `supabase.from('staff2groups').select('*')` | `api.get('/evaluations/staff2groups')` |
| `supabase.from('questions').select('*')` | `api.get('/questions')` |
| `supabase.from('evaluations').select('*')` | `api.get('/evaluations')` (admin) |
| `useMyGroups(staffId)` | `api.get('/evaluations/my-groups')` |
| `useColleaguesInGroup(groupId)` | `api.get(`/evaluations/colleagues/${groupId}`)` |

**Interface updates** — backend uses camelCase (Prisma), frontend currently uses snake_case (Supabase). Need to map:

| Frontend (old) | Backend (new) |
|---|---|
| `staff.emailh` | `staff.homeEmail` |
| `staff.emails` | `staff.schoolEmail` |
| `staff.staffcode` | `staff.staffcode` |
| `staff.sex` | `staff.gender` (enum: male/female) |
| `staff.academicrank` | `staff.academicrank` |
| `staff.academicdegree` | `staff.academicdegree` |
| `staff.organizationunitid` | `staff.organizationunitid` |
| `evaluation.reviewerid` | `evaluation.reviewerId` |
| `evaluation.victimid` | `evaluation.evaluateeId` |
| `evaluation.groupid` | `evaluation.groupId` |
| `evaluation.questionid` | `evaluation.questionId` |
| `evaluation.modifieddate` | `evaluation.modifiedDate` |
| `staff2groups.staffid` | `staff2group.staffId` |
| `staff2groups.groupid` | `staff2group.groupId` |
| `group.organizationunitid` | `group.organizationunitid` |

Update TypeScript interfaces in `useStaff.ts` to match backend response shapes.

---

## Step 4: Rewrite Pages (replace inline Supabase calls)

### 4a. `Assessment.tsx`
- Replace `supabase.from('evaluations').select/insert/update` with:
  - Fetch existing: `api.get('/evaluations/my?groupId=X')`
  - Save: `api.post('/evaluations/bulk', { groupId, evaluateeId, periodId, evaluations: { [questionId]: point } })`
- Need to handle `periodId` — backend requires it. Use active period from `GET /evaluation-periods/active`.

### 4b. `AdminStaff.tsx`
- CRUD staff: `api.post('/staff', payload)`, `api.patch('/staff/:id', payload)`, `api.delete('/staff/:id')`
- Link profile: `api.post('/users/link-staff', { profileId, staffId })`
- Fetch unlinked profiles: `api.get('/users/profiles')` and filter client-side

### 4c. `AdminGroups.tsx`
- CRUD groups: `api.post('/groups', ...)`, `api.patch('/groups/:id', ...)`, `api.delete('/groups/:id')`
- Save members: `api.put('/groups/:id/members', { staffIds: [...] })`

### 4d. `AdminQuestions.tsx`
- CRUD questions: `api.post('/questions', ...)`, `api.patch('/questions/:id', ...)`, `api.delete('/questions/:id')`

### 4e. `AdminRoles.tsx`
- Fetch users with roles: `api.get('/users/roles')`
- Add role: `api.post('/users/:userId/roles', { role })`
- Remove role: `api.delete('/users/:userId/roles/:role')`

### 4f. `AdminCharts.tsx`
- Replace inline supabase queries with shared hooks (`useGroups`, `useStaff`, `useEvaluations`)

### 4g. `Profile.tsx`
- Update staff: `api.patch('/staff/:id', payload)` (backend allows users to update their own)

### 4h. `Auth.tsx`
- Add Microsoft OAuth button: link to `${API_URL}/auth/microsoft`
- Add `/auth/callback` route to handle OAuth redirect (exchange one-time code via `POST /auth/microsoft/token`)

---

## Step 5: Add OAuth Callback Page (`src/pages/AuthCallback.tsx`)

New page at route `/auth/callback`:
1. Read `?code=` or `?error=` from URL
2. If code: `POST /auth/microsoft/token { code }` → get tokens → store → navigate to dashboard
3. If error: show error message

Update `App.tsx` to add route: `<Route path="/auth/callback" element={<AuthCallback />} />`

---

## Step 6: Update Frontend Environment

### `staffEvaluation-hub/.env`
```
VITE_API_URL=http://localhost:3001
```

### `staffEvaluation-hub/vite.config.ts`
Optionally add proxy to avoid CORS in dev:
```typescript
server: {
  proxy: {
    '/api': { target: 'http://localhost:3001', changeOrigin: true, rewrite: (path) => path.replace(/^\/api/, '') }
  }
}
```
(Or rely on existing CORS config in backend — it already allows localhost:8080)

---

## Step 7: Remove Supabase

1. Delete `src/integrations/supabase/` directory (client.ts, types.ts)
2. Delete `src/supabase/` directory (config.toml, functions, migrations)
3. Remove `@supabase/supabase-js` from `package.json`
4. Remove `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` env vars

---

## Step 8: Backend Cleanup

1. Delete `staffEvaluation-api/scripts/migrate-from-supabase.ts`
2. Remove `"db:migrate"` script from `staffEvaluation-api/package.json`

---

## Files Summary

| Action | File | Description |
|--------|------|-------------|
| **Create** | `staffEvaluation-hub/src/lib/api.ts` | HTTP client with JWT auth |
| **Create** | `staffEvaluation-hub/src/pages/AuthCallback.tsx` | Microsoft OAuth callback handler |
| **Create** | `staffEvaluation-hub/.env` | API URL env var |
| **Rewrite** | `staffEvaluation-hub/src/hooks/useAuth.tsx` | Supabase auth → backend JWT |
| **Rewrite** | `staffEvaluation-hub/src/hooks/useStaff.ts` | Supabase queries → API calls |
| **Modify** | `staffEvaluation-hub/src/pages/Auth.tsx` | Add Microsoft login button |
| **Modify** | `staffEvaluation-hub/src/pages/Assessment.tsx` | Use API for evaluations |
| **Modify** | `staffEvaluation-hub/src/pages/Profile.tsx` | Use API for staff update |
| **Modify** | `staffEvaluation-hub/src/pages/Dashboard.tsx` | Use new hook interfaces |
| **Modify** | `staffEvaluation-hub/src/pages/admin/AdminStaff.tsx` | Use API for CRUD |
| **Modify** | `staffEvaluation-hub/src/pages/admin/AdminGroups.tsx` | Use API for CRUD + members |
| **Modify** | `staffEvaluation-hub/src/pages/admin/AdminQuestions.tsx` | Use API for CRUD |
| **Modify** | `staffEvaluation-hub/src/pages/admin/AdminRoles.tsx` | Use API for roles |
| **Modify** | `staffEvaluation-hub/src/pages/admin/AdminCharts.tsx` | Use shared hooks |
| **Modify** | `staffEvaluation-hub/src/App.tsx` | Add /auth/callback route |
| **Modify** | `staffEvaluation-hub/src/components/ProtectedRoute.tsx` | Update user type check |
| **Delete** | `staffEvaluation-hub/src/integrations/supabase/` | Remove Supabase client |
| **Delete** | `staffEvaluation-hub/src/supabase/` | Remove Supabase config |
| **Delete** | `staffEvaluation-api/scripts/migrate-from-supabase.ts` | Remove migration script |
| **Modify** | `staffEvaluation-hub/package.json` | Remove @supabase/supabase-js |
| **Modify** | `staffEvaluation-api/package.json` | Remove db:migrate script |

---

## Execution Order

1. Create `api.ts` client (foundation for everything)
2. Rewrite `useAuth.tsx` (auth must work first)
3. Rewrite `useStaff.ts` (data hooks used by all pages)
4. Create `AuthCallback.tsx` + update `App.tsx` routes
5. Update pages one by one (Assessment, Profile, Admin*)
6. Update `Auth.tsx` with Microsoft button
7. Delete Supabase files + dependency
8. Backend cleanup

---

## Verification

1. **Auth flow**: Register → Login → see Dashboard with user data
2. **Data loading**: Dashboard shows groups, evaluations, stats
3. **Assessment**: Select group → colleagues → save evaluation
4. **Admin CRUD**: Staff, Groups, Questions — create/edit/delete all work
5. **Admin Roles**: View users, add/remove roles
6. **Profile**: View and edit own profile
7. **Microsoft OAuth**: Click button → redirect → callback → logged in
8. **Token refresh**: Wait 15min → next API call auto-refreshes
9. **No Supabase references**: `grep -r "supabase" src/` returns nothing
