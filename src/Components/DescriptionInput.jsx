// DescriptionInput.jsx
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'link', 'image'
];

export default function DescriptionInput({ value, onChange }) {
  return (
    <div className="col-span-1 md:col-span-2">
      <label className="font-semibold">Description</label>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="bg-white mt-2"
        placeholder="Write news description..."
      />
    </div>
  );
}
