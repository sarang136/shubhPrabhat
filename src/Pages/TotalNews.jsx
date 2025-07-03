import React, { useState } from 'react';
import mb from '../assets/mb.png';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useGetAllNewsQuery, useUpdateNewsMutation, useDeleteNewsMutation } from '../Redux/newsAPI.js';
import RenderRichContent from './RenderRichContent .jsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TotalNews = () => {
  const reporter = useSelector((state) => state.auth);
  const { data: newsList, isLoading, isError } = useGetAllNewsQuery(reporter?.user?.reporter?._id);
  const [deleteNews] = useDeleteNewsMutation();
  const [updateNews, { isLoading: loading }] = useUpdateNewsMutation();
  const { user } = useSelector((state) => state.auth);
  const reporterId = user?.reporter?._id;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const statusFilter = params.get("status");

  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModalData, setEditModalData] = useState(null);

  const newsArray = Array.isArray(newsList)
    ? newsList
    : Array.isArray(newsList?.data)
    ? newsList.data
    : [];

  const filteredNews = statusFilter
    ? newsArray.filter(item => item.product?.status === statusFilter)
    : newsArray;

  const handleReadMore = (item) => {
    setSelectedNews(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedNews(null);
    setShowModal(false);
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await deleteNews(id).unwrap();
        toast.success("News deleted successfully!");
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Something went wrong while deleting.");
      }
    }
  };

  const handleEdit = (item) => {
    const product = item.product || {};
    setEditModalData({
      _id: product._id,
      MainHeadline: product.MainHeadline || '',
      Subheadline: product.Subheadline || '',
      Description: product.Description || '',
      image: product.image || '',
    });
  };

  const handleEditChange = (e) => {
    setEditModalData({
      ...editModalData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('MainHeadline', editModalData.MainHeadline);
      formData.append('Subheadline', editModalData.Subheadline);
      formData.append('Description', editModalData.Description);
      formData.append('reporterId', reporterId);

      if (editModalData.image instanceof File) {
        formData.append('image', editModalData.image);
      }

      await updateNews({ id: editModalData._id, updatedData: formData }).unwrap();
      toast.success("News updated successfully!");
      setEditModalData(null);
    } catch (err) {
      toast.error("Update failed!");
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#D9D9D980] min-h-screen font-marathi">
      {isLoading && <p>Loading news...</p>}
      {isError && <p>Something went wrong while fetching news.</p>}

      {filteredNews.length === 0 ? (
        <div className="text-center text-gray-600 font-medium text-lg mt-10">
          {statusFilter ? `No Data fetched.` : 'No Data found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredNews.map((item, index) => (
            <div
              key={index}
              className="bg-[#FFFFFF9C] rounded shadow-md p-4 h-full max-h-[500px] overflow-y-scroll flex flex-col justify-between"
            >
              <div>
                <h1 className="text-sm text-[#0000006B] font-normal mb-2">
                  {item.subcategoryName}
                </h1>

                {item.product.image?.endsWith(".mp4") ? (
                  <video
                    src={item.product.image}
                    className="w-full h-[200px] mb-4 rounded object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={item.product.image || mb}
                    alt="News Banner"
                    className="w-full h-[200px] mb-4 rounded object-cover"
                  />
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <h1>
                    Uploaded On:{" "}
                    {item?.product?.date
                      ? new Date(item.product.date).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "Unknown Date"}
                  </h1>
                  <h1>
                    <span className={`${item.statusColor || 'text-green-600'} font-medium`}>
                      {item.product.status || 'No status found'}
                    </span>
                  </h1>
                </div>

                <div
                  className="mb-2 font-normal text-xl max-h-[60px] overflow-hidden text-ellipsis line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: item.product.MainHeadline || 'Untitled News',
                  }}
                />
              </div>

              <div className="flex justify-between items-center mt-auto pt-4">
                <button
                  onClick={() => handleReadMore(item)}
                  className="text-red-600 border-b border-red-400 hover:text-red-700"
                >
                  Read More
                </button>

                <div className="flex gap-4 text-xl">
                  <FaEdit
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="Update"
                    onClick={() => handleEdit(item)}
                  />
                  <FaTrash
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete"
                    onClick={() => handleDeleteNews(item.product._id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Read More Modal */}
      {showModal && selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[60%] lg:w-[50%] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-red-600"
            >
              &times;
            </button>

            <div className="text-lg font-bold mb-2" dangerouslySetInnerHTML={{
              __html: selectedNews?.product?.MainHeadline || 'No Title',
            }} />

            <div
              className="text-sm text-gray-600 mb-4"
              dangerouslySetInnerHTML={{
                __html: selectedNews?.product?.Subheadline || '',
              }}
            />

            {selectedNews.product.image?.endsWith(".mp4") ? (
              <video
                src={selectedNews.product.image}
                controls
                className="w-full rounded mb-4 max-h-[400px] object-contain"
              />
            ) : (
              <img
                src={selectedNews.product.image || mb}
                alt="Modal Banner"
                className="w-full rounded mb-4 max-h-[400px] object-contain"
              />
            )}

          <div className="text-base text-black leading-relaxed prose max-w-none break-words">
              <RenderRichContent html={selectedNews?.product?.Description || '<p>सविस्तर बातमी लवकरच उपलब्ध होईल.</p>'} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto relative space-y-4">
            <h2 className="text-lg font-bold text-center">Edit News</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">

              <ReactQuill
                theme="snow"
                value={editModalData.MainHeadline}
                onChange={(value) =>
                  handleEditChange({ target: { name: "MainHeadline", value } })
                }
              />

              <ReactQuill
                theme="snow"
                value={editModalData.Subheadline}
                onChange={(value) =>
                  handleEditChange({ target: { name: "Subheadline", value } })
                }
              />

              <ReactQuill
                theme="snow"
                value={editModalData.Description}
                onChange={(value) =>
                  handleEditChange({ target: { name: "Description", value } })
                }
              />

              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) =>
                  setEditModalData({ ...editModalData, image: e.target.files[0] })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditModalData(null)}
                  className="border px-4 py-2 rounded text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-[#12294A] text-white px-6 py-2 rounded transition ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalNews;
