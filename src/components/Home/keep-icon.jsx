const GoogleKeepIcon = ({ size = 40 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
    >
      {/* Main yellow body */}
      <path
        fill="#FFC107"
        d="M37,44H11c-1.657,0-3-1.343-3-3V7c0-1.657,1.343-3,3-3h19l10,10v27C40,42.657,38.657,44,37,44z"
      />
      {/* Folded corner */}
      <path fill="#FFD54F" d="M40,14H30V4L40,14z" />
      {/* White lightbulb circle */}
      <circle fill="#FFFFFF" cx="24" cy="24" r="8" />
      {/* White rectangle below circle */}
      <rect fill="#FFFFFF" x="20" y="32" width="8" height="4" />
    </svg>
  );
};

export default GoogleKeepIcon;
