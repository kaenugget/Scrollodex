
import React from 'react';
import { useDexEntry } from '../lib/hooks';
import { PIXEL_BORDER_CLASSES, formatDexNumber } from '../lib/utils';
import { PixelFrame } from '../components/PixelFrame';
import { TypeChip } from '../components/TypeChip';
import { StatBar } from '../components/StatBar';
import { MovesList } from '../components/MovesList';
import { EvolutionSteps } from '../components/EvolutionSteps';
import { CryPlayer } from '../components/CryPlayer';
import { BackIcon } from '../components/Icons';

interface DexDetailViewProps {
  friendId: string;
  onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="font-pixel text-lg text-emerald-400 mb-4">{title}</h3>
    {children}
  </div>
);

const DexDetailView: React.FC<DexDetailViewProps> = ({ friendId, onBack }) => {
  const { loading, entry } = useDexEntry(friendId);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!entry) {
    return (
      <div className="text-center py-20">
        <h2 className="font-pixel text-xl text-neutral-500">Friend not found!</h2>
        <button onClick={onBack} className="mt-4 text-emerald-400 hover:underline">Go Back</button>
      </div>
    );
  }

  const PfpComponent = entry.pfp;

  return (
    <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className={`mb-6 inline-flex items-center gap-2 font-pixel text-sm text-neutral-400 hover:text-emerald-400 transition-colors ${PIXEL_BORDER_CLASSES} bg-neutral-800 px-4 py-2`}>
            <BackIcon className="w-4 h-4" />
            Back to Index
        </button>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
            <PixelFrame padding="p-2">
                <div className="bg-neutral-900 aspect-square p-4">
                    <PfpComponent className="w-full h-full" />
                </div>
            </PixelFrame>
            <div className="mt-6">
                <CryPlayer />
            </div>
        </div>
        <div className="lg:col-span-3 space-y-8">
            <div>
                <div className="flex items-baseline gap-4 mb-2">
                    <h1 className="font-pixel text-4xl text-neutral-100">{entry.name}</h1>
                    <span className="font-pixel text-2xl text-neutral-500">{formatDexNumber(entry.dexNumber)}</span>
                </div>
                <div className="flex items-center gap-2">
                    {entry.types.map(type => <TypeChip key={type} type={type} />)}
                </div>
            </div>

            <div className="space-y-2">
                {Object.entries(entry.stats).map(([key, value]) => (
                    <StatBar key={key} name={key as keyof typeof entry.stats} value={value} />
                ))}
            </div>

            <Section title="About">
                <p className="text-neutral-300 leading-relaxed">{entry.about}</p>
            </Section>

            <Section title="Moves">
                <MovesList moves={entry.moves} />
            </Section>

            <Section title="Preferences">
                <div className="flex flex-wrap gap-2">
                    {[...entry.preferences.food, ...entry.preferences.music, ...entry.preferences.hobbies].map(pref => (
                        <div key={pref} className="bg-neutral-700 text-neutral-300 text-sm px-3 py-1 rounded-full">{pref}</div>
                    ))}
                </div>
            </Section>

            <Section title="Evolution">
                <EvolutionSteps currentLevel={entry.level} />
            </Section>
        </div>
      </div>
    </div>
  );
};

const DetailSkeleton: React.FC = () => (
    <div className="max-w-5xl mx-auto animate-pulse">
        <div className={`h-10 w-40 bg-neutral-700 mb-6`}></div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
                <div className="aspect-square bg-neutral-700"></div>
                <div className="h-16 mt-6 bg-neutral-700"></div>
            </div>
            <div className="lg:col-span-3 space-y-8">
                <div>
                    <div className="h-10 w-3/4 bg-neutral-700 rounded mb-3"></div>
                    <div className="flex gap-2">
                        <div className="h-8 w-20 bg-neutral-700 rounded-full"></div>
                        <div className="h-8 w-20 bg-neutral-700 rounded-full"></div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-neutral-700 rounded w-full"></div>
                    <div className="h-4 bg-neutral-700 rounded w-full"></div>
                    <div className="h-4 bg-neutral-700 rounded w-full"></div>
                    <div className="h-4 bg-neutral-700 rounded w-full"></div>
                </div>
                 <div>
                    <div className="h-6 w-1/3 bg-neutral-700 rounded mb-4"></div>
                    <div className="h-16 bg-neutral-700 rounded w-full"></div>
                </div>
                 <div>
                    <div className="h-6 w-1/3 bg-neutral-700 rounded mb-4"></div>
                    <div className="h-24 bg-neutral-700 rounded w-full"></div>
                </div>
            </div>
        </div>
    </div>
);


export default DexDetailView;
