import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, SettingsProvider } from './context/AppContext';
import PublicLayout from './components/PublicLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Events from './pages/public/Events';
import EventDetail from './pages/public/EventDetail';
import Gallery from './pages/public/Gallery';
import Packages from './pages/public/Packages';
import Enquire from './pages/public/Enquire';
import Contact from './pages/public/Contact';
import { Privacy, Cookies, Terms } from './pages/public/Legal';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Enquiries from './pages/admin/Enquiries';
import EnquiryDetail from './pages/admin/EnquiryDetail';
import Bookings from './pages/admin/Bookings';
import Calendar from './pages/admin/Calendar';
import Customers from './pages/admin/Customers';
import CustomerDetail from './pages/admin/CustomerDetail';
import AdminServices from './pages/admin/AdminServices';
import AdminPackages from './pages/admin/AdminPackages';
import AdminEvents from './pages/admin/AdminEvents';
import AdminGallery from './pages/admin/AdminGallery';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminSettings from './pages/admin/AdminSettings';
import './styles/tokens.css';
import './pages/public/Home.css';

export default function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="events" element={<Events />} />
                <Route path="events/:slug" element={<EventDetail />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="packages" element={<Packages />} />
                <Route path="enquire" element={<Enquire />} />
                <Route path="contact" element={<Contact />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="cookies" element={<Cookies />} />
                <Route path="terms" element={<Terms />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="enquiries" element={<Enquiries />} />
                <Route path="enquiries/:id" element={<EnquiryDetail />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="customers" element={<Customers />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="packages" element={<AdminPackages />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
}
