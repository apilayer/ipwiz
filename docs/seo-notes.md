# SEO notes for the ipstack.com rewrite

This app is deployed on Vercel and served publicly through a rewrite at
`https://ipstack.com/devtools/what-is-my-ip`. Two consequences follow, and
neither can be fixed from inside this repository.

## 1. robots.txt must live at the ipstack.com root

A crawler only ever reads `https://ipstack.com/robots.txt`. Anything this app
serves at `/devtools/what-is-my-ip/robots.txt` is ignored, so the generated
`app/robots.ts` was removed rather than left in place looking authoritative.

The current root file is permissive, which is fine:

```
User-agent: *
Disallow:
Sitemap: http://www.ipstack.com/sitemap.xml
```

Two changes worth making to it:

- Switch the sitemap line to `https://ipstack.com/sitemap.xml`. It currently
  advertises `http://www.ipstack.com`, a protocol and host that redirect.
- Add the answer-engine crawlers explicitly. They are not covered reliably by
  `User-agent: *` on every CDN, and they are how the page gets quoted in AI
  answers:

```
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-User
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: Meta-ExternalAgent
Allow: /
```

## 2. The page is not in the sitemap

`https://www.ipstack.com/sitemap.xml` currently lists 0 URLs under
`/devtools/`. An unlisted page with no internal links pointing at it is
discovered slowly, if at all.

- Add `https://ipstack.com/devtools/what-is-my-ip` to the root sitemap.
- Link to it from the ipstack navigation or footer. Internal links are what
  pass authority from the rest of the domain to this page.

## 3. Keep the Vercel origin out of the index

If the `*.vercel.app` deployment answers to the public, it is a duplicate of
this page on a different host. Either block it at the platform level or make
sure every signal on it points at the ipstack.com URL. The canonical in this
app already does, because `app/lib/site.ts` hardcodes the public origin rather
than reading the request host.
