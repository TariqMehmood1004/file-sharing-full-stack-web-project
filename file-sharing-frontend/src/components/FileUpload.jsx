import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [filePreview, setFilePreview] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [expiryTime, setExpiryTime] = useState(null);
    const [showKeys, setShowKeys] = useState('');

    const baseURL = config.apiBaseUrl;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : '');

        if (selectedFile) {
            // Create a preview for image files
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setFilePreview(''); // Clear preview for non-image files
            }
        } else {
            setFilePreview(''); // Clear preview if no file is selected
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${baseURL}/upload`, formData);

            console.log(response.data);

            setShowKeys(response.data.key);
            
            setUploadSuccess(true);
            setError(null);

            // Handle the expiration time
            const expirationDate = new Date(response.data.expiryTime);
            if (!isNaN(expirationDate.getTime())) {
                setExpiryTime(expirationDate.toLocaleString()); // Display formatted date
            } else {
                setExpiryTime('Invalid Date'); // Fallback for invalid date
            }
        } catch (err) {
            setUploadSuccess(false);
            if (err.response) {
                setError(`Server Error: ${err.response.data.error || 'An error occurred'}`);
            } else if (err.request) {
                setError('Network Error: No response received from server');
            } else {
                setError(`Error: ${err.message}`);
            }
        }
    };

    return (
       <div className="w-full sm:w-4/6 md:w-1/2 lg:w-1/2 p-4 rounded my-4 mx-auto">
            <div className="flex w-full flex-col items-center justify-center">
                <label
                    htmlFor="uploadFile1"
                    className="text-gray-500 p-4 font-semibold text-base rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]">
                    {filePreview ? (
                        <img src={filePreview} alt="File Preview" className="h-1/3  rounded-lg object-contain" />
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-1/3 mb-2 fill-gray-500" viewBox="0 0 40 40">
                                <path
                                    d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                    data-original="#000000" />
                                <path
                                    d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                    data-original="#000000" />
                            </svg>
                            <span>Upload file</span>

                            <input type="file" onChange={handleFileChange} id='uploadFile1' className="hidden" />
                            <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG, SVG, WEBP, and GIF are Allowed.</p>
                        </>
                    )}
                </label>
            </div>

            <button onClick={handleUpload} className="w-full text-white bg-blue-700 my-4 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">
                Upload
            </button>

            {uploadSuccess && (
                <div className="p-4 mb-4 mt-3 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <span className="font-medium">File expires at</span> {expiryTime}
                </div>
            )}

            {showKeys && (
                <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                    <span className="font-medium">File Key: </span>
                    {showKeys}
                </div>
            )}

            {error && <p className="text-red-500">Error: {error}</p>}
        </div>
    );
};

export default FileUpload;
