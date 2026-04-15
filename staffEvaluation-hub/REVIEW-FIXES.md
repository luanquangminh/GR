# Code Review Fixes Plan

## Overview
Fixes identified during code review of the Staff Evaluation Hub project.
Docker/deployment items are excluded.

---

## Step 1: Fix division by zero in History page [DONE]
- **File**: `staffEvaluation-hub/src/pages/History.tsx:298`
- **Issue**: `data.evals.length` can be 0, causing `NaN` in reviewer average calculation
- **Fix**: Added `data.evals.length > 0` guard before division

## Step 2: Fix evaluation period date validation on PATCH [DONE]
- **File**: `staffEvaluation-api/src/evaluation-periods/evaluation-periods.service.ts`
- **Issue**: `update()` didn't validate `endDate > startDate` when both are updated
- **Fix**: Resolve final start/end dates from dto + existing record, validate before proceeding

## Step 3: Add FK existence checks before creating relations [DONE]
- **Files**:
  - `staffEvaluation-api/src/groups/groups.service.ts` — verify all `staffIds` exist before `updateMembers()`, with dedup
  - `staffEvaluation-api/src/users/users.service.ts` — verify `staffId` exists before `linkStaff()`
  - `staffEvaluation-api/src/evaluations/evaluations.service.ts` — verify question IDs exist in `bulkUpsert()`
- **Fix**: Added existence queries and throw `BadRequestException` / `NotFoundException` for invalid IDs

## Step 4: Handle Prisma unique constraint errors in staff creation [DONE]
- **File**: `staffEvaluation-api/src/staff/staff.service.ts`
- **Issue**: Duplicate `staffcode` or `schoolEmail` returned 500 instead of 409
- **Fix**: Catch `PrismaClientKnownRequestError` with code `P2002` and throw `ConflictException`

## Step 5: Add API request timeout with AbortController [DONE]
- **File**: `staffEvaluation-hub/src/lib/api.ts`
- **Issue**: `fetch()` calls had no timeout — network issues hang forever
- **Fix**: Added `fetchWithTimeout()` wrapper with 30s `AbortController` timeout on all requests

## Step 6: Use separate JWT_REFRESH_SECRET [DONE]
- **Files**:
  - `staffEvaluation-api/src/auth/auth.service.ts` — reads `JWT_REFRESH_SECRET`, falls back to derived
  - `staffEvaluation-api/src/auth/strategies/refresh-token.strategy.ts` — same logic, fixed double-suffix bug
  - `staffEvaluation-api/.env.example` — documented the new env var
- **Issue**: Refresh token secret was `JWT_SECRET + '-refresh'` — if JWT_SECRET leaks, both are compromised
- **Fix**: Read `JWT_REFRESH_SECRET` from env (backwards compatible — falls back to derived value)

## Step 7: Fix CORS production safety [DONE]
- **File**: `staffEvaluation-api/src/main.ts`
- **Issue**: Default CORS origins included `localhost:*` — unsafe if `CORS_ORIGINS` not set in production
- **Fix**: In production (`NODE_ENV=production`), if `CORS_ORIGINS` not set, use empty array and log warning

---

## Round 2 — Remaining Review Fixes

## Step 8: Add unsaved changes warning in Assessment page [DONE]
- **File**: `staffEvaluation-hub/src/pages/Assessment.tsx`
- **Issue**: User can close tab mid-evaluation without warning, losing all entered scores
- **Fix**: Add `beforeunload` event listener when evaluations have unsaved changes

## Step 9: Add search debounce in AdminStaff [DONE]
- **File**: `staffEvaluation-hub/src/pages/admin/AdminStaff.tsx`
- **Issue**: Every keystroke triggers re-filter of full staff list
- **Fix**: Debounce search input with ~300ms delay using a `useDebouncedValue` hook

## Step 10: Remove `id` field from CreateOrganizationUnitDto [DONE]
- **File**: `staffEvaluation-api/src/organization-units/dto/organization-units.dto.ts`
- **Issue**: Allows manual ID input on auto-increment field, risking collisions
- **Fix**: Remove `id` from CreateOrganizationUnitDto

## Step 11: Make UpdateOrganizationUnitDto use PartialType [DONE]
- **File**: `staffEvaluation-api/src/organization-units/dto/organization-units.dto.ts`
- **Issue**: PATCH requires all fields (same bug as groups/questions, already fixed for those)
- **Fix**: Use `PartialType(CreateOrganizationUnitDto)`

## Step 12: Remove console.error in NotFound page [DONE]
- **File**: `staffEvaluation-hub/src/pages/NotFound.tsx`
- **Issue**: Logs user pathname to console — unnecessary noise, potential info leak
- **Fix**: Remove the useEffect with console.error

## Step 13: Guard parseEvaluationMap against undefined evaluateeid [DONE]
- **File**: `staffEvaluation-hub/src/pages/Assessment.tsx`
- **Issue**: If `evaluateeid` is undefined/null, map key becomes `"undefined"` or `"null"` string
- **Fix**: Already has `if (!e.evaluateeid || !e.questionid) return;` guard — but `e.point || 0` silently converts `0` to `0` which is correct. However `point: e.point || 0` treats valid `0` as falsy. Use `??` instead.

## Step 14: Add `useCallback` to handleSave in Assessment and Profile [DONE]
- **Files**: `Assessment.tsx`, `Profile.tsx`
- **Issue**: `handleSave` recreated every render, causes unnecessary re-renders of child components
- **Fix**: Wrap in `useCallback` with proper dependencies

## Step 15: Memoize sortedColleagues in Assessment [DONE]
- **File**: `staffEvaluation-hub/src/pages/Assessment.tsx`
- **Issue**: `sortedColleagues` recomputed with spread + sort on every render
- **Fix**: Wrap in `useMemo`

---

## Round 3 — Final Review Fixes

## Step 16: Fix beforeunload missing returnValue [DONE]
- **File**: `staffEvaluation-hub/src/pages/Assessment.tsx`
- **Issue**: `preventDefault()` alone doesn't trigger the dialog in some browsers
- **Fix**: Added `e.returnValue = ''`

## Step 17: Standardize API error messages to English [DONE]
- **Files**: `staffEvaluation-api/src/auth/auth.service.ts`, `auth.service.spec.ts`
- **Issue**: Mixed Vietnamese/English error messages in auth service
- **Fix**: Converted all to English, updated test assertions

## Step 18: Add logging when period activation closes other periods [DONE]
- **File**: `staffEvaluation-api/src/evaluation-periods/evaluation-periods.service.ts`
- **Issue**: Silent auto-close of other active periods with no audit trail
- **Fix**: Added `Logger.warn()` with count of affected periods

## Step 19: Improve Helmet CSP — remove unsafe-inline from scriptSrc [DONE]
- **File**: `staffEvaluation-api/src/main.ts`
- **Issue**: `'unsafe-inline'` in `scriptSrc` defeats XSS protection
- **Fix**: Removed from `scriptSrc` (kept in `styleSrc` for Swagger UI)

## Step 20: Add cascade delete warnings [DONE]
- **Files**: `staff.service.ts`, `groups.service.ts`, `evaluation-periods.service.ts`
- **Issue**: Deleting staff/group/period cascades to evaluations without logging
- **Fix**: Added `Logger.warn()` with counts of related records before delete

## Step 21: Fix test specs for new mocks [DONE]
- **Files**: All 5 service spec files + evaluations spec test data
- **Issue**: New FK checks and cascade count queries broke existing mocks
- **Fix**: Added missing Prisma mocks, fixed test data (max score 4, not 5)

---

## Round 4 — Review Fixes

## Step 22: Fix duplicate staffIds in updateMembers createMany [DONE]
- **File**: `groups.service.ts`
- **Issue**: Deduplication was done for validation but original `dto.staffIds` used in `createMany`
- **Fix**: Hoisted `uniqueIds` and used it consistently throughout the method

## Step 23: Add P2002 handling to update() methods [DONE]
- **Files**: `staff.service.ts`, `organization-units.service.ts`
- **Issue**: Only `create()` caught unique constraint violations; `update()` returned raw 500
- **Fix**: Wrapped update Prisma calls in try-catch for P2002 → ConflictException

## Step 24: Fix race condition in AuthCallback useEffect [DONE]
- **File**: `AuthCallback.tsx`
- **Issue**: No cleanup flag; navigating away mid-request updated unmounted component
- **Fix**: Added `cancelled` flag with cleanup return

## Step 25: Add cascade warning on org-unit delete [DONE]
- **File**: `organization-units.service.ts`
- **Issue**: Unlike staff/group/period, org-unit delete didn't log cascading records
- **Fix**: Added `Logger.warn()` with staff and group counts

## Step 26: Add @MaxLength to all string DTO fields [DONE]
- **Files**: All DTO files (staff, groups, questions, evaluation-periods, organization-units)
- **Issue**: String fields accepted unbounded input (DoS/overflow risk)
- **Fix**: Added `@MaxLength()` decorators: names 200, descriptions 1000, codes 50, phone 20, etc.

## Step 27: Fix password minLength mismatch in Auth.tsx [DONE]
- **File**: `Auth.tsx`
- **Issue**: HTML `minLength={6}` conflicted with backend/Zod requirement of 8
- **Fix**: Changed to `minLength={8}`

## Step 28: Fix period auto-select overriding user selection [DONE]
- **Files**: `AdminCharts.tsx`, `AdminResults.tsx`
- **Issue**: useEffect could override manually selected period on data refetch
- **Fix**: Changed to `selectedPeriodId === null` check, removed `selectedPeriodId` from deps

## Step 29: Add aria-label to icon-only buttons [DONE]
- **Files**: AdminStaff, AdminGroups, AdminQuestions, AdminPeriods, AdminResults, AdminRoles
- **Issue**: Used `title` (not accessible) instead of `aria-label`
- **Fix**: Replaced `title` with `aria-label` on all icon-only buttons

## Step 30: Remove dead Index.tsx page [DONE]
- **File**: `pages/Index.tsx` (deleted)
- **Issue**: Never imported or routed, contained placeholder text

## Step 31: Fix org-unit service spec for new mocks [DONE]
- **File**: `organization-units.service.spec.ts`
- **Issue**: New cascade count queries broke remove test
- **Fix**: Added `staff.count` and `group.count` mocks

---

## Round 5 — Final Review Fixes

## Step 32: Replace raw parseInt with validated query DTOs [DONE]
- **Files**: `evaluations.controller.ts`, `evaluations.dto.ts`, `evaluations.controller.spec.ts`
- **Issue**: Query params (groupId, reviewerId, etc.) parsed with raw `parseInt()` — NaN on invalid input
- **Fix**: Created `EvaluationQueryDto` and `EvaluationMyQueryDto` with `@Type(() => Number)` + `@IsInt()`, used `@Query() dto` pattern

## Step 33: Add explicit onDelete: SetNull to org-unit FK relations [DONE]
- **File**: `prisma/schema.prisma`
- **Issue**: Staff and Group FK to OrganizationUnit had no explicit `onDelete` behavior
- **Fix**: Added `onDelete: SetNull` to both relations (correct: nulls the FK, doesn't cascade delete)

## Step 34: Add required attribute on staffcode input [DONE]
- **File**: `AdminStaff.tsx`
- **Issue**: `staffcode` is required in backend DTO but form input lacked `required` attribute
- **Fix**: Added `required` to staffcode `<Input>`

---

## Build Verification
- Backend: `tsc --noEmit` — 0 errors
- Frontend: `tsc --noEmit` — 0 errors
- Backend tests: 16 suites, 181 tests — all passing
