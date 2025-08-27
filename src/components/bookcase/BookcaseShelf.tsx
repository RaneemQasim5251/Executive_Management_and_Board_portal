import React from 'react';
import { PackCard, PackCardModel } from './PackCard';

export function BookcaseShelf({
  title, packs, onOpen, onTimeline, rtl=false
}:{
  title: string;
  packs: PackCardModel[];
  onOpen:(id:string)=>void;
  onTimeline:(id:string)=>void;
  rtl?: boolean;
}) {
  return (
    <section className={rtl ? 'wood-shelf rtl' : 'wood-shelf'}>
      {/* شريط الخشب السفلي */}
      <div className="wood-shelf__bar">
        <div className="wood-shelf__grain" />
        <div className="wood-shelf__lip" />
        <div className="wood-shelf__label">{title}</div>
      </div>

      {/* الشبكة */}
      <div className="wood-shelf__grid">
        {packs.map(p => (
          <div key={p.id} className="wood-shelf__cell">
            <PackCard pack={p} onOpen={onOpen} onTimeline={onTimeline} rtl={rtl} />
          </div>
        ))}
      </div>
    </section>
  );
}
