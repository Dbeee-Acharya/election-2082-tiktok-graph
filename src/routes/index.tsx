import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";
import { PARTIES, type Party } from "../constants/party-data";

// NOTE: credentials are visible in the JS bundle — this is a basic deterrent only
const CREDENTIALS = {
  username: "election2082tiktok",
  password: "havingfunwithelection@2082",
};

function useAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(sessionStorage.getItem("authed") === "1");
  }, []);

  const login = (u: string, p: string) => {
    if (u === CREDENTIALS.username && p === CREDENTIALS.password) {
      sessionStorage.setItem("authed", "1");
      setAuthed(true);
      return true;
    }
    return false;
  };

  return { authed, login };
}

const DUMMY_RESULTS: Record<string, number> = {
  NC: 80,
  UML: 87,
  NCP: 34,
  RSP: 21,
  RPP: 14,
  UNP: 8,
  SSP: 5,
};

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { authed, login } = useAuth();

  if (authed === null) return null;
  if (!authed) return <LoginScreen onLogin={login} />;
  return <Dashboard />;
}

function LoginScreen({
  onLogin,
}: {
  onLogin: (u: string, p: string) => boolean;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(username, password);
    if (!ok) {
      setError(true);
      setPassword("");
    }
  };

  return (
    <main className="min-h-dvh bg-[#0b0b0e] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xs flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight">
            Election Results 2082
          </h1>
          <p className="text-white/40 text-sm">
            Enter your credentials to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(false);
            }}
            className="bg-white/[0.06] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/25 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="bg-white/[0.06] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/25 transition-colors"
          />
          {error && (
            <p className="text-rose-400 text-xs">
              Incorrect username or password.
            </p>
          )}
          <button
            type="submit"
            className="mt-1 bg-white text-black font-semibold text-sm rounded-lg py-3 hover:bg-white/90 active:bg-white/80 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

function Dashboard() {
  const results = PARTIES.map((p) => ({
    ...p,
    seats: DUMMY_RESULTS[p.abbreviation] ?? 0,
  })).sort((a, b) => b.seats - a.seats);

  const maxSeats = results[0]?.seats ?? 1;

  return (
    <main className="min-h-dvh bg-[#0b0b0e] text-white flex justify-center px-4 py-6">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              LIVE
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Election Results 2082
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              First-Past-The-Post · Constituencies Leading
            </p>
          </div>
        </div>

        {/* Majority indicator */}
        <div className="flex items-center gap-3 bg-white/[0.03] mb-4 mt-2 rounded-xl px-4 py-3 border border-white/5">
          <div className="h-8 w-px bg-white/10" />
          <p className="text-xs text-white/40 leading-relaxed">
            A party needs{" "}
            <span className="text-white/70 font-medium">83 seats</span> to form
            a majority government in the FPTP election.
          </p>
        </div>

        {/* Bar Chart */}
        <div className="flex flex-col gap-6">
          {results.map((party, i) => (
            <motion.div
              key={party.abbreviation}
              layout
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <ResultRow
                party={party}
                seats={party.seats}
                maxSeats={maxSeats}
                rank={i + 1}
                isMajority={party.seats >= 83}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-white/15 text-[10px] pb-2">
          Updates every 2 minutes· Ekantipur Election.
        </p>
      </div>
    </main>
  );
}

function ResultRow({
  party,
  seats,
  maxSeats,
  rank,
  isMajority,
}: {
  party: Party;
  seats: number;
  maxSeats: number;
  rank: number;
  isMajority: boolean;
}) {
  const pct = (seats / maxSeats) * 100;

  return (
    <div className="flex items-center gap-3">
      {/* Logo */}
      <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/[0.08] flex items-center justify-center">
        <img
          src={party.logo_url}
          alt={party.abbreviation}
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {/* Abbreviation */}
      <span className="text-[14px] font-bold w-9 shrink-0 text-white/60 tracking-wide">
        {party.abbreviation}
      </span>

      {/* Bar */}
      <div className="flex-1 relative h-8">
        {/* Track */}
        <div className="absolute inset-0 rounded-md bg-white/[0.04]" />
        {/* Fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-md"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            backgroundColor: party.color,
            boxShadow: `0 0 16px ${party.color}33`,
          }}
        />
        {/* Top shine */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-lg pointer-events-none overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-lg" />
        </motion.div>
        {/* Majority badge inside bar */}
        {isMajority && (
          <div
            className="absolute right-2 inset-y-0 flex items-center"
            style={{ mixBlendMode: "overlay" }}
          >
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">
              Majority
            </span>
          </div>
        )}
      </div>

      {/* Count */}
      <span className="text-white font-bold text-sm w-7 text-right shrink-0 tabular-nums">
        {seats}
      </span>
    </div>
  );
}
