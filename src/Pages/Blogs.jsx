import React, { useState } from 'react';
import {
  useAddBlogsMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useGetApprovedBlogsQuery,
  useGetPendingBlogsQuery,
  useGetRejectedBlogsQuery,
} from '../Redux/BlogsApi';
import { useSelector } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Blogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [readModalData, setReadModalData] = useState(null);
  const [headline, setHeadline] = useState('');
  const [subHeadline, setSubHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState('Approved');

  const [editBlogData, setEditBlogData] = useState(null);
  const [editHeadline, setEditHeadline] = useState('');
  const [editSubHeadline, setEditSubHeadline] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState(null);

  const auth = useSelector((state) => state.auth);
  const reporterId = auth?.user?.reporter?._id;
  const shopId = auth?.user?.shop?._id;

  const [addBlogs, { isLoading: loading }] = useAddBlogsMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog, { isLoading: updateLoading }] = useUpdateBlogMutation();

  const { data: approvedBlogs, refetch: refetchApproved } = useGetApprovedBlogsQuery(reporterId, { skip: activeTab !== 'Approved' });
  const { data: pendingBlogs, refetch: refetchPending } = useGetPendingBlogsQuery(reporterId, { skip: activeTab !== 'Pending' });
  const { data: rejectedBlogs, refetch: refetchRejected } = useGetRejectedBlogsQuery(reporterId, { skip: activeTab !== 'Rejected' });

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link',
  ];

  const getCurrentBlogs = () => {
    switch (activeTab) {
      case 'Approved': return approvedBlogs?.data || [];
      case 'Pending': return pendingBlogs?.data || [];
      case 'Rejected': return rejectedBlogs?.data || [];
      default: return [];
    }
  };

  const refetchCurrent = () => {
    switch (activeTab) {
      case 'Approved': refetchApproved(); break;
      case 'Pending': refetchPending(); break;
      case 'Rejected': refetchRejected(); break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!headline || !description || !image) {
      toast.error('Please fill all required fields.');
      return;
    }
    const formData = new FormData();
    formData.append('reporterId', reporterId);
    formData.append('shopId', shopId);
    formData.append('MainHeadline', headline);
    formData.append('Subheadline', subHeadline);
    formData.append('Description', description);
    formData.append('image', image);

    try {
      await addBlogs(formData).unwrap();
      toast.success('Blog added successfully!');
      setHeadline('');
      setSubHeadline('');
      setDescription('');
      setImage(null);
      setIsModalOpen(false);
    } catch {
      toast.error('Something went wrong.');
    }
  };

  const handleEditOpen = (blog) => {
    setEditBlogData(blog);
    setEditHeadline(blog.MainHeadline || '');
    setEditSubHeadline(blog.Subheadline || '');
    setEditDescription(blog.Description || '');
    setEditImage(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editHeadline || !editDescription) {
      toast.error('Headline and Description are required.');
      return;
    }

    const formData = new FormData();
    formData.append('MainHeadline', editHeadline);
    formData.append('Subheadline', editSubHeadline);
    formData.append('Description', editDescription);
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      await updateBlog({ id: editBlogData._id, updatedData: formData }).unwrap();
      toast.success('Blog updated successfully!');
      setIsEditModalOpen(false);
      setEditBlogData(null);
      refetchCurrent();
    } catch {
      toast.error('Update failed.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id).unwrap();
        toast.success('Blog deleted successfully.');
        refetchCurrent();
      } catch {
        toast.error('Failed to delete blog.');
      }
    }
  };

  // ✅ This function converts YouTube URLs to embed previews
  const parseYouTubeEmbeds = (html) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/g;
    return html.replace(regex, (match, videoId) => {
      return `
        <div class="my-4">
          <iframe width="100%" height="315"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      `;
    });
  };

  const tabStatuses = ['Approved', 'Pending', 'Rejected'];
  const currentBlogs = getCurrentBlogs();

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-xl">Total Blogs <span className="ml-2 text-gray-500">({currentBlogs.length})</span></p>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-[#12294A] text-white rounded">Add Blog</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 bg-gray-100 p-3 rounded mb-6">
        {tabStatuses.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-[#12294A] text-white' : 'bg-white'}`}
          >
            {tab} <span className={`ml-2 text-xs px-2 py-1 rounded-full ${activeTab === tab ? 'bg-white text-[#12294A]' : 'bg-[#12294A] text-white'}`}>
              {(tab === 'Approved' ? approvedBlogs?.data?.length :
                tab === 'Pending' ? pendingBlogs?.data?.length :
                  rejectedBlogs?.data?.length) || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      <div>
        {currentBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentBlogs.map((data) => (
              <div key={data._id} className="bg-white p-3 rounded shadow">
                <img
                  src={data.image?.startsWith('http') ? data.image : `http://localhost:5000/${data.image}`}
                  alt="Blog"
                  className="w-full h-40 object-cover rounded"
                />
                <p className="text-xs italic mt-2 text-gray-500">
                  Updated on: {new Date(data.updatedAt).toLocaleString('en-IN')}
                </p>
                <div className="font-semibold mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: data.MainHeadline }} />
                <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: data.Subheadline }} />
                <div className="flex justify-between items-end mt-4">
                  <p className="text-sm text-red-500 underline cursor-pointer" onClick={() => setReadModalData(data)}>Read More</p>
                  <div className="flex gap-2">
                    <FaEdit size={20} className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => handleEditOpen(data)} />
                    <MdDelete size={20} className="text-red-400 hover:text-black cursor-pointer" onClick={() => handleDelete(data._id)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">No Data Found</div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Blog</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ReactQuill theme="snow" value={headline} onChange={setHeadline} modules={quillModules} formats={quillFormats} placeholder="Main Headline" />
              <ReactQuill theme="snow" value={subHeadline} onChange={setSubHeadline} modules={quillModules} formats={quillFormats} placeholder="Subheadline" />
              <ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} formats={quillFormats} placeholder="Description" />
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full" />
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600">Cancel</button>
                <button type="submit" disabled={loading} className={`px-6 py-2 bg-[#12294A] text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>{loading ? 'Adding...' : 'Add Blog'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <ReactQuill theme="snow" value={editHeadline} onChange={setEditHeadline} modules={quillModules} formats={quillFormats} placeholder="Main Headline" />
              <ReactQuill theme="snow" value={editSubHeadline} onChange={setEditSubHeadline} modules={quillModules} formats={quillFormats} placeholder="Subheadline" />
              <ReactQuill theme="snow" value={editDescription} onChange={setEditDescription} modules={quillModules} formats={quillFormats} placeholder="Description" />
              <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} className="w-full" />
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded text-gray-600">Cancel</button>
                <button type="submit" disabled={updateLoading} className={`px-6 py-2 bg-[#12294A] text-white rounded ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>{updateLoading ? 'Updating...' : 'Update Blog'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Read Modal */}
      {readModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[60%] lg:w-[50%] max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setReadModalData(null)} className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-red-600">&times;</button>
            <h2 className="text-lg font-bold mb-2" dangerouslySetInnerHTML={{ __html: readModalData?.MainHeadline || 'No Title' }} />
            <p className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: readModalData?.Subheadline }} />
            <img src={readModalData.image?.startsWith('http') ? readModalData.image : `http://localhost:5000/${readModalData.image}`} alt="Blog" className="w-full rounded mb-4 max-h-[400px] object-contain" />
            <div
              className="text-base text-black leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: parseYouTubeEmbeds(readModalData?.Description || '<p>सविस्तर माहिती लवकरच उपलब्ध होईल.</p>')
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
