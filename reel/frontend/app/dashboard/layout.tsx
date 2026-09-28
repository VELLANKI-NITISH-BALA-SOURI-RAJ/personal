"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface NavItem {
    href: string;
    label: string;
    icon: string;
    id: string;
}

const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: "◈", id: "nav-dashboard" },
    { href: "/dashboard/reels", label: "My Reels", icon: "⊡", id: "nav-reels" },
    { href: "/dashboard/analytics", label: "Analytics", icon: "⌖", id: "nav-analytics" },
    { href: "/dashboard/generate", label: "Generate Script", icon: "✦", id: "nav-generate" },
    { href: "/dashboard/chat", label: "Growth Assistant", icon: "◎", id: "nav-chat" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) router.replace("/login");
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="spinner" style={{ width: 32, height: 32 }} />
            </div>
        );
    }

    return (
        <div className="app-shell">
            {/* Sidebar */}
            <aside className="sidebar">
                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">📈</div>
                    <div>
                        <div className="sidebar-logo-text">Reel Growth OS</div>
                        <div className="sidebar-logo-sub">Intelligence</div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    <div className="nav-section-label">Core</div>
                    {navItems.slice(0, 3).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            id={item.id}
                            className={`nav-item ${pathname === item.href ? "active" : ""}`}
                        >
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    <div className="nav-section-label" style={{ marginTop: 8 }}>AI</div>
                    {navItems.slice(3).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            id={item.id}
                            className={`nav-item ${pathname === item.href ? "active" : ""}`}
                        >
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    {/* User info */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--color-surface-2)",
                        border: "1px solid var(--color-border)",
                        marginBottom: 8,
                    }}>
                        <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                        }}>
                            {user.email[0].toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {user.email.split("@")[0]}
                            </div>
                            <div style={{ fontSize: 10, color: "var(--color-text-subtle)" }}>Free Plan</div>
                        </div>
                    </div>

                    <button
                        id="logout-btn"
                        onClick={logout}
                        className="btn btn-ghost btn-sm btn-full"
                        style={{ justifyContent: "flex-start", gap: 8 }}
                    >
                        <span>↪</span> Sign out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
