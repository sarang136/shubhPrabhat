// import React, { useState } from 'react';
// import { FaUserCircle, FaBars, FaUser } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLogoutMutation } from '../Redux/post';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { logoutReporter } from '../Redux/appSlice';

// const Navbar = () => {
//   const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
//   const [isNavOpen, setIsNavOpen] = useState(false);

//   const toggleProfileSidebar = () => setIsProfileSidebarOpen(!isProfileSidebarOpen);
//   const toggleNavSidebar = () => setIsNavOpen(!isNavOpen);

//   const dispatch = useDispatch();
//   const auth = useSelector((state) => state.auth);
//   const reporter = auth?.user?.reporter;


//   const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = async () => {
//     setIsProfileSidebarOpen(false);
//     try {
//       dispatch(logoutReporter());
//       navigate('/');
//       toast.success('Logged Out Successfully');
//       localStorage.clear();
//     } catch (err) {
//       console.error('Logout failed:', err);
//     }
//   };

//   const pathTitleMap = {
//     '/dashboard': 'Dashboard',
//     '/news': 'Add News',
//     '/blogs': 'Add Blogs',
//     '/totalnews': 'All News',
//   };

//   const basePath = `/${location.pathname.split('/')[1]}`;
//   const pageTitle = pathTitleMap[basePath] || 'Dashboard';

//   return (
//     <div className="relative w-full font-marathi bg-[#12294A]">
//       {/* Main Navbar */}
//       <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 sm:py-5">
//         {/* Hamburger Icon for small screens */}
//         <FaBars
//           className="text-white text-2xl sm:hidden cursor-pointer"
//           onClick={toggleNavSidebar}
//         />

//         <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-normal">
//           {pageTitle}
//         </h1>

//         <FaUserCircle
//           className="text-white text-2xl sm:text-3xl cursor-pointer"
//           onClick={toggleProfileSidebar}
//         />
//       </div>

//       {/* Responsive Top Nav Dropdown with Animation */}
//       <div
//         className={`absolute top-14 left-0 right-0 bg-white z-40 text-black shadow-md overflow-hidden transition-all duration-300 ease-in-out transform ${
//           isNavOpen ? 'max-h-[300px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
//         }`}
//       >
//         <div className="flex flex-col text-center space-y-3 p-4 text-lg font-medium">
//           <button onClick={() => { navigate('/dashboard'); setIsNavOpen(false); }}>Dashboard</button>
//           <button onClick={() => { navigate('/news'); setIsNavOpen(false); }}>Add News</button>
//           <button onClick={() => { navigate('/blogs'); setIsNavOpen(false); }}>Add Blogs</button>
//           {/* <button onClick={() => { navigate('/totalnews'); setIsNavOpen(false); }}>All News</button> */}
//         </div>
//       </div>

//       {/* Profile Sidebar */}
//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-white text-black shadow-lg transform transition-transform duration-300 z-50 cursor-pointer ${
//           isProfileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         <div className="p-6 flex flex-col h-full">
//           <div className="flex items-center justify-between mb-6 border-b py-2">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-2xl overflow-hidden">
//                <img className='h-full w-full' src={reporter.ReporterProfile}/>
//               </div>
//               <h2 className="text-xl font-semibold">{reporter?.name}</h2>
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto space-y-4">
//             <div>
//               <label className="text-sm text-gray-600">Name</label>
//               <input
//                 type="text"
//                 value={reporter?.name || 'John Doe'}
//                 readOnly
//                 className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700 cursor-pointer"
//               />
//             </div>

//             <div>
//               <label className="text-sm text-gray-600">Email</label>
//               <input
//                 type="email"
//                 value={reporter?.email || 'johndoe@gmail.com'}
//                 readOnly
//                 className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700 cursor-pointer"
//               />
//             </div>

//             <div>
//               <label className="text-sm text-gray-600">Contact No</label>
//               <input
//                 type="text"
//                 value={reporter?.phone || '8578954785'}
//                 readOnly
//                 className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700 cursor-pointer"
//               />
//             </div>

//             <div>
//               <label className="text-sm text-gray-600">Address</label>
//               <textarea
//                 rows={2}
//                 value={reporter?.address || 'Golden City Center , Chhatrapati Sambhajinagar'}
//                 readOnly
//                 className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700 cursor-pointer"
//               />
//             </div>
//           </div>

//           <div className="pt-6">
//             <button
//               className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
//               onClick={handleLogout}
//             >
//               {logoutLoading ? 'Logging Out...' : 'Log Out'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Overlay for profile sidebar */}
//       {isProfileSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 z-40"
//           onClick={toggleProfileSidebar}
//         />
//       )}
//     </div>
//   );
// };

// export default Navbar;



import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaBars, FaEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLogoutMutation,
  useUpdateReporterProfileMutation,
  useGetReporterQuery
} from '../Redux/post';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutReporter } from '../Redux/appSlice';
import { VscRepoFetch } from 'react-icons/vsc';

const Navbar = () => {
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    ReporterName: '',
    email: '',
    contactNo: '',
    address: '',
    AadharCardImage: null,
    ReporterProfile: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useSelector((state) => state.auth);
  const reporter = auth?.user?.reporter;
  const { data, refetch } = useGetReporterQuery(reporter?._id);

  const logggedReporter = data?.reporter;

  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const [updateReporterProfile, { isLoading: isUpdating }] = useUpdateReporterProfileMutation();

  // Sync fetched reporter data with formData
  useEffect(() => {
    if (logggedReporter) {
      setFormData({
        ReporterName: logggedReporter.ReporterName || '',
        email: logggedReporter.email || '',
        contactNo: logggedReporter.contactNo || '',
        address: logggedReporter.address || '',
        AadharCardImage: null,
        ReporterProfile: null,
      });
    }
  }, [logggedReporter]);

  const toggleProfileSidebar = () => setIsProfileSidebarOpen(!isProfileSidebarOpen);
  const toggleNavSidebar = () => setIsNavOpen(!isNavOpen);

  const handleLogout = () => {
    setIsProfileSidebarOpen(false);
    dispatch(logoutReporter());
    navigate('/');
    toast.success('Logged Out Successfully');
    localStorage.clear();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleUpdateProfile = async () => {
    const payload = new FormData();
    payload.append('ReporterName', formData.ReporterName);
    payload.append('email', formData.email);
    payload.append('contactNo', formData.contactNo);
    payload.append('address', formData.address);
    if (formData.AadharCardImage) payload.append('AadharCardImage', formData.AadharCardImage);
    if (formData.ReporterProfile) payload.append('ReporterProfile', formData.ReporterProfile);

    try {
      await updateReporterProfile({ id: reporter._id, formData: payload }).unwrap();
      toast.success('Profile Updated Successfully');
     await refetch();
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Profile update failed');
      console.error(error);
    }
  };

  const pathTitleMap = {
    '/dashboard': 'Dashboard',
    '/news': 'Add News',
    '/blogs': 'Add Blogs',
    '/totalnews': 'All News',
  };

  const basePath = `/${location.pathname.split('/')[1]}`;
  const pageTitle = pathTitleMap[basePath] || 'Dashboard';

  

  return (
    <div className="relative w-full font-marathi bg-[#12294A]">
      {/* Top Navbar */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 sm:py-5">
        <FaBars className="text-white text-2xl sm:hidden cursor-pointer" onClick={toggleNavSidebar} />
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-normal">{pageTitle}</h1>
        <img src={logggedReporter?.ReporterProfile} className="h-[50px] rounded-full w-[50px] cursor-pointer" onClick={toggleProfileSidebar} />
      </div>

      {/* Top Dropdown Nav */}
      <div
        className={`absolute top-14 left-0 right-0 bg-white z-40 text-black shadow-md overflow-hidden transition-all duration-300 ease-in-out transform ${isNavOpen ? 'max-h-[300px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}
      >
        <div className="flex flex-col text-center space-y-3 p-4 text-lg font-medium">
          <button onClick={() => { navigate('/dashboard'); setIsNavOpen(false); }}>Dashboard</button>
          <button onClick={() => { navigate('/news'); setIsNavOpen(false); }}>Add News</button>
          <button onClick={() => { navigate('/blogs'); setIsNavOpen(false); }}>Add Blogs</button>
        </div>
      </div>

      {/* Profile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white text-black shadow-lg transform transition-transform duration-300 z-50 ${isProfileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6 border-b py-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1E3A8A] overflow-hidden">
                <img className="h-full w-full object-cover" src={logggedReporter?.ReporterProfile} alt="Profile" />
              </div>
              <h2 className="text-xl font-semibold">{logggedReporter?.ReporterName}</h2>
            </div>
            <FaEdit className="text-gray-600 cursor-pointer" onClick={() => setIsEditModalOpen(true)} />
          </div>

          {/* Read-only Profile Info */}
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <label>Name</label>
              <input type="text" value={logggedReporter?.ReporterName || ''} readOnly className="w-full px-4 py-2 border rounded-md bg-white" />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={logggedReporter?.email || ''} readOnly className="w-full px-4 py-2 border rounded-md bg-white" />
            </div>
            <div>
              <label>Contact No</label>
              <input type="text" value={logggedReporter?.contactNo || ''} readOnly className="w-full px-4 py-2 border rounded-md bg-white" />
            </div>
            <div>
              <label>Address</label>
              <textarea value={logggedReporter?.address || ''} readOnly className="w-full px-4 py-2 border rounded-md bg-white" rows={2} />
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-6 space-y-3">
            <button
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
              onClick={handleLogout}
            >
              {logoutLoading ? 'Logging Out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isProfileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={toggleProfileSidebar} />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={() => setIsEditModalOpen(false)}>✕</button>
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <div className="space-y- flex flex-col gap-4">
              <input name="ReporterName" type="text" value={formData.ReporterName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md bg-white text-gray-700" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md bg-white text-gray-700" />
              <input name="contactNo" type="text" value={formData.contactNo} onChange={handleChange} className="w-full px-4 py-2 border rounded-md bg-white text-gray-700" />
              <textarea name="address" rows={2} value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-md bg-white text-gray-700" />
              <label className='italic text-gray-500'>Aadhar Card Image</label>
              <input name="AadharCardImage" type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 border rounded-md bg-white text-gray-700" />
              <label className='italic text-gray-500'>Profile Image</label>
              <input name="ReporterProfile" type="file" accept="image/*" onChange={handleFileChange}  className="w-full px-4 py-2 border rounded-md bg-white text-gray-700" />
              {/* <label>Profile Image</label> */}
            </div>

            <button
              className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              onClick={handleUpdateProfile}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;





