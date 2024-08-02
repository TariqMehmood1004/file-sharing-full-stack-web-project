import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';


const FileDownload = () => {
    const [key, setKey] = useState('');
    const [error, setError] = useState(null);
    const baseURL = config.apiBaseUrl;
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const handleKeyChange = (e) => {
        setKey(e.target.value);
    };

    const handleDownload = async () => {
        if (!key) {
            setError('No file key provided.');
            return;
        }

        try {
            const response = await axios.get(`${baseURL}/file-metadata/${key}`);
            const fileExtension = response.data.extension;

            const downloadResponse = await axios({
                url: `${baseURL}/download/${key}`,
                method: 'GET',
                responseType: 'blob', // Important for file download
            });

            const url = window.URL.createObjectURL(new Blob([downloadResponse.data], { type: getContentType(fileExtension) }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', key + fileExtension);
            document.body.appendChild(link);
            link.click();
            setDownloadSuccess(true);
            setError(null);
        } catch (err) {
            setDownloadSuccess(false);
            if (err.response) {
                setError(`Server Error: ${err.response.data.error || 'An error occurred'}`);
            } else if (err.request) {
                setError('Network Error: No response received from server');
            } else {
                setError(`Error: ${err.message}`);
            }
        }
    };

    const getContentType = (extension) => {
        switch (extension) {
            case '.jpg':
            case '.jpeg':
                return 'image/jpeg';
            case '.png':
                return 'image/png';
            case '.gif':
                return 'image/gif';
            case '.pdf':
                return 'application/pdf';
            case '.txt':
                return 'text/plain';
            case '.doc':
                return 'application/msword';
            case '.docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case '.xls':
                return 'application/vnd.ms-excel';
            case '.xlsx':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            case '.ppt':
                return 'application/vnd.ms-powerpoint';
            case '.zip':
                return 'application/zip';
            case '.rar':
                return 'application/x-rar-compressed';
            case '.7z':
                return 'application/x-7z-compressed';
            default:
                return 'application/octet-stream';
        }
    };

    return (
        <div className='w-full max-w-md mx-auto'>
  <div className='grid gap-4'>
    <div className='py-6 px-4 bg-[#0D0E18] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
      <div className='mb-4'>
        <label htmlFor="key" className='block mb-2 text-sm font-medium text-slate-100'>File Key</label>
        <input
          value={key}
          onChange={handleKeyChange}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          placeholder="Enter file key"
          required
        />
      </div>
      <button
        onClick={handleDownload}
        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center'
      >
        Download
      </button>
    </div>

    {downloadSuccess && (
      <div className='p-4 mb-4 mt-3 text-sm text-green-50 rounded-lg bg-green-500' role="alert">
        <span className='font-medium'>File downloaded successfully!</span>
      </div>
    )}

    {error && (
      <p className='mt-4 text-red-500 text-center'>
        <b>Error:</b> {error}
      </p>
    )}
  </div>
</div>

    );
};

export default FileDownload;
