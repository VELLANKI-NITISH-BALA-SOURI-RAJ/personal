"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return toast.error("Please fill in all fields");
        if (password.length < 6) return toast.error("Password must be at least 6 characters");

        setLoading(true);
        try {
            if (mode === "login") {
                await login(email, password);
                toast.success("Welcome back!");
            } else {
                await register(email, password);
                toast.success("Account created! Let's grow.");
            }
            router.push("/dashboard");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { detail?: string } } };
            toast.error(error?.response?.data?.detail || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Background glows */}
            <div
                className="auth-bg-glow"
                style={{
                    width: 600,
                    height: 600,
                    background: "rgba(108, 71, 255, 0.08)",
                    top: -200,
                    left: -200,
                }}
            />
            <div
                className="auth-bg-glow"
                style={{
                    width: 400,
                    height: 400,
                    background: "rgba(0, 212, 170, 0.06)",
                    bottom: -100,
                    right: -100,
                }}
            />

            <div className="auth-card">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">📈</div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--color-text)" }}>
                            Reel Growth OS
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Performance Intelligence
                        </div>
                    </div>
                </div>

                <h1 className="auth-title">
                    {mode === "login" ? "Welcome back" : "Start growing smarter"}
                </h1>
                <p className="auth-subtitle">
                    {mode === "login"
                        ? "Sign in to your growth dashboard"
                        : "Create your account — it's free to get started"}
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder={mode === "register" ? "At least 6 characters" : "••••••••"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                            required
                        />
                    </div>

                    <button
                        id="auth-submit-btn"
                        type="submit"
                        className="btn btn-primary btn-full btn-lg"
                        disabled={loading}
                        style={{ marginTop: 8 }}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: 16, height: 16, borderTopColor: "white" }} />
                                {mode === "login" ? "Signing in..." : "Creating account..."}
                            </>
                        ) : mode === "login" ? (
                            "Sign in →"
                        ) : (
                            "Create account →"
                        )}
                    </button>
                </form>

                <div className="auth-switch">
                    {mode === "login" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <a id="switch-to-register" onClick={() => setMode("register")}>Sign up free</a>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <a id="switch-to-login" onClick={() => setMode("login")}>Sign in</a>
                        </>
                    )}
                </div>

                {/* Value props */}
                <div style={{ marginTop: 28, padding: 16, background: "var(--color-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-subtle)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                        What you get
                    </div>
                    {[
                        "📊 Performance-based engagement analytics",
                        "🤖 AI scripts informed by YOUR data",
                        "💬 Growth assistant with live context",
                        "🎯 Pattern detection across your reels",
                    ].map((item) => (
                        <div key={item} style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
