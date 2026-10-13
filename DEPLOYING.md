# GramSetu mandi-price setup on Netlify

The website calls `/api/mandi`. `netlify.toml` rewrites that URL to the Netlify Function in `netlify/functions/mandi.js`. The function reads `DATA_GOV_API_KEY` on the server, so visitors do not see or enter the key.

## One-time Netlify setup

1. In Netlify, open the deployed site and go to **Project configuration → Environment variables**.
2. Add `DATA_GOV_API_KEY` and paste the data.gov.in key. Mark it as containing a secret if Netlify offers that option. Ensure it is available to **Functions** and the **Production** deploy context.
3. Redeploy the site so the function receives the new variable.
4. Open **Weather & mandi** and press **Refresh data**. Visitors use the same server-side key automatically.

Do not put the key in `app.js`, `index.html`, `netlify.toml`, or another public file. A local `file://` preview cannot run the Netlify Function; use the deployed Netlify URL for official data. The dataset contains daily mandi records, so refresh retrieves the latest published records rather than intraday trades.
