import type { SVGProps } from "react";

/** Ícones de marca (Lucide não inclui logos de marcas). */
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={24} height={24} {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.43 9.43 0 0 1-4.81-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.41 9.41 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.2-4.24 9.43-9.44 9.43m8.04-17.47A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.1-1.6a11.33 11.33 0 0 0 5.37 1.37h.01c6.26 0 11.36-5.1 11.36-11.37 0-3.04-1.18-5.89-3.33-8.04" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width={24} height={24} {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/** Frasco de esmalte da logo. */
export function PolishLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative h-[38px] w-[30px] flex-none ${className}`} aria-hidden="true">
      <span className="absolute left-[9px] top-0 h-[15px] w-3 rounded-t-[3px] rounded-b-[1px] bg-cap" />
      <span className="absolute bottom-0 left-[3px] h-[23px] w-6 overflow-hidden rounded-[7px] bg-gradient-to-br from-[#D24C88] to-berry">
        <span className="absolute left-1 top-[3px] h-3 w-1 rounded-[3px] bg-white/60" />
      </span>
    </span>
  );
}

/** Logo completa (frasco + nome), usada no site e no agendamento. */
export function BrandLogo() {
  return (
    <span className="group flex items-center gap-2.5">
      <PolishLogo className="group-hover:animate-wiggle" />
      <span className="grid leading-none">
        <b className="font-display text-[1.1rem] font-black tracking-[-0.04em] text-berry">
          carol <i className="text-raspberry">bocão</i>
        </b>
        <small className="mt-1 whitespace-nowrap text-[.66rem] uppercase tracking-[0.16em] text-ink-soft">Nails &amp; Beauty</small>
      </span>
    </span>
  );
}
