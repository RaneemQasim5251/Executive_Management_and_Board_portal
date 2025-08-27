import { Input, Button, Switch, Space } from 'antd';
import { SearchOutlined, AppstoreOutlined, UnorderedListOutlined, PlusOutlined } from '@ant-design/icons';

export function ShelfToolbar({
  value, onChange, onNew, asList, onToggleList, rtl=false
}:{
  value?: string; onChange?: (v:string)=>void;
  onNew?: ()=>void;
  asList?: boolean; onToggleList?: (v:boolean)=>void;
  rtl?: boolean;
}) {
  return (
    <div className={rtl?'shelf-toolbar rtl':'shelf-toolbar'}>
      <div className="toolbar-search">
        <div className="search-icon-box"><SearchOutlined /></div>
        <Input
          value={value}
          onChange={e=>onChange?.(e.target.value)}
          placeholder={rtl? 'ابحث في الحِزَم' : 'Search packs'}
          allowClear
          className="search-input"
        />
      </div>

      <Space size="middle" className="toolbar-actions" wrap>
        <Button icon={asList? <AppstoreOutlined/>:<UnorderedListOutlined/>}
                onClick={()=>onToggleList?.(!asList)}>
          {rtl?'العرض':'View'}
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={onNew}>
          {rtl?'إنشاء أجندة':'Create agenda'}
        </Button>
      </Space>
    </div>
  );
}
