import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingCTAs from './FloatingCTAs';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <Header />
      <main className="public-main">
        <Outlet />
      </main>
      <Footer />
      <FloatingCTAs />
    </div>
  );
}
