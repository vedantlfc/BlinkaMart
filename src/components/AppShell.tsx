import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <header className="app-topbar" aria-label="DopeCart app header">
          <Link className="brand-lockup" to="/" aria-label="DopeCart home">
            <span className="brand-logo" aria-hidden="true">
              <img src="/dopecart-logo-web.svg" alt="" />
            </span>
            <span className="brand-copy">
              <span className="brand-name">DopeCart</span>
              <span className="brand-kicker">We deliver Dopamine</span>
            </span>
          </Link>
          <span className="parody-pill">Parody app</span>
        </header>

        <main className="app-content">{children}</main>

        <footer className="app-footer">
          Tiny trophies, excellent timing.
        </footer>
      </div>
    </div>
  );
}
