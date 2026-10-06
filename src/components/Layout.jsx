import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Target, Trophy, BarChart3, Plus, Bell, Settings, User as UserIcon, LogOut, Menu, ShoppingBag, Info, History, Leaf } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import BrandMark from "@/components/BrandMark";
import UserAvatar from "@/components/UserAvatar";
import TierBadge from "@/components/TierBadge";
import Footer from "@/components/Footer";

const NAV = [
  { to: "/", label: "feed", icon: Home, end: true },
  { to: "/challenges", label: "challenges", icon: Target },
  { to: "/leaderboard", label: "leaderboard", icon: Trophy },
  { to: "/impact", label: "impact", icon: BarChart3 }
];

const MORE = [
  { to: "/shop", label: "shop", icon: ShoppingBag },
  { to: "/about", label: "about", icon: Info },
  { to: "/changelog", label: "changelog", icon: History }
];

function useUnread() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!user) return setCount(0);
    base44.entities.Notification.filter({ user_id: user.id, read: false }, "-created_date", 50)
      .then((n) => setCount(n.length)).catch(() => {});
  }, [user]);
  return count;
}

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const unread = useUnread();

  function handleLogout() { logout(false); navigate("/"); }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Desktop top rail */}
      <header className="sticky top-0 z-40 hidden md:block h-16 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-editorial items-center justify-between px-6">
          <BrandMark />
          <nav className="flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}
                className={({ isActive }) => cn("relative px-3 py-1.5 text-[0.82rem] lowercase tracking-tight transition-colors rounded-md", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                {({ isActive }) => (<>{item.label}{isActive && <span className="absolute inset-x-3 -bottom-[1px] h-px bg-primary" />}</>)}
              </NavLink>
            ))}
            {MORE.map((item) => (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => cn("px-3 py-1.5 text-[0.82rem] lowercase tracking-tight transition-colors rounded-md", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="press bg-primary text-primary-foreground shadow-hard-sm h-9">
              <Link to="/new-record"><Plus className="h-4 w-4" strokeWidth={2.6} /> record</Link>
            </Button>
            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground" aria-label="notifications">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground tabular">{unread}</span>}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-md border border-transparent hover:border-border pl-1 pr-2.5 py-1 transition-colors focus-ring">
                      <UserAvatar user={user} name={user?.full_name} size="sm" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-md border-border bg-surface-card">
                    <DropdownMenuLabel className="text-muted-foreground text-[0.7rem] uppercase tracking-wider lowercase">{user?.full_name || "account"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-sm cursor-pointer"><Link to="/profile"><UserIcon className="h-4 w-4" /> profile</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-sm cursor-pointer"><Link to="/settings"><Settings className="h-4 w-4" /> settings</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-sm cursor-pointer"><Link to="/notifications"><Bell className="h-4 w-4" /> notifications</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-sm cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}><LogOut className="h-4 w-4" /> sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Button asChild variant="ghost" className="shadow-none text-muted-foreground hover:text-foreground"><Link to="/login">sign in</Link></Button>
                <Button asChild className="press bg-primary text-primary-foreground shadow-hard-sm h-9"><Link to="/register">join</Link></Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile top header */}
      <header className="sticky top-0 z-40 md:hidden h-14 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4">
          <BrandMark />
          <div className="flex items-center gap-1.5">
            {isAuthenticated && (
              <Link to="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground">
                <Bell className="h-4 w-4" />
                {unread > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground tabular">{unread}</span>}
              </Link>
            )}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground" aria-label="menu"><Menu className="h-5 w-5" /></button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] border-border bg-background p-0">
                <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
                  <SheetTitle className="font-display lowercase text-2xl text-foreground">menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col px-3 py-3">
                  {[...NAV, ...MORE].map((item) => (
                    <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)}
                      className={({ isActive }) => cn("flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[0.95rem] lowercase", isActive ? "bg-primary/15 text-primary" : "text-foreground hover:bg-secondary")}>
                      <item.icon className="h-4 w-4" /> {item.label}
                    </NavLink>
                  ))}
                  <div className="my-3 h-px bg-border" />
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[0.95rem] lowercase text-foreground hover:bg-secondary"><UserIcon className="h-4 w-4" /> profile</Link>
                      <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[0.95rem] lowercase text-foreground hover:bg-secondary"><Settings className="h-4 w-4" /> settings</Link>
                      <button onClick={() => { setOpen(false); handleLogout(); }} className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[0.95rem] lowercase text-destructive hover:bg-secondary"><LogOut className="h-4 w-4" /> sign out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[0.95rem] lowercase text-foreground hover:bg-secondary"><UserIcon className="h-4 w-4" /> sign in</Link>
                      <Button asChild className="press mt-2 bg-primary text-primary-foreground shadow-hard-sm"><Link to="/register" onClick={() => setOpen(false)}>join greenergyX</Link></Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="relative flex items-center justify-around h-16 px-2">
          {NAV.slice(0, 2).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => cn("flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.62rem] lowercase", isActive ? "text-primary" : "text-muted-foreground")}>
              <item.icon className="h-5 w-5" /> {item.label}
            </NavLink>
          ))}
          <Link to="/new-record" className="press-hard relative -mt-6 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-hard">
            <Plus className="h-6 w-6" strokeWidth={2.6} />
          </Link>
          {NAV.slice(2).map((item) => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => cn("flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.62rem] lowercase", isActive ? "text-primary" : "text-muted-foreground")}>
              <item.icon className="h-5 w-5" /> {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}