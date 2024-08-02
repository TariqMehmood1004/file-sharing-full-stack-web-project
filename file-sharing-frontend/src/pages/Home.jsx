import React from 'react';
import FileUpload from '../components/FileUpload';
import FileDownload from '../components/FileDownload';

const Home = () => {
  return (
    <div className="w-full bg-black min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl rounded-lg shadow-md mb-6">
        <FileUpload />
      </div>
      <div className="w-full max-w-4xl rounded-lg shadow-md">
        <FileDownload />
      </div>
    </div>
  );
};

export default Home;
