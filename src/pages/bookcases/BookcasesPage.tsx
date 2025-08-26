import { Typography, Divider } from 'antd';
import { BookcaseShelf } from '../../components/bookcase/BookcaseShelf';
import { ShelfToolbar } from '../../components/bookcase/ShelfToolbar';
import type { PackCardModel } from '../../components/bookcase/PackCard';

export default function BookcasesPage() {
  const demoPacks = (committee: string, year: number): PackCardModel[] => [
    { id: 'p1', committeeName: committee, monthLabel: 'August', year, version: 3, status: 'new' },
    { id: 'p2', committeeName: committee, monthLabel: 'July', year, version: 2, status: 'updated' },
    { id: 'p3', committeeName: committee, monthLabel: 'June', year, version: 1, status: 'draft' },
    { id: 'p4', committeeName: committee, monthLabel: 'May', year, version: 4, status: 'published' },
    { id: 'p5', committeeName: committee, monthLabel: 'April', year, version: 5, status: 'published' },
  ];

  function openPack(id: string) { window.location.href = `/pack/${id}`; }
  function openTimeline(id: string) { window.location.href = `/pack/${id}?tab=timeline`; }

  return (
    <div className="bi-bg" style={{ padding: 24 }}>
      <Typography.Title level={3} style={{ marginTop: 8 }}>Bookcase</Typography.Title>
      <ShelfToolbar onSearch={() => {}} onNew={() => window.alert('New pack wizard (demo)')} />
      <Divider />

      <BookcaseShelf title="MAIN BOARD" packs={demoPacks('Main Board', 2025)} onOpen={openPack} onTimeline={openTimeline} />
      <BookcaseShelf title="EXEC COMMITTEE" packs={demoPacks('Exec Committee', 2025)} onOpen={openPack} onTimeline={openTimeline} />
      <BookcaseShelf title="AUDIT COMMITTEE" packs={demoPacks('Audit Committee', 2025)} onOpen={openPack} onTimeline={openTimeline} />
    </div>
  );
}
