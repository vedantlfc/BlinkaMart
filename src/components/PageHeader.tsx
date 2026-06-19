import type { ReactNode } from "react";
import { getCravingDeskLabel } from "../utils/cravingDesk";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}

export function PageHeader({ title, subtitle, trailing }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <p className="page-eyebrow">{getCravingDeskLabel()}</p>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {trailing ? <div className="page-header__trailing">{trailing}</div> : null}
    </div>
  );
}
