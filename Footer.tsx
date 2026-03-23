'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Hide footer on homepage
  if (pathname === '/') {
    return null;
  }

  return (
    <footer className="bg-black border-t border-white/10">
      {/* Footer links */}
      <div className="flex flex-wrap items-center justify-between px-6 lg:px-[100px] py-6 text-[11px] tracking-[0.15em]">
        <div className="flex items-center gap-8">
          <Link href="/legals" className="opacity-50 hover:opacity-100 transition-opacity">
            {t('footer.legals')}
          </Link>
          <a
            href="https://beaucoup.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            {t('footer.credits')}
          </a>
        </div>

        <div className="flex items-center gap-8">
          <a
            href="https://www.instagram.com/firstframeprods/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            INSTAGRAM
          </a>
          <a
            href="https://www.youtube.com/channel/UCwiLkj2Wys10WyykgrLyADw"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            YOUTUBE
          </a>
          <a
            href="https://vimeo.com/firstframeprod"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            VIMEO
          </a>
          <a
            href="https://www.linkedin.com/company/first-frame-production"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            LINKEDIN
          </a>
        </div>
      </div>
    </footer>
  );
}
