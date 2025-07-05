# Supabase Integration for VisuaLoom Frontend

## Connection Details

- **Supabase Project URL:**  
  `https://krtgthvlsqcyehlczelp.supabase.co`
- **Supabase Anon Key:**  
  _Stored securely in environment/config for frontend use (see below). Do **not** publish or expose in public repos._

## Integration Strategy

- The frontend should use the above URL and key for making requests to Supabase (authentication, database, user features).
- Keys/secrets should be injected at build time via `.env` files. For example:

  ```
  REACT_APP_SUPABASE_URL=https://krtgthvlsqcyehlczelp.supabase.co
  REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydGd0aHZsc3FjeWVobGN6ZWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzI1MDUsImV4cCI6MjA2NzMwODUwNX0.mRUUpm7VsJs089dm3jL-fN8_o-cTT5KH2JKsxL1x4r4
  ```

- Do **not** hardcode API keys in source code.

## Security

- Only the Supabase public anon key is exposed to the frontend.
- Never commit secrets or private keys.
- For secret key rotation, update the `.env` file and redeploy.

## Setup Checklist

- [x] Keys supplied and documented above.
- [ ] Add the `@supabase/supabase-js` package to app dependencies to allow API integration.
- [ ] Implement the Supabase client using the environment variables.

## Example Usage (React)

```js
import { createClient } from '@supabase/supabase-js';

// Get credentials from env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Next Steps

- Install the necessary package with  
  `npm install @supabase/supabase-js`
- Add `.env` to `.gitignore`
- Implement sign-in, user save, and data fetch features as needed using the Supabase client.

---
_This file documents the correct connection, best practices, and locations of Supabase credentials for the VisuaLoom visualoom_frontend container._
