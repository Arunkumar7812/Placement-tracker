import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Radar,
  ListChecks,
  BookOpen,
  Target,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/skills", label: "Skills", icon: Radar },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/placement-prep", label: "Placement Prep", icon: BookOpen },
  { to: "/weekly-goals", label: "Weekly Goals", icon: Target },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-yellow text-bg font-display font-bold">
          PT
        </div>
        <div>
          <p className="font-display text-sm font-semibold tracking-wide text-ink">
            Placement<span className="text-yellow">Tracker</span>
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-yellow-soft text-yellow border border-yellow/30"
                  : "text-ink-muted hover:bg-surface-2 hover:text-ink"
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-3 py-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-semibold text-bg"
            style={{ backgroundColor: user?.avatar_color || "#FFC400" }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
            <p className="truncate text-xs text-ink-muted">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={18} strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
}
