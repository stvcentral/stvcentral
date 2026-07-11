
# STV Editor setup

After deployment, add these Environment Variables in Vercel:

- ADMIN_PASSWORD
- GITHUB_TOKEN
- GITHUB_OWNER = stvcentral
- GITHUB_REPO = stvcentral
- GITHUB_BRANCH = main

The GitHub token must be fine-grained and have:
Contents: Read and write

Then redeploy and open:
/admin
