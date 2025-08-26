// src/components/bookcase/BookcaseShelf.tsx
import { PlannerCard } from './PlannerCard';
import { PackCard } from './PackCard';
import type { PackCardModel } from './types';
import '../../styles/bookcase.css';

export function BookcaseShelf({
  title, packs, onOpen, onTimeline, showPlanner=true, plannerCount=0
}:{
  title:string;
  packs: PackCardModel[];
  onOpen:(id:string)=>void;
  onTimeline:(id:string)=>void;
  showPlanner?: boolean;
  plannerCount?: number;
}) {
  return (
    <section className="bi-shelf">
      <div className="bi-shelf-grid">
        {showPlanner && <PlannerCard onClick={()=>onTimeline?.('planner')} unpublishedCount={plannerCount} />}

        {packs.map(p => (
          <PackCard key={p.id} pack={p} onOpen={onOpen} onTimeline={onTimeline} />
        ))}
      </div>

      <div className="bi-shelf-bar" aria-hidden="true"/>
      <div className="bi-shelf-label">{title.toUpperCase()}</div>
    </section>
  );
}
