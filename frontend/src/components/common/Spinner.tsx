/*
 * Simple loading indicator used while API requests are in flight.
 * Keeps the loading state visually consistent across public pages.
 */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-10" aria-live="polite" aria-busy="true">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0052ff]" />
    </div>
  );
}

export default Spinner;