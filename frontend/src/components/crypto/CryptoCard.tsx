/*
 * Grid card version of the crypto listing row.
 * Used on the homepage sections for gainers and new listings.
 */
import { Link } from "react-router-dom";
import type { CryptoAsset } from "./CryptoRow";

type CryptoCardProps = {
  crypto: CryptoAsset;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

function CryptoCard({ crypto }: CryptoCardProps) {
  const changeIsPositive = crypto.change24h >= 0;

  return (
    <Link
      to={`/asset/${crypto.symbol}`}
      className="group block rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-[#0052ff]/30"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={crypto.logo || "https://placehold.co/40x40/0052ff/ffffff?text=C"}
            alt={crypto.name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{crypto.name}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{crypto.symbol}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            changeIsPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {changeIsPositive ? "+" : ""}{crypto.change24h.toFixed(2)}%
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Price</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{formatPrice(crypto.price)}</p>
        </div>
        <div className="text-right text-sm text-slate-500 group-hover:text-slate-700">
          <p>View details</p>
          <p className="text-[#0052ff]">Trade now</p>
        </div>
      </div>
    </Link>
  );
}

export default CryptoCard;