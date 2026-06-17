import type { ReactNode } from "react";

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <header className="app-topbar" aria-label="BlinkaMart app header">
          <a className="brand-lockup" href="/" aria-label="BlinkaMart home">
            <span className="brand-mark" aria-hidden="true">
              B
            </span>
            <span>
              <span className="brand-name">BlinkaMart</span>
              <span className="brand-kicker">Nothing delivered. Crisis managed.</span>
            </span>
          </a>
          <span className="fake-pill">Parody app</span>
        </header>

        <main className="app-content">{children}</main>

        <footer className="app-footer">
          BlinkaMart is a parody self-control app. It does not sell, deliver, or
          process orders.
        </footer>
      </div>
    </div>
  );
}
