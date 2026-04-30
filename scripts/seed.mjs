import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envFile = readFileSync(resolve(__dirname, "../.env.local"), "utf-8");
for (const line of envFile.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i > 0) process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);

// --- Data ---

const coaches = [
  {
    id: "coach-1",
    name: "Mike Torres",
    role: "Head Coach",
    bio: "15 years coaching experience. Former semi-professional player and UEFA B license holder. Joined Carleton in 2019.",
  },
];

const schedule = [
  { id: "game-1", date: "2026-03-08", opponent: "Macalester College",    location: "Macalester Campus, St. Paul",    isHome: false, result: "W 3-1" },
  { id: "game-2", date: "2026-03-15", opponent: "St. Olaf College",      location: "Carleton Athletic Complex",      isHome: true,  result: "W 2-0" },
  { id: "game-3", date: "2026-03-29", opponent: "Gustavus Adolphus",     location: "Gustavus Campus, Peter MN",      isHome: false, result: "L 1-2" },
  { id: "game-4", date: "2026-04-05", opponent: "Hamline University",    location: "Carleton Athletic Complex",      isHome: true,  result: "W 4-2" },
  { id: "game-5", date: "2026-04-12", opponent: "Bethel University",     location: "Bethel Campus, Arden Hills",     isHome: false, result: "D 1-1" },
  { id: "game-6", date: "2026-04-26", opponent: "St. Thomas University", location: "Carleton Athletic Complex",      isHome: true  },
  { id: "game-7", date: "2026-05-03", opponent: "Augsburg University",   location: "Augsburg Campus, Minneapolis",  isHome: false },
  { id: "game-8", date: "2026-05-10", opponent: "Concordia College",     location: "Carleton Athletic Complex",      isHome: true  },
];

const players2026 = [
  { id: "p1",  name: "Jordan Mills",  number: 1,  position: "GK"  },
  { id: "p2",  name: "Alex Rivera",   number: 4,  position: "DEF" },
  { id: "p3",  name: "Tyler Brooks",  number: 5,  position: "DEF" },
  { id: "p4",  name: "Jake Morris",   number: 14, position: "DEF" },
  { id: "p5",  name: "Sam Hughes",    number: 7,  position: "MID" },
  { id: "p6",  name: "Chris Park",    number: 8,  position: "MID" },
  { id: "p7",  name: "Ryan Scott",    number: 17, position: "MID" },
  { id: "p8",  name: "Mason Clark",   number: 10, position: "MID" },
  { id: "p9",  name: "Noah Turner",   number: 11, position: "FWD" },
  { id: "p10", name: "Ethan Cole",    number: 9,  position: "FWD" },
  { id: "p11", name: "Liam Chen",     number: 22, position: "FWD" },
  { id: "p12", name: "Owen Foster",   number: 2,  position: "DEF" },
  { id: "p13", name: "Lucas Bennett", number: 6,  position: "DEF" },
  { id: "p14", name: "Elijah White",  number: 15, position: "MID" },
  { id: "p15", name: "Henry Johnson", number: 18, position: "FWD" },
];

const players2025 = [
  { id: "p1",  name: "Jordan Mills",  number: 1,  position: "GK"  },
  { id: "p2",  name: "Alex Rivera",   number: 4,  position: "DEF" },
  { id: "p3",  name: "Tyler Brooks",  number: 5,  position: "DEF" },
  { id: "p5",  name: "Sam Hughes",    number: 7,  position: "MID" },
  { id: "p6",  name: "Chris Park",    number: 8,  position: "MID" },
  { id: "p8",  name: "Mason Clark",   number: 10, position: "MID" },
  { id: "p9",  name: "Noah Turner",   number: 11, position: "FWD" },
  { id: "p10", name: "Ethan Cole",    number: 9,  position: "FWD" },
  { id: "p11", name: "Liam Chen",     number: 22, position: "FWD" },
  { id: "p16", name: "Daniel Reyes",  number: 3,  position: "DEF" },
  { id: "p17", name: "Marcus Webb",   number: 13, position: "MID" },
  { id: "p18", name: "Felix Nguyen",  number: 20, position: "FWD" },
];

const rosters = [
  { id: "roster-2025-2026", season: "2025-2026", players: players2026 },
  { id: "roster-2024-2025", season: "2024-2025", players: players2025 },
];

// Club leadership — keyed by season
const leadership = [
  // 2025-2026
  { id: "lead-2526-1", season: "2025-2026", role: "Club President",      name: "Noah Turner",   bio: "Junior, Economics" },
  { id: "lead-2526-2", season: "2025-2026", role: "Club Vice President",  name: "Sam Hughes",    bio: "Junior, Computer Science" },
  { id: "lead-2526-3", season: "2025-2026", role: "Club Treasurer",       name: "Chris Park",    bio: "Sophomore, Mathematics" },
  { id: "lead-2526-4", season: "2025-2026", role: "Captain",              name: "Mason Clark",   bio: "Senior, Political Science" },
  { id: "lead-2526-5", season: "2025-2026", role: "Captain",              name: "Ethan Cole",    bio: "Senior, Biology" },
  { id: "lead-2526-6", season: "2025-2026", role: "Social Captain",       name: "Liam Chen",     bio: "Junior, Psychology" },
  { id: "lead-2526-7", season: "2025-2026", role: "Social Captain",       name: "Ryan Scott",    bio: "Sophomore, Sociology" },
  { id: "lead-2526-8", season: "2025-2026", role: "Freshman Liaison",     name: "Owen Foster",   bio: "Freshman" },

  // 2024-2025
  { id: "lead-2425-1", season: "2024-2025", role: "Club President",      name: "Marcus Webb",   bio: "Senior, Political Science" },
  { id: "lead-2425-2", season: "2024-2025", role: "Club Vice President",  name: "Daniel Reyes",  bio: "Junior, Economics" },
  { id: "lead-2425-3", season: "2024-2025", role: "Club Treasurer",       name: "Felix Nguyen",  bio: "Junior, Mathematics" },
  { id: "lead-2425-4", season: "2024-2025", role: "Captain",              name: "Jordan Mills",  bio: "Senior, Computer Science" },
  { id: "lead-2425-5", season: "2024-2025", role: "Social Captain",       name: "Tyler Brooks",  bio: "Junior, Psychology" },
  { id: "lead-2425-6", season: "2024-2025", role: "Freshman Liaison",     name: "Alex Rivera",   bio: "Freshman" },
];

// --- Seed helpers ---

async function clearCollection(name) {
  const snap = await getDocs(collection(db, name));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  console.log(`  Cleared ${snap.size} existing docs from '${name}'`);
}

async function seedCollection(name, items) {
  await clearCollection(name);
  await Promise.all(items.map(({ id, ...data }) => setDoc(doc(db, name, id), data)));
  console.log(`  Seeded ${items.length} docs into '${name}'`);
}

// --- Run ---

console.log("\nSeeding Firestore...\n");

await seedCollection("coaches", coaches);
await seedCollection("schedule", schedule);
await seedCollection("rosters", rosters);
await seedCollection("leadership", leadership);

console.log("\nDone.\n");
process.exit(0);
