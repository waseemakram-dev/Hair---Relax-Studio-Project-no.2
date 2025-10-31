import React from 'react';

export function ReceiptLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 250 50"
      className={className}
      {...props}
    >
      <style>
        {`
          .title-receipt {
            font-family: serif;
            font-size: 24px;
            font-weight: 600;
            fill: #000000;
            letter-spacing: 0.05em;
          }
          .address {
            font-family: sans-serif;
            font-size: 10px;
            fill: #333333;
          }
        `}
      </style>
      <text x="50%" y="22" textAnchor="middle" className="title-receipt">
        HAIR & RELAX STUDIO
      </text>
      <text x="50%" y="36" textAnchor="middle" className="address">
        13/G Road, Gulshan-e-Batool Colony, Chishtian
      </text>
      <text x="50%" y="48" textAnchor="middle" className="address">
        +923230284330
      </text>
    </svg>
  );
}
