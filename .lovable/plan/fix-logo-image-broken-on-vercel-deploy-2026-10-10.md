# Fix: logo image broken on Vercel deploy

## Root cause (confirmed)
The Trinity emblem is served from Lovable's asset CDN via a **relative** path:
`/__l5e/assets-v1/656672a0-.../trinity-logo.webp`

That path only resolves on Lovable's hosting. On Vercel, the browser requests
`https://<your-vercel-domain>/__l5e/assets-v1/...`, which does not exist, so both
logo images (nav + hero) return 404 and render nothing.

The same file loads fine at its absolute URL:
`https://trinity-terminal-playground.lovable.app/__l5e/assets-v1/656672a0-9118-46db-8562-4048ca734b38/trinity-logo.webp` (verified: HTTP 200, image/webp).

## Fix
In `src/routes/index.tsx`, resolve the logo URL to an absolute URL instead of the
relative pointer path:

- Add a small constant that prefixes the asset path with the Lovable asset host
  when the URL is relative, e.g.:
  ```ts
  const logoUrl = logoAsset.url.startsWith("http")
    ? logoAsset.url
    : `https://trinity-terminal-playground.lovable.app${logoAsset.url}`;
  ```
- Use `logoUrl` for both `<img>` tags (nav line 63, hero line 95).

This keeps the image working on Lovable preview/publish AND on the Vercel deploy,
since the CDN object is publicly accessible.

## Verification
- Confirm the build passes.
- Spot-check that both image tags render the absolute URL in the built output.
