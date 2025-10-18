
import { FriendType } from './types';

export const TYPE_COLORS: Record<FriendType, { bg: string; text: string; border: string }> = {
  ART: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  ELEC: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  NORM: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
  PSY: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  STEEL: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', border: 'border-zinc-500/30' },
  DARK: { bg: 'bg-neutral-500/20', text: 'text-neutral-400', border: 'border-neutral-500/30' },
  GRASS: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  WATER: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  FIRE: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

export const PIXEL_BORDER_CLASSES = 'border-4 border-t-neutral-600 border-l-neutral-600 border-b-neutral-800 border-r-neutral-800';

export const PIXEL_BORDER_INSET_CLASSES = 'border-4 border-t-neutral-800 border-l-neutral-800 border-b-neutral-600 border-r-neutral-600';

export const formatDexNumber = (num: number) => `#${String(num).padStart(3, '0')}`;
