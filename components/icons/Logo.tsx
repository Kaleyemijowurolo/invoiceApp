import styles from "./icons.module.scss";
const Logo = () => (
  <div>
    <div className={styles.desktopLogo}>
      <svg
        width="103"
        height="103"
        viewBox="0 0 103 103"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0H83C94.0457 0 103 8.9543 103 20V83C103 94.0457 94.0457 103 83 103H0V0Z"
          fill="#7C5DFA"
        />
        <mask
          id="mask0_1_34"
          //   style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="103"
          height="103"
        >
          <path
            d="M0 0H83C94.0457 0 103 8.9543 103 20V83C103 94.0457 94.0457 103 83 103H0V0Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_1_34)">
          <path
            d="M103 52H20C8.95431 52 0 60.9543 0 72V135C0 146.046 8.95431 155 20 155H103V52Z"
            fill="#9277FF"
          />
        </g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.6942 33.2922L52 51.9999L61.3058 33.2922C67.6645 36.6407 72 43.314 72 50.9999C72 62.0456 63.0457 70.9999 52 70.9999C40.9543 70.9999 32 62.0456 32 50.9999C32 43.314 36.3355 36.6407 42.6942 33.2922Z"
          fill="white"
        />
      </svg>
    </div>

    <div className={styles.tabletLogo}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0H60C71.0457 0 80 8.95431 80 20V60C80 71.0457 71.0457 80 60 80H0V0Z"
          fill="#7C5DFA"
        />
        <mask
          id="mask0_1_307"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="80"
          height="80"
        >
          <path
            d="M0 0H60C71.0457 0 80 8.95431 80 20V60C80 71.0457 71.0457 80 60 80H0V0Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_1_307)">
          <path
            d="M80 40.3887H20C8.95431 40.3887 0 49.343 0 60.3887V100.389C0 111.434 8.95431 120.389 20 120.389H80V40.3887Z"
            fill="#9277FF"
          />
        </g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M33.288 26L40.5 40.3876L47.712 26C52.64 28.5753 56 33.7075 56 39.6185C56 48.1134 49.0604 54.9999 40.5 54.9999C31.9396 54.9999 25 48.1134 25 39.6185C25 33.7075 28.36 28.5753 33.288 26Z"
          fill="white"
        />
      </svg>
    </div>

    <div className={styles.mobileLogo}>
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0H52C63.0457 0 72 8.95431 72 20V52C72 63.0457 63.0457 72 52 72H0V0Z"
          fill="#7C5DFA"
        />
        <mask
          id="mask0_0_1479"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="72"
          height="72"
        >
          <path
            d="M0 0H52C63.0457 0 72 8.95431 72 20V52C72 63.0457 63.0457 72 52 72H0V0Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_0_1479)">
          <path
            d="M72 36.3496H20C8.95431 36.3496 0 45.3039 0 56.3496V88.3496C0 99.3953 8.95431 108.35 20 108.35H72V36.3496Z"
            fill="#9277FF"
          />
        </g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.486 23.0003L36 35.8995L42.514 23.0003C46.9652 25.3092 50 29.9105 50 35.21C50 42.8261 43.732 49.0002 36 49.0002C28.268 49.0002 22 42.8261 22 35.21C22 29.9105 25.0348 25.3092 29.486 23.0003Z"
          fill="white"
        />
      </svg>
    </div>
  </div>
);

export default Logo;
