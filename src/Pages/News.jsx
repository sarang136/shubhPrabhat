import React, { useState } from "react";
import {
  FaRegEye,
  FaRegBookmark,
  FaBookmark,
  FaHeart,
} from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { HiMiniTrash } from "react-icons/hi2";
import AddNewsForm from "../Components/AddNewsForm";
import ModalReadMore from "../Components/ModalReadMore";
import {
  useGetAllNewsQuery,
  useDeleteNewsMutation,
  useAddNewsMutation,
  useUpdateNewsMutation,
} from "../Redux/newsAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddNews = () => {
  const auth = useSelector((state) => state.auth);
  const reporterId = auth?.user?.reporter?._id;

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [readMoreNews, setReadMoreNews] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [editingNews, setEditingNews] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllNewsQuery(reporterId);

  console.log(data)
  const news = data?.data || [];

  const [addNews] = useAddNewsMutation(reporterId);
  const [deleteSubCategory] = useDeleteNewsMutation();
  const [updateNews] = useUpdateNewsMutation();

  const openAddModal = () => {
    setModalMode("add");
    setEditingNews(null);
    setShowModal(true);
  };

  const openEditModal = (newsItem) => {
    setModalMode("edit");
    setEditingNews(newsItem);
    setShowModal(true);
  };

const handleModalSubmit = async (formData) => {
  try {
    if (modalMode === "add") {
      if (
        !formData.get("MainHeadline") ||
        !formData.get("Subheadline") ||
        !formData.get("Description") ||
        !formData.get("image") ||
        !formData.get("serviceIds") ||
        !formData.get("subcategoryMap")
      ) {
        toast.error("सर्व फील्ड आवश्यक आहेत (including image, services, subcategories)");
        return;
      }

      await addNews(formData).unwrap();
      toast.success("News added successfully");
    } else {
      const updatedFormData = new FormData();

      for (let [key, value] of formData.entries()) {
        // serviceId
        if (
          key === "serviceIds" &&
          value !== JSON.stringify([editingNews?.serviceId])
        ) {
          updatedFormData.append(key, value);
        }

        // subcategoryMap
        else if (
          key === "subcategoryMap" &&
          value !== JSON.stringify({ [editingNews?.serviceId]: [editingNews?.subcategoryId] })
        ) {
          updatedFormData.append(key, value);
        }

        // mediaFile
        else if (key === "image" && value instanceof File) {
          updatedFormData.append(key, value);
        }

        // MainHeadline, Subheadline, Description
        else if (
          ["MainHeadline", "Subheadline", "Description", "reporterId"].includes(key) &&
          value !== editingNews?.product?.[key]
        ) {
          updatedFormData.append(key, value);
        }
      }

      const hasChanges = [...updatedFormData.keys()].length > 0;

      if (!hasChanges) {
        toast.info("No changes detected.");
        return;
      }

      // ✅ LOG UPDATED KEYS AND VALUES
      console.log("🧾 Updated keys:");
      for (let [key, value] of updatedFormData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("✅ Ready to update:", editingNews.product._id);
      await updateNews({
        id: editingNews.product._id,
        updatedFormData,
      }).unwrap();

      toast.success("News updated successfully");
    }

    setShowModal(false);
    refetch();
  } catch (err) {
    console.error("❌ Submit Error:", err);
    toast.error("Failed to submit news.");
  }
};



  const handleDelete = async (newsId) => {
    const confirm = window.confirm("Are you sure you want to delete this news?");
    if (!confirm) return;

    try {
      await deleteSubCategory(newsId).unwrap();
      toast.success("News deleted successfully");
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete news");
    }
  };

  return (
    <div className="font-normal font-tiro">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center m-2 space-y-2 sm:space-y-0 sm:space-x-4">
        <h2 className="text-lg">Total News ({news.length})</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by headline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 border rounded w-full sm:w-64"
          />
          <button
            className="bg-[#0f1e36] text-white px-4 py-1 rounded w-full sm:w-auto"
            onClick={openAddModal}
          >
            + Add News
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 bg-[#D9D9D980] p-4 max-h-[80vh] overflow-y-scroll">
        {isLoading || isFetching ? (
          <p className="col-span-full text-center text-blue-600">Loading...</p>
        ) : isError ? (
          <p className="col-span-full text-center text-[#E60023]">Failed to load news.</p>
        ) : news.filter((n) =>
            n.product?.MainHeadline?.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 ? (
          <p className="col-span-full text-center">No news found.</p>
        ) : (
          news
            .filter((n) =>
              n.product?.MainHeadline?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((n, i) => (
              <div key={i}>
                <div className="p-4 shadow rounded bg-[#FFFFFF9C] flex flex-col h-[50vh]">
                  <div className="text-[#0000006B] mb-2 text-sm">
                    {n.subcategoryName}
                  </div>

                  <div className="w-full h-48 sm:h-36 lg:h-48 overflow-hidden rounded mb-2 bg-[#D9D9D9]">
                    {n.product.image?.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        src={n.product.image}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={n.product.image || "/default-news.png"}
                        alt="news"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="text-xs text-[#0000006B] mb-2">
                    Uploaded On{" "}
                    {new Date(n.product.date || Date.now()).toLocaleDateString()}
                  </div>

                  <h3 className="text-lg break-words line-clamp-1 flex-grow" title={n.product.MainHeadline}>
                    {n.product.MainHeadline}
                  </h3>

                  <p className="text-sm text-gray-700 mb-1 line-clamp-1" title={n.product.Subheadline}>
                    {n.product.Subheadline}
                  </p>

                  <p className="text-sm text-gray-600 h-[20px] line-clamp-2" title={n.product.Description}>
                    {n.product.Description}
                  </p>

                  <div className="flex justify-between items-center mt-2">
                    <button
                      className="text-[#E60023] text-sm underline whitespace-nowrap"
                      onClick={() => {
                        setReadMoreNews(n);
                        setShowReadMore(true);
                      }}
                    >
                      Read More
                    </button>
                    <div className="flex space-x-2">
                      <button className="text-[#12294A]" onClick={() => openEditModal(n)}>
                        <CiEdit />
                      </button>
                      <button className="text-[#E60023]" onClick={() => handleDelete(n.product._id)}>
                        <HiMiniTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative w-full max-w-6xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl font-bold"
            >
              &times;
            </button>
            <AddNewsForm
              mode={modalMode}
              onSubmit={handleModalSubmit}
              buttonLabel={modalMode === "add" ? " Submit News" : "Save Changes"}
              defaultValues={modalMode === "edit" ? {
                serviceId: editingNews.serviceId,
                subcategoryId: editingNews.subcategoryId,
                MainHeadline: editingNews.product.MainHeadline,
                Subheadline: editingNews.product.Subheadline,
                Description: editingNews.product.Description,
              } : {}}
            />
          </div>
        </div>
      )}

      {showReadMore && readMoreNews && (
        <ModalReadMore news={readMoreNews} onClose={() => setShowReadMore(false)} />
      )}
    </div>
  );
};

export default AddNews;
