export type AgendaItem = {
  id: string; idx: number; title: string;
  minutes: number; tag?: string; stakeholders?: string[];
};

export function computeAgendaStats(items: AgendaItem[]) {
  const total = items.reduce((s,i)=>s + (i.minutes||0), 0) || 0;
  const tags = ['Steering','Supervising','Strategy','Performance','Governance'];
  const buckets = tags.map(tag => ({
    tag,
    minutes: items.filter(i=>i.tag===tag).reduce((s,i)=>s+i.minutes,0),
  }));
  const allStakeholders = ['Employee','Customer','Supplier','Shareholder','Community','Environment'];
  const perspective = allStakeholders.map(name => ({
    name, pct: Math.round(
      (items.filter(i=>i.stakeholders?.includes(name))
            .reduce((s,i)=>s+i.minutes,0) / (total||1)) * 100 )
  }));
  return { total, buckets, perspective };
}
