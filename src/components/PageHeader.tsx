import { useEffect, useState, type ReactNode } from "react";
import { getCravingDeskLabel } from "../utils/cravingDesk";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}

export function PageHeader({ title, subtitle, trailing }: PageHeaderProps) {
  const [deskLabel, setDeskLabel] = useState(() => getCravingDeskLabel());

  useEffect(() => {
    const updateDeskLabel = () => setDeskLabel(getCravingDeskLabel());
    const intervalId = window.setInterval(updateDeskLabel, 60_000);

    updateDeskLabel();
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="page-header">
      <div>
        <p className="page-eyebrow">{deskLabel}</p>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {trailing ? <div className="page-header__trailing">{trailing}</div> : null}
    </div>
  );
}
