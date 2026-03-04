import { createFileRoute } from "@tanstack/react-router";
import { PARTIES, type Party } from "../constants/party-data";

const DUMMY_RESULTS: Record<string, number> = {
  NC: 89,
  UML: 78,
  NCP: 34,
  RSP: 21,
  RPP: 14,
  UNP: 8,
  SSP: 5,
};

const TOTAL_SEATS = 165;

export const Route = createFileRoute("/")({ component: App });

function App() {
  const results = PARTIES.map((p) => ({
    ...p,
    seats: DUMMY_RESULTS[p.abbreviation] ?? 0,
  })).sort((a, b) => b.seats - a.seats);

  const maxSeats = results[0]?.seats ?? 1;
  const totalDeclared = results.reduce((s, r) => s + r.seats, 0);

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
        <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
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
            <ResultRow
              key={party.abbreviation}
              party={party}
              seats={party.seats}
              maxSeats={maxSeats}
              rank={i + 1}
              isMajority={party.seats >= 83}
            />
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-white/15 text-[10px] pb-2">
          Updates every 30 seconds · Election Commission of Nepal
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
      {/* Rank */}
      <span className="text-white/20 text-[11px] font-mono w-4 text-right shrink-0 select-none">
        {rank}
      </span>

      {/* Logo */}
      <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/[0.08] flex items-center justify-center">
        <img
          src={party.logo_url}
          alt={party.abbreviation}
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {/* Abbreviation */}
      <span className="text-[11px] font-bold w-8 shrink-0 text-white/60 tracking-wide">
        {party.abbreviation}
      </span>

      {/* Bar */}
      <div className="flex-1 relative h-9">
        {/* Track */}
        <div className="absolute inset-0 rounded-lg bg-white/[0.04]" />
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-lg"
          style={{
            width: `${pct}%`,
            backgroundColor: party.color,
            boxShadow: `0 0 16px ${party.color}33`,
          }}
        />
        {/* Top shine */}
        <div
          className="absolute inset-y-0 left-0 rounded-lg pointer-events-none overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-lg" />
        </div>
        {/* Majority badge inside bar */}
        {isMajority && (
          <div
            className="absolute right-2 inset-y-0 flex items-center"
            style={{ mixBlendMode: "overlay" }}
          >
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">
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
