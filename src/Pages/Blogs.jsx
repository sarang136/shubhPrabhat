import React, { useState } from "react";
import {
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useGetApprovedBlogsQuery,
  useGetPendingBlogsQuery,
  useGetRejectedBlogsQuery,
  useAddBlogsMutation
} from "../Redux/BlogsApi";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
  "image",
];

const Blogs = () => {
  const [showModal, setShowModal] = useState(false);
  const [mainHeadline, setMainHeadline] = useState("");
  const [subHeadline, setSubHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [activeTab, setActiveTab] = useState("Approved");
  const [editBlogData, setEditBlogData] = useState(null);
  const [editHeadline, setEditHeadline] = useState("");
  const [editSubHeadline, setEditSubHeadline] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [readModalData, setReadModalData] = useState(null);

  const auth = useSelector((state) => state.auth);
  const reporterId = auth?.user?.reporter?._id;

  const [addBlog] = useAddBlogsMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog, { isLoading: updateLoading }] = useUpdateBlogMutation();

  const {
    data: approvedBlogs,
    refetch: refetchApproved,
  } = useGetApprovedBlogsQuery(reporterId, { skip: activeTab !== "Approved" });

  const {
    data: pendingBlogs,
    refetch: refetchPending,
  } = useGetPendingBlogsQuery(reporterId, { skip: activeTab !== "Pending" });

  const {
    data: rejectedBlogs,
    refetch: refetchRejected,
  } = useGetRejectedBlogsQuery(reporterId, { skip: activeTab !== "Rejected" });

  const getCurrentBlogs = () => {
    switch (activeTab) {
      case "Approved":
        return approvedBlogs?.data || [];
      case "Pending":
        return pendingBlogs?.data || [];
      case "Rejected":
        return rejectedBlogs?.data || [];
      default:
        return [];
    }
  };

  const refetchCurrent = () => {
    switch (activeTab) {
      case "Approved":
        refetchApproved();
        break;
      case "Pending":
        refetchPending();
        break;
      case "Rejected":
        refetchRejected();
        break;
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!mainHeadline || !description || !imageFile) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("MainHeadline", mainHeadline);
    formData.append("Subheadline", subHeadline);
    formData.append("Description", description);
    formData.append("image", imageFile);
    formData.append("reporterId", reporterId);

    try {
      setIsUploading(true);
      await addBlog(formData).unwrap();
      toast.success("Blog added successfully!");
      refetchCurrent();
      setShowModal(false);
      setMainHeadline("");
      setSubHeadline("");
      setDescription("");
      setImageFile(null);
    } catch (err) {
      toast.error("Failed to add blog.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditOpen = (blog) => {
    setEditBlogData(blog);
    setEditHeadline(blog.MainHeadline || "");
    setEditSubHeadline(blog.Subheadline || "");
    setEditDescription(blog.Description || "");
    setEditImage(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editHeadline || !editDescription) {
      toast.error("Headline and Description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("MainHeadline", editHeadline);
    formData.append("Subheadline", editSubHeadline);
    formData.append("Description", editDescription);
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      await updateBlog({ id: editBlogData._id, updatedData: formData }).unwrap();
      toast.success("Blog updated successfully!");
      setIsEditModalOpen(false);
      setEditBlogData(null);
      refetchCurrent();
    } catch {
      toast.error("Update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id).unwrap();
        toast.success("Blog deleted successfully.");
        refetchCurrent();
      } catch {
        toast.error("Failed to delete blog.");
      }
    }
  };

  const currentBlogs = getCurrentBlogs();
  const tabStatuses = ["Approved", "Pending", "Rejected"];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-xl">
          Total Blogs <span className="ml-2 text-gray-500">({currentBlogs.length})</span>
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#12294A] text-white rounded"
        >
          Add Blog
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 bg-gray-100 p-3 rounded mb-6">
        {tabStatuses.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? "bg-[#12294A] text-white" : "bg-white"}`}
          >
            {tab}
            <span className={`ml-2 text-xs px-2 py-1 rounded-full ${activeTab === tab ? "bg-white text-[#12294A]" : "bg-[#12294A] text-white"
              }`}>
              {(tab === "Approved"
                ? approvedBlogs?.data?.length
                : tab === "Pending"
                  ? pendingBlogs?.data?.length
                  : rejectedBlogs?.data?.length) || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      <div>
        {currentBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentBlogs.map((data) => (
              <div key={data._id} className="bg-white p-3 rounded shadow relative">
                <img
                  src={data.image?.startsWith("http") ? data.image : `http://localhost:5000/${data.image}`}
                  alt="Blog"
                  className="w-full h-40 object-cover rounded"
                />
                <p className="text-xs italic mt-2 text-gray-500">
                  Updated on: {new Date(data.updatedAt).toLocaleString("en-IN")}
                </p>
                <p className="font-semibold mt-2 line-clamp-2">{data.MainHeadline}</p>
                <p className="text-sm text-gray-600">{data.Subheadline}</p>
                <div className="flex justify-between items-end mt-4">
                  <p
                    className="text-sm text-red-500 underline cursor-pointer"
                    onClick={() => setReadModalData(data)}
                  >
                    Read More
                  </p>
                  <div className="flex gap-2">
                    <FaEdit size={20} className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => handleEditOpen(data)} />
                    {/* <MdDelete size={20} className="text-red-400 hover:text-black cursor-pointer" onClick={() => handleDelete(data._id)} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">No Data Found</div>
        )}
      </div>

      {/* Add Blog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-[700px] h-[500px] relative overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-xl">&times;</button>
            <form onSubmit={handleAddBlog} className="space-y-4" encType="multipart/form-data">
              <input className="w-full border px-3 py-2" placeholder="Main Headline" value={mainHeadline} onChange={(e) => setMainHeadline(e.target.value)} />
              <input className="w-full border px-3 py-2" placeholder="Subheadline" value={subHeadline} onChange={(e) => setSubHeadline(e.target.value)} />
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write blog description..."
                className="h-[200px] overflow-auto"
              />
              <label className="flex flex-col items-center border p-4 cursor-pointer">
                <FiUpload className="text-xl mb-2" />Upload Image
                <input type="file" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
              </label>
              <button disabled={isUploading} className="bg-[#12294A] w-full text-white py-2">
                {isUploading ? "Uploading..." : "Add Blog"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-[700px] h-[500px] relative overflow-y-auto">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-2 right-2 text-xl">&times;</button>
            <form onSubmit={handleEditSubmit} className="space-y-4" encType="multipart/form-data">
              <input className="w-full border px-3 py-2" placeholder="Main Headline" value={editHeadline} onChange={(e) => setEditHeadline(e.target.value)} />
              <input className="w-full border px-3 py-2" placeholder="Subheadline" value={editSubHeadline} onChange={(e) => setEditSubHeadline(e.target.value)} />
              <ReactQuill
                theme="snow"
                value={editDescription}
                onChange={setEditDescription}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Edit blog description..."
                className="h-[200px] overflow-auto"
              />
              <label className="flex flex-col items-center border p-4 cursor-pointer">
                <FiUpload className="text-xl mb-2" />Upload Image
                <input type="file" className="hidden" onChange={(e) => setEditImage(e.target.files[0])} />
              </label>
              <button disabled={updateLoading} className="bg-[#12294A] w-full text-white py-2">
                {updateLoading ? "Saving Changes..." : "Update Blog"}
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Read Modal */}
      {readModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[60%] lg:w-[50%] max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setReadModalData(null)} className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-red-600">&times;</button>
            <h2 className="text-lg font-bold mb-2">{readModalData?.MainHeadline || "No Title"}</h2>
            <p className="text-sm text-gray-600 mb-4">{readModalData?.Subheadline}</p>
            <img src={readModalData.image?.startsWith("http") ? readModalData.image : `http://localhost:5000/${readModalData.image}`} alt="Blog" className="w-full rounded mb-4 max-h-[400px] object-contain" />
            <div
              className="prose prose-sm max-w-full"
              dangerouslySetInnerHTML={{ __html: readModalData?.Description || "सविस्तर माहिती लवकरच उपलब्ध होईल." }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
