import { ReactNode } from 'react';
import Navigation from './Navigation';
import PageHeader from './PageHeader';

interface LayoutProps {
  children: ReactNode, 
  title: string,
  subTitle: string
}

const Layout = ({ children, title, subTitle }: LayoutProps) => {
  return (
    <div className="layout-container"> {/* 添加 className 便于样式控制 */}
      <Navigation />
      <PageHeader title={title} subTitle={subTitle}/>
      <div style={{width: "85%", margin:"0 auto", display:"flex"}}>{children}</div>
    </div>
  )
}

export default Layout