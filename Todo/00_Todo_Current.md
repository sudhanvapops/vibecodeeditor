### For Now I will start implimenting Open Github Repo

Provide link
clone the repo
dump the project into db

1. First Make Frontend 
2. Then Backend 

### How to Do that
Direct ZIP download
https://github.com/{owner}/{repo}/archive/refs/heads/{branch}.zip
Extract the owner repo and brach from provided Url

make the request and do it

Frontend → sends repo URL → Backend → downloads repo → extracts → loads files → Store in Db → sends to frontend/editor


### Future: Make it also for Private REPO

Add rate limiting to donation payment api to prevent abuse 
Libraries:
upstash/ratelimit (best for Next.js)
middleware rate limiter

1. https://chatgpt.com/g/g-p-6993fa7760ac8191b817a6e8f4a718a3-vibe-code-editor-project-quiries/c/699ac754-1794-8323-bbbf-ef4b35826eb4
2. https://chatgpt.com/g/g-p-6993fa7760ac8191b817a6e8f4a718a3-vibe-code-editor-project-quiries/c/69993138-73f4-8322-ba0d-7020b5bf085f
3. https://chatgpt.com/c/69a121ab-c54c-8323-963f-b4a52babbd84

4. Blog: https://erbalvindersingh.medium.com/pushing-a-git-repo-online-to-github-via-nodejs-and-simplegit-package-17893ecebddd