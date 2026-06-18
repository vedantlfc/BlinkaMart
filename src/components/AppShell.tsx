import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <header className="app-topbar" aria-label="BlinkaMart app header">
          <Link className="brand-lockup" to="/" aria-label="BlinkaMart home">
            <span className="brand-mark" aria-hidden="true">
              B
            </span>
            <span>
              <span className="brand-name">BlinkaMart</span>
              <span className="brand-kicker">Cravings meet theatre.</span>
            </span>
          </Link>
          <span className="parody-pill">Parody app</span>
        </header>

        <main className="app-content">{children}</main>

        <footer className="app-footer">
          Cart rituals, tiny trophies, excellent timing.
        </footer>
      </div>
    </div>
  );
}
