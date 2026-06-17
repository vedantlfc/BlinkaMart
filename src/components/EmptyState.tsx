export interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <span aria-hidden="true">0</span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
