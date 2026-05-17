import { API_BASE } from "../api/axios.js";

export default function ApiConfigBanner() {
  if (API_BASE) return null;

  return (
    <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
      <strong>Configuration issue:</strong> VITE_API_URL is missing in this build.
      Set it in Railway client variables to your backend URL ending with{" "}
      <code className="text-amber-100">/api</code> and redeploy.
    </div>
  );
}
