import React, { useState, useRef, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import {
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesQuery,
} from "../Redux/Categories";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const imageHandler = () => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        const quill = window.quillRef;
        const range = quill.getEditorSelection();
        quill.getEditor().insertEmbed(range.index, "image", base64Image);
      };
      reader.readAsDataURL(file);
    }
  };
};

const quillModules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
    handlers: { image: imageHandler },
  },
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

const DropdownCheckbox = ({ label, options, selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleOption = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="border border-[#cdd1d5] px-4 py-3 rounded cursor-pointer text-gray-600"
      >
        {selected.length > 0
          ? options
              .filter((opt) => selected.includes(opt._id))
              .map((opt) => opt.name)
              .join(", ")
          : `Select ${label}`}
      </div>
      {open && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded shadow-md mt-1 w-full max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt._id}
              className="flex items-center px-3 py-2 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt._id)}
                onChange={() => toggleOption(opt._id)}
                className="mr-2"
              />
              {opt.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const AddNewsForm = ({
  onSubmit,
  buttonLabel = "+ Add News",
  defaultValues = {},
  mode = "add",
}) => {
  const { user } = useSelector((state) => state.auth);
  const reporterId = user?.reporter?._id;
  const { data: categoryData = [] } = useGetAllCategoriesQuery();
  const { data: subCategoryData = {}, isLoading: isFetching } =
    useGetAllSubCategoriesQuery();

  const subcategories = subCategoryData?.subcategories || [];

  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    defaultValues.serviceId ? [defaultValues.serviceId] : []
  );
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState(
    defaultValues.subcategoryId ? [defaultValues.subcategoryId] : []
  );
  const [mainHeadline, setMainHeadline] = useState(
    defaultValues.MainHeadline || ""
  );
  const [subheadline, setSubheadline] = useState(
    defaultValues.Subheadline || ""
  );
  const [description, setDescription] = useState(
    defaultValues.Description || ""
  );
  const [mediaFile, setMediaFile] = useState(null);

  const buildSubcategoryMap = () => {
    const map = {};
    selectedCategoryIds.forEach((serviceId) => {
      map[serviceId] = [...selectedSubCategoryIds];
    });
    return map;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subcategoryMap = buildSubcategoryMap();
    const formData = new FormData();

    if (mode === "add") {
      if (
        !selectedCategoryIds.length ||
        !Object.keys(subcategoryMap).length ||
        !mainHeadline.trim() ||
        !subheadline.trim() ||
        !description.trim() ||
        !mediaFile ||
        !reporterId
      ) {
        alert("Missing required fields for adding news.");
        return;
      }
      formData.append("serviceIds", JSON.stringify(selectedCategoryIds));
      formData.append("subcategoryMap", JSON.stringify(subcategoryMap));
      formData.append("MainHeadline", mainHeadline);
      formData.append("Subheadline", subheadline);
      formData.append("Description", description);
      formData.append("image", mediaFile);
      formData.append("reporterId", reporterId);
    } else {
      // edit mode — only append changed fields
      if (selectedCategoryIds.length)
        formData.append("serviceIds", JSON.stringify(selectedCategoryIds));
      if (Object.keys(subcategoryMap).length)
        formData.append("subcategoryMap", JSON.stringify(subcategoryMap));
      if (mainHeadline) formData.append("MainHeadline", mainHeadline);
      if (subheadline) formData.append("Subheadline", subheadline);
      if (description) formData.append("Description", description);
      if (mediaFile) formData.append("image", mediaFile);
      if (reporterId) formData.append("reporterId", reporterId);
    }

    onSubmit(formData);
  };

  return (
    <div className="bg-white font-tiro text-sm text-[#666] rounded-lg p-2 h-[520px] overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        encType="multipart/form-data"
      >
        <div className="col-span-1 lg:col-span-2">
          <DropdownCheckbox
            label="Categories"
            options={categoryData}
            selected={selectedCategoryIds}
            setSelected={setSelectedCategoryIds}
          />
        </div>

        <div className="col-span-1 lg:col-span-2">
          {isFetching ? (
            <p>Loading Subjects...</p>
          ) : (
            <DropdownCheckbox
              label="Subjects"
              options={subcategories}
              selected={selectedSubCategoryIds}
              setSelected={setSelectedSubCategoryIds}
            />
          )}
        </div>

        <input
          type="text"
          placeholder="Main Headline"
          value={mainHeadline}
          onChange={(e) => setMainHeadline(e.target.value)}
          className="col-span-1 lg:col-span-2 border border-[#cdd1d5] rounded px-4 py-3 text-gray-700"
        />

        <input
          type="text"
          placeholder="Subheadline"
          value={subheadline}
          onChange={(e) => setSubheadline(e.target.value)}
          className="col-span-1 lg:col-span-2 border border-[#cdd1d5] rounded px-4 py-3 text-gray-700"
        />

        <div className="col-span-1 lg:col-span-2">
          <ReactQuill
            ref={(el) => {
              window.quillRef = el;
            }}
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write description..."
            className="h-[200px] overflow-auto"
          />
        </div>

        {/* ✅ Media preview before upload */}
        {!mediaFile && defaultValues?.image && (
          <div className="col-span-1 lg:col-span-2">
            {defaultValues.image.endsWith(".mp4") ? (
              <video
                src={defaultValues.image}
                controls
                className="w-full rounded mb-4 max-h-[300px] object-contain"
              />
            ) : (
              <img
                src={defaultValues.image}
                alt="Existing"
                className="w-full rounded mb-4 max-h-[300px] object-contain"
              />
            )}
          </div>
        )}

        <label className="col-span-1 lg:col-span-2 border border-[#cdd1d5] rounded py-3 flex flex-col mt-2 justify-center items-center text-gray-500 gap-2 cursor-pointer">
          <FiUpload size={20} />
          <span>{mediaFile ? mediaFile.name : "Upload Image or Video"}</span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMediaFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        <div className="col-span-1 lg:col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-[#12294A] text-white px-6 py-3 rounded hover:bg-[#0e1d3f]"
          >
            {buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewsForm;
