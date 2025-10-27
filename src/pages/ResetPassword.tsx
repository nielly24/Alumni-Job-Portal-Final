import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Extract token info from the URL hash (added by Supabase email link)
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token) {
        console.log("🔑 Found access token, setting session...");
        // Use the Supabase client to set the auth session properly
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(({ error }) => {
            if (error) {
              console.error("Failed to set session:", error.message);
              setMessage("❌ Failed to restore session: " + error.message);
            } else {
              console.log("✅ Auth session restored");
              setIsReady(true);
            }
          });
      }
    } else {
      // If no token is found, block password input
      setMessage("⚠️ Invalid or expired reset link.");
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!isReady) {
      setMessage("⚠️ Session not initialized yet. Please refresh this page.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("Update failed:", error.message);
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/auth"; // redirect to login
      }, 2000);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Reset Your Password</h2>

      {message && <p>{message}</p>}

      {isReady ? (
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ margin: "10px", padding: "8px" }}
          />
          <button type="submit" style={{ padding: "8px 16px" }}>
            Update Password
          </button>
        </form>
      ) : (
        <p>Loading password reset session...</p>
      )}
    </div>
  );
}
