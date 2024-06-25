import { IoIosAlert } from "react-icons/io";

const DeleteAccountSection = () => {
  const handleDeleteAccount = () => {
    window.location.href = 'mailto:help@structuredlabs.io';
  };

  return (
    <>
      <div className="bg-red-100 text-white p-4 mb-2 flex justify-between items-center rounded-md">
        <div className="flex-grow flex justify-between items-center">
          <h2 className="flex flex-row font-bold mr-2 text-black items-center">

            <IoIosAlert className='w-6 h-6 text-red-500 mr-2' />

            Delete Account</h2>
          <button
            className="bg-red-600 text-white py-2 px-4 border-0 rounded focus:outline-none focus:shadow-outline"
            onClick={handleDeleteAccount}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="border-t-2 border-gray-200 mb-2"></div>
    </>
  );
};

export default DeleteAccountSection;
