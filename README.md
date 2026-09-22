# IPWiz

IPWiz is an educational developer tool and live dashboard for the [IPstack](https://ipstack.com/) API, powered by APILayer. It allows you to inspect IP addresses, compare IP geolocation with browser geolocation, and see exactly how the IPstack API resolves an address in real-time.

![IPWiz Dashboard Preview](./public/apilayer-logo.png) <!-- Assuming a screenshot might be added later, otherwise we keep the simple logo -->

## Features
- **Live IP Lookup**: See detailed IP information including location, connection details, timezone, and security data.
- **Trace Panel**: Inspect the exact request and JSON response from the IPstack API with a developer-friendly collapsible view.
- **Geo Compare**: Compare the geographical location from your IP address with your actual browser's geolocation using an interactive dark-themed Leaflet map.
- **VPN / Proxy Detection**: Built-in verdict display showing whether the IP is likely associated with a VPN, proxy, or data center.
- **My Grabs**: Persist and view earlier IP lookups using a local SQLite database (via Drizzle ORM).
- **Dark & Light Themes**: Automatic or manual toggling between dark and light modes.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [SQLite](https://sqlite.org/) + [Drizzle ORM](https://orm.drizzle.team/) + [@libsql/client](https://github.com/libsql/libsql-client-ts)
- **Maps**: [Leaflet](https://leafletjs.com/) with CartoDB Dark Matter tiles
- **API**: [IPstack API by APILayer](https://apilayer.com/marketplace/ipstack-api)

## Getting Started

First, make sure you have an IPstack API key. Create an `.env.local` file at the root of the project with your API key:

```bash
IPSTACK_ACCESS_KEY=your_api_key_here
```

Then, install the dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## Local Database Setup

The project uses Drizzle ORM. Remember to generate and run migrations if you change the schema `app/lib/db/schema.ts`!

For setting up the local db initially:

```bash
npx drizzle-kit migrate
# or use drizzle studio to view data
npx drizzle-kit studio
```

## Learn More

- [IPstack API Documentation](https://docs.apilayer.com/ipstack/docs/api-documentation) - Learn about the IPstack API
