import React from 'react';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      className={className}
      {...props}
    >
      <style>
        {`
          .title {
            font-family: 'PT Sans', sans-serif;
            font-size: 18px;
            font-weight: 700;
            fill: hsl(var(--foreground));
          }
          .subtitle {
            font-family: 'PT Sans', sans-serif;
            font-size: 10px;
            fill: hsl(var(--foreground) / 0.8);
            letter-spacing: 0.2em;
          }
        `}
      </style>
      <text x="50%" y="22" textAnchor="middle" className="title">
        HAIR & RELAX
      </text>
      <text x="50%" y="40" textAnchor="middle" className="subtitle">
        STUDIO
      </text>
    </svg>
  );
}
