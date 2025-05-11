export const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "paid":
      return <PaidIcon />;
    case "pending":
      return <PendingIcon />;
    case "draft":
      return <DraftIcon />;
    default:
      return null;
  }
};

const PendingIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4" cy="4" r="4" fill="#FF8F00" />
  </svg>
);

const DraftIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4" cy="4" r="4" fill="#currentColor" />
  </svg>
);
const PaidIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4" cy="4" r="4" fill="#33D69F" />
  </svg>
);
