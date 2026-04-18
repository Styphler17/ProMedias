import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Diagnostic from "@/pages/Diagnostic";
import Services from "@/pages/Services";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";

// Admin pages (no public Layout)
import AdminLogin     from "@/pages/admin/Login";
import Dashboard      from "@/pages/admin/Dashboard";
import AdminProducts  from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminSettings  from "@/pages/admin/Settings";
import MediaLibrary   from "@/pages/admin/MediaLibrary";
import Profile        from "@/pages/admin/Profile";
import Contact        from "@/pages/admin/Contact"
import AdminAnnouncements from "@/pages/admin/Announcements";
import { isLoggedIn } from "@/lib/admin";
import { Navigate }   from "react-router-dom";

function Protected({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin routes — outside public Layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Protected><Dashboard /></Protected>} />
        <Route path="/admin/products" element={<Protected><AdminProducts /></Protected>} />
        <Route path="/admin/categories" element={<Protected><AdminCategories /></Protected>} />
        <Route path="/admin/settings" element={<Protected><AdminSettings /></Protected>} />
        <Route path="/admin/media"    element={<Protected><MediaLibrary /></Protected>} />
        <Route path="/admin/profile"  element={<Protected><Profile /></Protected>} />
        <Route path="/admin/contact"        element={<Protected><Contact /></Protected>} />
        <Route path="/admin/announcements"  element={<Protected><AdminAnnouncements /></Protected>} />

        {/* Public routes */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/diagnostic" element={<Diagnostic />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
