import React from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetAllNewsQuery } from '../Redux/newsAPI';


const Dashboard = () => {
const reporter = useSelector((state) => state.auth)
console.log(reporter)
  const { data: newsList, isLoading, isError } = useGetAllNewsQuery(reporter?.user?.reporter?._id);
  console.log(newsList)
  const navigate = useNavigate();

  const news = newsList?.data || [];

  // Count based on product.status
  const approvedCount = news.filter(n => n.product?.status === 'approved').length;
  const rejectedCount = news.filter(n => n.product?.status === 'rejected').length;
  const pendingCount = news.filter(n => n.product?.status === 'pending').length;
  const totalCount = news.length;

  // Dashboard card definitions
  const stats = [
    {
      title: 'Total News',
      icon: <HiOutlineDocumentText size={32} className="text-[#0b2447]" />,
      count: totalCount,
      status: null, // No status filter for total
    },
    {
      title: 'Approved',
      icon: <FaCheckCircle size={32} className="text-green-600" />,
      count: approvedCount,
      status: 'approved',
    },
    {
      title: 'Rejected',
      icon: <FaTimesCircle size={32} className="text-red-600" />,
      count: rejectedCount,
      status: 'rejected',
    },
    {
      title: 'Pending',
      icon: <MdPendingActions size={32} className="text-blue-600" />,
      count: pendingCount,
      status: 'pending',
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-md shadow p-6 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigate(`/totalnews${stat.status ? `?status=${stat.status}` : ''}`)}
          >
            <div className="mb-2">{stat.icon}</div>
            <p className="text-md font-semibold text-gray-800">{stat.title}</p>
            <p className="text-xl font-bold text-[#0b2447]">{stat.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
