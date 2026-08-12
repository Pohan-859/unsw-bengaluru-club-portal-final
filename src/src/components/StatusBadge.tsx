const styles: Record<string, string> = {
  PENDING: "bg-status-pending-bg text-status-pending",
  APPROVED: "bg-status-approved-bg text-status-approved",
  REJECTED: "bg-status-rejected-bg text-status-rejected",
};

const labels: Record<string, string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export default function StatusBadge({ status }: { status: "PENDING" | "APPROVED" | "REJECTED" | string }) {
  const currentStyle = styles[status] || styles.PENDING;
  const currentLabel = labels[status] || status;

  return (
    <span
      className={`inline-block px-2 py-1 font-mono text-xs font-semibold uppercase tracking-wide ${currentStyle}`}
    >
      {currentLabel}
    </span>
  );
}
