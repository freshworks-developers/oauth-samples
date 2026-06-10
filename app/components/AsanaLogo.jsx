import React from 'react';

export default function AsanaLogo({ size = 28 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="asana-logo-mark"
    >
      <defs>
        <radialGradient id="asana-sidebar-g" cx="32" cy="32" r="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffb900" />
          <stop offset="0.6" stopColor="#f95d8f" />
          <stop offset="1" stopColor="#f95353" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="21" r="9.5" fill="url(#asana-sidebar-g)" />
      <circle cx="19" cy="41" r="9.5" fill="url(#asana-sidebar-g)" />
      <circle cx="45" cy="41" r="9.5" fill="url(#asana-sidebar-g)" />
    </svg>
  );
}
