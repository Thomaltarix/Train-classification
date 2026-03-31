# Train Collection

Small production-ready App Router app to manage a model train collection with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Supabase PostgreSQL + Storage
- Zod validation

The project follows a simple layered architecture:

- `src/repositories`: database access only
- `src/services`: business logic, image upload, signed URL generation
- `src/app` and `src/components`: routing and rendering only

## Features

- Create a train model with metadata
- Sign up and sign in with a personal account
- Upload 1 to 3 images to a private Supabase bucket
- Store only storage paths in PostgreSQL
- Generate signed image URLs on the server for list and detail views
- Filter the collection by category and type
- Restrict models and images to the authenticated owner

## Project Structure

```text
src/
  app/
    create/
      actions.ts
      page.tsx
    models/
      [id]/
        page.tsx
      page.tsx
    layout.tsx
    not-found.tsx
    page.tsx
  components/
    ui/
      button.tsx
      card.tsx
      input.tsx
      select.tsx
    create-model-form.tsx
    empty-state.tsx
    model-card.tsx
    model-filter-bar.tsx
    page-shell.tsx
  lib/
    env.ts
    supabaseClient.ts
    supabaseServer.ts
    utils.ts
    validators.ts
  repositories/
    model.repository.ts
  services/
    model.service.ts
  types/
    models.ts
supabase/
  schema.sql
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=train-model-images
```

Important:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` is safe for the browser
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only
- Never expose the service role key in client components

## Supabase Setup

### 1. Create the database tables

Run the SQL in [supabase/schema.sql](/Users/thomasboue/Dev/perso/Train-classification/supabase/schema.sql) in the Supabase SQL editor.

If you already created the tables before adding auth, run the updated schema again so `models.user_id` and the RLS policies are applied. Existing rows without `user_id` will no longer be visible until they are reassigned.

### 2. Enable authentication

In Supabase:

- Go to `Authentication` -> `Providers`
- Enable `Email`
- Enable `Email + Password`
- If you want immediate access after signup, disable mandatory email confirmation in your project settings

The app exposes a login page at `/login` and protects `/`, `/models`, `/models/[id]`, and `/create`.

### 3. Create the storage bucket

Create a bucket named `train-model-images` or match your `SUPABASE_STORAGE_BUCKET` value.

Bucket rules:

- Set the bucket to `private`
- Do not store public URLs in the database
- Store only file paths such as `user-id/model-id/uuid-image.jpg`

### 4. Storage policies

Because uploads and signed URL generation are performed with the service role key on the server, the safest setup is:

- Keep the bucket private
- Do not create public read access
- Use server-side signed URLs with a 1 hour expiration
- Generate signed URLs only after checking that the model belongs to the current user

### 5. Data model

`models`

- `id uuid`
- `user_id uuid`
- `name text nullable`
- `reference text`
- `category text`
- `type text`
- `color text`
- `length numeric nullable`
- `created_at timestamptz`

`images`

- `id uuid`
- `model_id uuid`
- `path text`
- `created_at timestamptz`

## How Storage Works

The app implements the critical private-storage flow:

1. The user authenticates with Supabase Auth.
2. The form submits metadata and image files through a server action.
3. `model.service.ts` verifies the current user and uploads files to the private bucket under a user-scoped path.
4. Only storage paths are saved into the `images.path` column.
5. List and detail pages fetch only the authenticated user's models.
6. The service generates signed URLs on the server only for paths owned by the current user.
7. The UI receives temporary signed URLs, never permanent public URLs.

Key methods:

- `uploadImage(file: File): Promise<string>`
- `getSignedImageUrl(path: string): Promise<string>`

## Development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- The repository scaffold currently uses `next@16.2.1`, which is newer than Next.js 14, but the implementation stays within the App Router architecture you requested.
- The frontend-safe Supabase client is defined in [src/lib/supabaseClient.ts](/Users/thomasboue/Dev/perso/Train-classification/src/lib/supabaseClient.ts).
- The server-only Supabase client is defined in [src/lib/supabaseServer.ts](/Users/thomasboue/Dev/perso/Train-classification/src/lib/supabaseServer.ts).
- The SSR auth client is defined in [src/lib/supabaseAuth.ts](/Users/thomasboue/Dev/perso/Train-classification/src/lib/supabaseAuth.ts).
- Route protection and session refresh run through [middleware.ts](/Users/thomasboue/Dev/perso/Train-classification/middleware.ts).
- Signed URL logic lives in [src/services/model.service.ts](/Users/thomasboue/Dev/perso/Train-classification/src/services/model.service.ts).
