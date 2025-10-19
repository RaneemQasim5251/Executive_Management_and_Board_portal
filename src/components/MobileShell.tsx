import React from 'react';
import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const MobileShell: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="mobile-shell">
      <header className="mobile-shell-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Button type="text" icon={<MenuOutlined />} onClick={() => setOpen(true)} />
          <div style={{fontWeight: 600, marginLeft: 8}}>Executive Portal</div>
        </div>
      </header>
      <main style={{padding: 8}}>
        {children}
      </main>
      <Drawer title="Menu" placement="left" onClose={() => setOpen(false)} open={open}>
        {/* The main sider/menu is provided by AntD ThemedSiderV2 in desktop; we keep drawer minimal to avoid duplication. */}
        <p>Navigation</p>
      </Drawer>
    </div>
  );
};

export default MobileShell;
