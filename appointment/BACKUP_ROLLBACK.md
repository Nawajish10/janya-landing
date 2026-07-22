# Backup & Rollback Strategy

Because this project is a purely static architecture (HTML, CSS, JS), rollbacks are virtually instantaneous and carry zero database-migration risks.

## Deployment Strategy
We strongly recommend hosting this site on a platform that supports atomic deployments (like Netlify, Vercel, or AWS Amplify). These platforms treat every push as an immutable artifact.

## Rollback Procedure (Atomic Hosts)
If a critical flaw is discovered in production (e.g., the form submission API changed):
1. Log into your hosting dashboard.
2. Navigate to the **Deploys** tab.
3. Select the previous stable deployment.
4. Click **Publish Deploy** (or Rollback).
5. The rollback will be instant and globally distributed via the CDN within seconds.

## Rollback Procedure (Traditional FTP / Apache / Nginx)
If you are deploying via FTP or standard file transfer:
1. Always zip the previous `appointment` directory before uploading a new version. Name it `appointment_backup_YYYYMMDD.zip`.
2. To rollback, simply delete the active directory and extract the backup zip.
3. Purge Cloudflare or any active CDN cache.

## Configuration Versioning
`assets/js/config.js` acts as the source of truth for your environments. Ensure you commit changes to this file to version control (Git). If endpoints change and break, you can quickly revert `config.js` and push a hotfix.
