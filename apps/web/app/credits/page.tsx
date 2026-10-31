import type { Metadata } from 'next';
import Image from 'next/image';
import { allPhotos } from '@/lib/images';

export const metadata: Metadata = { title: 'Photo credits' };

export default function CreditsPage() {
  const photos = allPhotos();
  return (
    <div className="container-av py-10 lg:py-14">
      <h1 className="text-h1">Photo credits</h1>
      <p className="mt-2 max-w-2xl">
        The preview uses openly licensed photographs from Wikimedia Commons. Each one is credited here with its licence.
      </p>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <li key={p.key} className="card">
            <div className="relative aspect-[16/10]">
              <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />
            </div>
            <div className="p-4 text-small">
              <p className="font-semibold text-ink-900">{p.alt}</p>
              <p className="mt-1 text-ink-500">
                {p.credit.author} · {p.credit.license} ·{' '}
                <a href={p.credit.page} className="text-primary underline-offset-2 hover:underline" rel="noopener" target="_blank">
                  source
                </a>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
