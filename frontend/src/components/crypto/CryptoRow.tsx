/*
 * Table row used for crypto listings on Explore and Home.
 * Displays the logo, price data, and a green/red 24h badge.
 */
import { useNavigate } from "react-router-dom";

export type CryptoAsset = {
  _id: string;
  name: string;
  symbol: string;
  logo?: string;
  price: number;
  change24h: number;
  marketCap: number;
  rank?: number;
  createdAt?: string;
  description?: string;
};

type CryptoRowProps = {
  crypto: CryptoAsset;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

function formatMarketCap(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function CryptoRow({ crypto }: CryptoRowProps) {
  const navigate = useNavigate();
  const changeIsPositive = crypto.change24h >= 0;

  return (
    <tr
      className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50"
      onClick={() => navigate(`/asset/${crypto.symbol}`)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          navigate(`/asset/${crypto.symbol}`);
        }
      }}
    >
      <td className="px-4 py-4 text-sm text-slate-500">{crypto.rank ?? "-"}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src={crypto.logo || "https://placehold.co/40x40/0052ff/ffffff?text=C"}
            alt={crypto.name}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{crypto.name}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{crypto.symbol}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-slate-900">{formatPrice(crypto.price)}</td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            changeIsPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {changeIsPositive ? "+" : ""}{crypto.change24h.toFixed(2)}%
        </span>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-slate-900">{formatMarketCap(crypto.marketCap)}</td>
    </tr>
  );
}

export default CryptoRow;