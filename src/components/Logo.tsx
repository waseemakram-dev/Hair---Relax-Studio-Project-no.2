import React from 'react';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(350, 85%, 50%)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(350, 85%, 60%)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <style>
        {`
          .title {
            font-family: 'PT Sans', sans-serif;
            font-size: 24px;
            font-weight: 700;
            fill: url(#logoGradient);
            letter-spacing: 0.025em;
          }
          .subtitle {
            font-family: 'PT Sans', sans-serif;
            font-size: 16px;
            font-weight: 700;
            fill: url(#logoGradient);
            letter-spacing: 0.05em;
          }
        `}
      </style>
      <text x="50%" y="24" textAnchor="middle" className="title">
        HAIR & RELAX
      </text>
      <text x="50%" y="45" textAnchor="middle" className="subtitle">
        STUDIO
      </text>
    </svg>
  );
}
