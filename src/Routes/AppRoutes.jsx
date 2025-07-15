import { Routes, Route, useLocation } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import Dashboard from '../Pages/Dashboard.jsx';
import News from '../Pages/News.jsx';
import TotalNews from '../Pages/TotalNews.jsx';
import SignIn from '../Pages/SignIn.jsx';
import SignUp from '../Pages/SignUp2.jsx';
import Blogs from '../Pages/Blogs.jsx';
import { useSelector } from 'react-redux';
// import AddNews from '../Pages/AddNews';

const AppRoutes = () => {
  const location = useLocation();
  const selector = useSelector((state) => state.auth)
  // console.log(selector.user.reporter.approvedFor);

  // Auth routes - these should NOT show AdminLayout
  const authRoutes = ['/', '/signin', '/signup'];

  const isAuthPage = authRoutes.includes(location.pathname.toLowerCase());

  return (
    <Routes>
      {isAuthPage ? (
        <>
          {/* <Route path="/" element={<SignUp />} /> */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

        </>
      ) : (
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="news" element={<News />} />
          <Route path="totalnews" element={<TotalNews />} />
          <Route path="blogs" element={<Blogs />} />
          {/* <Route path="add-news" element={<AddNews />} /> */}
        </Route>
      )} 

      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
