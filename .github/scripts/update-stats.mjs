// Consulta el total de contribuciones públicas del último año vía GitHub GraphQL
// y lo guarda en data.json (el sitio lo lee en vivo). Fácil de extender con
// más campos (followers, repos, stars) cuando los necesitemos.
import fs from "node:fs";

const query = `{
  user(login: "LynxWiLd") {
    contributionsCollection {
      contributionCalendar { totalContributions }
    }
  }
}`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
});

if (!res.ok) {
  console.error("GitHub API HTTP", res.status);
  process.exit(1);
}

const json = await res.json();
const total = json?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions;

if (typeof total !== "number") {
  console.error("Respuesta inesperada:", JSON.stringify(json).slice(0, 300));
  process.exit(1);
}

const data = {
  contributions: total,
  updated: new Date().toISOString().slice(0, 10),
};

fs.writeFileSync("data.json", JSON.stringify(data, null, 2) + "\n");
console.log("contributions:", total);
