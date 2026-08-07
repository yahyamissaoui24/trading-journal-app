import Image from "next/image";
import Link from "next/link";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/logo-icon.png"
      alt="Apex Journal"
      width={size}
      height={size}
      className="rounded-md object-cover"
      style={{ width: size, height: size }}
      priority
    />
  );
}

export function LogoWithWordmark({ size = 32, href }: { size?: number; href?: string }) {
  const content = (
    <div className="flex items-center gap-2">
      <Logo size={size} />
      <span className="font-sans font-semibold text-headline-sm tracking-tight">Apex Journal</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
