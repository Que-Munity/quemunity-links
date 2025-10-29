Migration instructions for adding user fields (display_name, phone, birthday)

What changed
- `prisma/schema.prisma` was updated to add the following fields to the `User` model:
  - `displayName String? @unique @map("display_name")`
  - `phone String? @map("phone")`
  - `birthday DateTime? @map("birthday")`

Why you need to run a migration
- The codebase now expects `users.display_name`, `users.phone`, and `users.birthday` columns to exist in your database.
- Prisma migrations usually create these automatically, but this environment couldn't apply the migration due to a DB connection error ("Tenant or user not found").

Options to apply the schema changes

1) Recommended: Run Prisma migrate locally (if you have local DB access)

- Ensure `DATABASE_URL` in your local `.env` points to your Postgres database.
- Run:
  ```bash
  npx prisma migrate dev --name add-user-fields
  npx prisma generate
  ```

2) If Prisma cannot connect in your environment: Run the manual SQL migration

- A manual SQL migration file was created at `prisma/manual_migrations/20251029_add_user_fields.sql`.
- Apply this SQL to your Postgres database (psql, pgAdmin, Supabase SQL editor, etc.).

  Example using psql:
  ```bash
  psql "$DATABASE_URL" -f prisma/manual_migrations/20251029_add_user_fields.sql
  ```

  Example for Supabase SQL editor: copy & paste the SQL and run it.

3) After applying the migration (either via Prisma or SQL), regenerate the Prisma client

  ```bash
  npx prisma generate
  ```

4) Restart the dev server

  ```bash
  npm run dev
  ```

Notes and safety
- The migration adds a UNIQUE index on `display_name`. Ensure existing data does not contain duplicates before applying or the migration will fail.
- If you want to populate `display_name` for existing users, run an UPDATE before creating the unique index, e.g. set display_name to username or email-local-part for existing rows.

If you want, I can:
- Attempt to run the migration from this environment again if you want me to (requires valid DATABASE_URL with correct user/tenant), or
- Help craft an UPDATE script to populate `display_name` for existing users before adding the unique index, or
- Run `npx prisma generate` here if you apply the migration or provide a reachable DATABASE_URL.
