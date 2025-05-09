const LightModeIcon = ({ onClick }: { onClick?: () => void }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.81748 0.899658C3.10575 0.899658 0.899658 3.10618 0.899658 5.81792C0.899658 8.52966 3.10575 10.7362 5.81748 10.7362C8.52879 10.7362 10.7353 8.53009 10.7353 5.81792C10.7353 3.10575 8.52879 0.899658 5.81748 0.899658Z"
      fill="#858BB2"
    />
  </svg>
);
export default LightModeIcon;
