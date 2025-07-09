import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useGetAllCategoriesQuery, useGetAllSubCategoriesQuery } from "../Redux/Categories";
import { useAddNewsMutation } from "../Redux/newsAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

// Default toolbar (no image)
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

// Toolbar with image upload for Description only
const quillModulesWithImage = {
  toolbar: {
    container: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
    handlers: {
      image: function () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
          const file = input.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const range = this.quill.getSelection();
              this.quill.insertEmbed(range.index, 'image', reader.result);
            };
            reader.readAsDataURL(file); // convert image to base64 string
          }
        };
      },
    },
  },
};

// Formats
const quillFormats = [
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'link', 'image',
];

const AddBlogsBtn = ({ buttonLabel = "+ Add News", defaultValues = {} }) => {
  const { data: categoryData = [] } = useGetAllCategoriesQuery();
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultValues.serviceId || "");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(defaultValues.subcategoryId || "");
  const [mainHeadline, setMainHeadline] = useState(defaultValues.MainHeadline || "");
  const [subheadline, setSubheadline] = useState(defaultValues.Subheadline || "");
  const [description, setDescription] = useState(defaultValues.Description || "");
  const [mediaFile, setMediaFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const auth = useSelector((state) => state.auth);
  const reporterId = auth?.user?.reporter?._id;

  const { data: subCategoryData, isFetching } = useGetAllSubCategoriesQuery(selectedCategoryId, {
    skip: !selectedCategoryId,
  });

  const subcategories = subCategoryData?.product?.subcategories || [];

  const [addNews, { isLoading }] = useAddNewsMutation();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedCategoryId || !selectedSubCategoryId ||
      !mainHeadline || !subheadline || !description ||
      !mediaFile || !reporterId
    ) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("serviceId", selectedCategoryId);
    formData.append("subcategoryId", selectedSubCategoryId);
    formData.append("MainHeadline", mainHeadline);
    formData.append("Subheadline", subheadline);
    formData.append("Description", description);
    formData.append("image", mediaFile);
    formData.append("reporterId", reporterId);

    try {
      await addNews(formData).unwrap();
      toast.success("News added successfully!");
      navigate("/totalnews");

      // Reset form
      setSelectedCategoryId("");
      setSelectedSubCategoryId("");
      setMainHeadline("");
      setSubheadline("");
      setDescription("");
      setMediaFile(null);
      setPreviewURL(null);
    } catch (error) {
      console.error("Failed to add news:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 font-tiro py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 md:p-10 rounded shadow-md w-full sm:w-10/12 lg:w-10/12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        encType="multipart/form-data"
      >
        {/* Category */}
        <select
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setSelectedSubCategoryId("");
          }}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">Select Category</option>
          {categoryData.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        {/* Subcategory */}
        <select
          value={selectedSubCategoryId}
          onChange={(e) => setSelectedSubCategoryId(e.target.value)}
          className="border border-gray-300 p-2 rounded"
          disabled={!selectedCategoryId || isFetching}
        >
          <option value="">{isFetching ? "Loading Subjects..." : "Select Subject"}</option>
          {subcategories.length > 0 ? (
            subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))
          ) : (
            !isFetching && <option disabled>No subjects available</option>
          )}
        </select>

        {/* Main Headline */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Main Headline</label>
          <ReactQuill
            theme="snow"
            value={mainHeadline}
            onChange={setMainHeadline}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write main headline..."
          />
        </div>

        {/* Subheadline */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
          <ReactQuill
            theme="snow"
            value={subheadline}
            onChange={setSubheadline}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write subheadline..."
          />
        </div>

        {/* Description (with Image Upload) */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={quillModulesWithImage}
            formats={quillFormats}
            placeholder="Write description..."
          />
        </div>

        {/* Upload Image or Video */}
        <label className="border border-gray-300 p-4 rounded flex flex-col items-center justify-center cursor-pointer h-full overflow-hidden col-span-1 md:col-span-2">
          <FiUpload className="mb-2 text-gray-500" size={20} />
          <span className="text-gray-500 text-sm">{mediaFile ? mediaFile.name : "Upload Image / Video"}</span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Preview */}
        {previewURL && (
          <div className="col-span-1 md:col-span-2">
            {mediaFile?.type?.startsWith("video") ? (
              <video controls className="w-full max-h-[300px] rounded">
                <source src={previewURL} type={mediaFile.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={previewURL} alt="preview" className="w-full max-h-[300px] object-contain rounded" />
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`col-span-1 md:col-span-2 bg-[#12294A] text-white px-4 py-2 rounded transition ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0e1f3a]"}`}
        >
          {isLoading ? "Adding..." : buttonLabel}
        </button>
      </form>
    </div>
  );
};

export default AddBlogsBtn;



