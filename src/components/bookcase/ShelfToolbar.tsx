import { Space, Input, Select, Button } from 'antd';

export function ShelfToolbar({ onSearch, onNew }:{
  onSearch:(q:string)=>void; onNew:()=>void;
}) {
  return (
    <Space style={{marginBottom:16}} wrap>
      <Input.Search allowClear placeholder="Search packs" onSearch={onSearch} style={{width:280}}/>
      <Select defaultValue="all" style={{width:200}} options={[
        {value:'all',label:'All Committees'},
        {value:'Board',label:'Main Board'},
        {value:'Exec',label:'Exec Committee'},
        {value:'Audit',label:'Audit Committee'},
      ]}/>
      <Button type="primary" onClick={onNew}>New Pack</Button>
    </Space>
  );
}
