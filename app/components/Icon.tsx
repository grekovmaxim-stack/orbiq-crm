import type { ReactNode } from "react";

export default function Icon({ name, size = 18 }: { name: string; size?: number }) {
  let node: ReactNode = null;

  if (name === "grid") node = <><rect x="4" y="4" width="6" height="6" rx="2"/><rect x="14" y="4" width="6" height="6" rx="2"/><rect x="4" y="14" width="6" height="6" rx="2"/><rect x="14" y="14" width="6" height="6" rx="2"/></>;
  if (name === "people") node = <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>;
  if (name === "company") node = <><path d="M3 21h18"/><path d="M5 21V7l7-4v18"/><path d="M12 9h7v12"/><path d="M8 9v.01M8 13v.01M8 17v.01M15 13v.01M18 13v.01M15 17v.01M18 17v.01"/></>;
  if (name === "deal") node = <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M8 5V3h8v2"/><path d="M3 11h18"/><path d="M10 11v2h4v-2"/></>;
  if (name === "journey") node = <><circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 12h4a4 4 0 0 0 4-4V6h2"/><path d="M7 12h4a4 4 0 0 1 4 4v2h2"/></>;
  if (name === "chart") node = <><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19V3"/></>;
  if (name === "task") node = <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>;
  if (name === "calendar") node = <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>;
  if (name === "search") node = <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>;
  if (name === "bell") node = <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>;
  if (name === "plus") node = <><path d="M12 5v14M5 12h14"/></>;
  if (name === "settings") node = <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3A1.7 1.7 0 0 0 14 21h-4a1.7 1.7 0 0 0-1-1.7 1.7 1.7 0 0 0-1.9.3L4.2 17l.1-.1A1.7 1.7 0 0 0 3 14v-4a1.7 1.7 0 0 0 1.3-2.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 10 3h4a1.7 1.7 0 0 0 2.9 1.3l.1-.1L19.8 7l-.1.1A1.7 1.7 0 0 0 21 10v4a1.7 1.7 0 0 0-1.6 1z"/></>;
  if (name === "dots") node = <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>;
  if (name === "arrow") node = <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>;
  if (name === "check") node = <path d="m5 12 4 4L19 6"/>;
  if (name === "filter") node = <path d="M4 5h16l-6 7v5l-4 2v-7z"/>;
  if (name === "mail") node = <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>;
  if (name === "call") node = <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9z"/>;
  if (name === "close") node = <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>;
  if (name === "chevron") node = <path d="m9 18 6-6-6-6"/>;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {node}
    </svg>
  );
}
