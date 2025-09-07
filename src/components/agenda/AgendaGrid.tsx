import { Table, InputNumber, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useMemo } from 'react';
import type { AgendaItem } from '../../services/agendaStats';
import { useTranslation } from 'react-i18next';

export function AgendaGrid({ items, setItems }:{
  items: AgendaItem[];
  setItems: (rows:AgendaItem[])=>void;
}) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.toLowerCase().startsWith('ar');

  const translateText = (text: string) => {
    if (!isArabic) return text;
    const map: Record<string, string> = {
      'Title': 'العنوان',
      'Mins': 'الدقائق',
      'Conversation': 'المحادثة',
      'Stakeholders': 'أصحاب المصلحة',
      'Employee': 'الموظف',
      'Customer': 'العميل',
      'Supplier': 'المورد',
      'Shareholder': 'المساهم',
      'Community': 'المجتمع',
      'Environment': 'البيئة',
      'Steering': 'التوجيه',
      'Supervising': 'الإشراف',
      'Strategy': 'الإستراتيجية',
      'Performance': 'الأداء',
      'Governance': 'الحوكمة'
    };
    return map[text] || text;
  };

  const columns: ColumnsType<AgendaItem> = useMemo(()=>[
    { title:'#', dataIndex:'idx', width:50 },
    { title: translateText('Title'), dataIndex:'title' },
    {
      title: translateText('Mins'), dataIndex:'minutes', width:100,
      render:(m:number, r)=>(
        <InputNumber min={0} value={m} onChange={(v)=>update(r.id,{minutes:Number(v||0)})}/>
      )
    },
    {
      title: translateText('Conversation'), dataIndex:'tag', width:180,
      render:(v, r)=>(
        <select value={v||''} onChange={e=>update(r.id,{tag:e.target.value})}>
          <option value="">—</option>
          {['Steering','Supervising','Strategy','Performance','Governance'].map(x=>
            <option key={x} value={x}>{translateText(x)}</option>
          )}
        </select>
      )
    },
    {
      title: translateText('Stakeholders'), dataIndex:'stakeholders',
      render:(v:string[]|undefined, r)=>(
        <select multiple value={v||[]} onChange={(e)=>{
          const vals = Array.from(e.target.selectedOptions).map(o=>o.value);
          update(r.id,{stakeholders:vals});
        }}>
          {['Employee','Customer','Supplier','Shareholder','Community','Environment'].map(x=>
            <option key={x} value={x}>{translateText(x)}</option>
          )}
        </select>
      )
    }
  ],[items, isArabic]);

  function update(id:string, patch:Partial<AgendaItem>){
    setItems(items.map(i=>i.id===id?{...i,...patch}:i));
  }
  
  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const rows = Array.from(items);
    const [moved] = rows.splice(result.source.index,1);
    rows.splice(result.destination.index,0,moved);
    const reIdx = rows.map((r, i)=>({...r, idx:i+1}));
    setItems(reIdx);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="agenda">
        {(provided)=>(
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((row, index)=>(
              <Draggable draggableId={row.id} index={index} key={row.id}>
                {(p)=>(
                  <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
                    <Table
                      columns={columns}
                      dataSource={[row]}
                      pagination={false}
                      rowKey="id"
                      size="small"
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
