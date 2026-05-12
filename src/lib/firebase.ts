import { initializeApp, getApps, getApp, } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  limit,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// --- Types ---

export interface Coach {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  photoUrl?: string;
}

export interface ScheduleGame {
  id: string;
  /** ISO date string: YYYY-MM-DD */
  date: string;
  opponent: string;
  location: string;
  isHome: boolean;
  result?: string;
}

export interface Roster {
  id: string;
  /** e.g. "2024-2025" */
  season: string;
  players: Player[];
}

export interface LeadershipEntry {
  id: string;
  name: string;
  role: string;
  season: string;
  bio?: string;
}

// --- Read helpers ---

export async function getCoach(): Promise<Coach | null> {
  const snap = await getDocs(query(collection(db, "coaches"), limit(1)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Coach;
}

export async function getSchedule(): Promise<ScheduleGame[]> {
  const snap = await getDocs(query(collection(db, "schedule"), orderBy("date")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ScheduleGame));
}

export async function getNextMatch(): Promise<ScheduleGame | null> {
  const today = new Date().toISOString().split("T")[0];
  const snap = await getDocs(
    query(collection(db, "schedule"), where("date", ">=", today), orderBy("date"), limit(1))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as ScheduleGame;
}

export async function getRosters(): Promise<Roster[]> {
  const snap = await getDocs(query(collection(db, "rosters"), orderBy("season", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Roster));
}

export async function getLeadership(season?: string): Promise<LeadershipEntry[]> {
  const snap = await getDocs(query(collection(db, "leadership"), orderBy("season", "desc")));
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeadershipEntry));
  return season ? all.filter((e) => e.season === season) : all;
}

export async function getLeadershipSeasons(): Promise<string[]> {
  const snap = await getDocs(query(collection(db, "leadership"), orderBy("season", "desc")));
  return [...new Set(snap.docs.map((d) => (d.data() as LeadershipEntry).season))];
}

// --- Write helpers: Coach ---

export async function saveCoach(id: string | null, data: Omit<Coach, "id">): Promise<string> {
  if (id) {
    await setDoc(doc(db, "coaches", id), data);
    return id;
  }
  const ref = await addDoc(collection(db, "coaches"), data);
  return ref.id;
}

export async function deleteCoach(id: string): Promise<void> {
  await deleteDoc(doc(db, "coaches", id));
}

// --- Write helpers: Schedule ---

export async function addGame(data: Omit<ScheduleGame, "id">): Promise<void> {
  await addDoc(collection(db, "schedule"), data);
}

export async function updateGame(id: string, data: Omit<ScheduleGame, "id">): Promise<void> {
  await setDoc(doc(db, "schedule", id), data);
}

export async function deleteGame(id: string): Promise<void> {
  await deleteDoc(doc(db, "schedule", id));
}

// --- Write helpers: Roster / Players ---

export async function createSeason(season: string): Promise<string> {
  const ref = await addDoc(collection(db, "rosters"), { season, players: [] });
  return ref.id;
}

export async function addPlayerToRoster(
  rosterId: string,
  playerData: Omit<Player, "id">
): Promise<void> {
  const snap = await getDoc(doc(db, "rosters", rosterId));
  if (!snap.exists()) throw new Error("Roster not found");
  const roster = snap.data() as Omit<Roster, "id">;
  const player: Player = { ...playerData, id: `p-${Date.now()}` };
  await setDoc(doc(db, "rosters", rosterId), {
    ...roster,
    players: [...roster.players, player],
  });
}

export async function updatePlayerInRoster(
  rosterId: string,
  playerId: string,
  data: Omit<Player, "id">
): Promise<void> {
  const snap = await getDoc(doc(db, "rosters", rosterId));
  if (!snap.exists()) throw new Error("Roster not found");
  const roster = snap.data() as Omit<Roster, "id">;
  const players = roster.players.map((p: Player) =>
    p.id === playerId ? { ...data, id: playerId } : p
  );
  await setDoc(doc(db, "rosters", rosterId), { ...roster, players });
}

export async function removePlayerFromRoster(
  rosterId: string,
  playerId: string
): Promise<void> {
  const snap = await getDoc(doc(db, "rosters", rosterId));
  if (!snap.exists()) throw new Error("Roster not found");
  const roster = snap.data() as Omit<Roster, "id">;
  const players = roster.players.filter((p: Player) => p.id !== playerId);
  await setDoc(doc(db, "rosters", rosterId), { ...roster, players });
}

// --- Write helpers: Leadership ---

export async function addLeadershipEntry(data: Omit<LeadershipEntry, "id">): Promise<void> {
  await addDoc(collection(db, "leadership"), data);
}

export async function updateLeadershipEntry(
  id: string,
  data: Omit<LeadershipEntry, "id">
): Promise<void> {
  await setDoc(doc(db, "leadership", id), data);
}

export async function deleteLeadershipEntry(id: string): Promise<void> {
  await deleteDoc(doc(db, "leadership", id));
}
