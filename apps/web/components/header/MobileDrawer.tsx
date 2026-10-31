'use client';

import Link from 'next/link';
import { ChevronDown, MessageCircle, Phone, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { navigation } from '@/lib/content';
import { Logo } from '@/components/ui/Logo';

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a, button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-drawer lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="animate-fade absolute inset-0 bg-[var(--surface-overlay)]" onClick={onClose} />
      <div ref={panelRef} className="absolute inset-0 flex flex-col overflow-y-auto bg-surface">
        <div className="flex h-header-sticky items-center justify-between border-b border-line px-4">
          <Logo />
          <button type="button" aria-label="Close menu" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-pill text-ink-900">
            <X className="h-6 w-6" />
          </button>
        </div>
        <ul className="flex-1 divide-y divide-line px-4">
          {navigation.map((item) => {
            const isOpen = expanded === item.id;
            return (
              <li key={item.id}>
                {item.columns ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between py-4 text-left font-semibold text-ink-900"
                      onClick={() => setExpanded(isOpen ? null : item.id)}
                    >
                      {item.label}
                      <ChevronDown aria-hidden className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="animate-fade space-y-5 pb-5">
                        {item.columns.map((col) => (
                          <div key={col.heading}>
                            <p className="eyebrow mb-2">{col.heading}</p>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                              {col.links.map((l) => (
                                <li key={l.label}>
                                  <Link href={l.href} onClick={onClose} className="flex items-center gap-1.5 text-small text-ink-600">
                                    {l.flag && <span aria-hidden>{l.flag}</span>}
                                    {l.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href} onClick={onClose} className="block py-4 font-semibold text-ink-900">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="space-y-3 border-t border-line bg-surface-warm p-4">
          <Link href="/#plan-my-trip" onClick={onClose} className="btn-cta w-full">
            Talk to an expert
          </Link>
          <div className="flex gap-3">
            <a href="tel:+911800000000" className="btn-outline flex-1">
              <Phone aria-hidden className="h-4 w-4" /> Call
            </a>
            <a href="https://wa.me/911800000000" className="btn-outline flex-1">
              <MessageCircle aria-hidden className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
