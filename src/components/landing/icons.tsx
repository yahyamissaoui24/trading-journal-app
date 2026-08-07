function IconBase({ children }: { children: React.ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function IconLayers() {
  return (
    <IconBase>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 18 9 5 9-5" />
    </IconBase>
  );
}

export function IconImage() {
  return (
    <IconBase>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16.5 15.5 11 4 21" />
    </IconBase>
  );
}

export function IconStar() {
  return (
    <IconBase>
      <path d="M12 2.5l3.09 6.26L21.5 9.6l-5 4.87L17.68 21 12 17.77 6.32 21l1.18-6.53-5-4.87 6.41-.84L12 2.5Z" />
    </IconBase>
  );
}

export function IconChart() {
  return (
    <IconBase>
      <path d="M4 20V10" />
      <path d="M11 20V4" />
      <path d="M18 20v-7" />
    </IconBase>
  );
}

export function IconPencil() {
  return (
    <IconBase>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </IconBase>
  );
}

export function IconCoin() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6" />
      <path d="M12 8v8" />
    </IconBase>
  );
}
