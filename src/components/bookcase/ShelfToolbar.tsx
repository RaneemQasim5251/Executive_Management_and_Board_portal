import { Input, Button, Space, Segmented } from 'antd';
import { PlusOutlined, SearchOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';

export function ShelfToolbar({ onSearch, onNew }:{ onSearch:(q:string)=>void; onNew:()=>void; }) {
  return (
    <div style={{display:'flex', flexWrap:'wrap', gap:12, alignItems:'center', justifyContent:'space-between'}}>
      <Space.Compact style={{ width: 380, maxWidth:'100%' }}>
        <Input allowClear prefix={<SearchOutlined/>} placeholder="Search packs, entities, committees…" onChange={(e)=>onSearch(e.target.value)}/>
      </Space.Compact>
      <Space wrap>
        <Segmented options={[
          { label:<><AppstoreOutlined/> Grid</>, value:'grid' },
          { label:<><UnorderedListOutlined/> List</>, value:'list' },
        ]} defaultValue="grid"/>
        <Button type="primary" icon={<PlusOutlined/>} onClick={onNew}>New pack</Button>
      </Space>
    </div>
  );
}
