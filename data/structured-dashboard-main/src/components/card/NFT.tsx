import { useState } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

export default function NFT(props: {
  image: string | any;
  name: string;
  author: string;
  bidders: string[] | any[];
  download: string;
  currentbid: string | number;
}) {
  const { image, name, author, bidders, download, currentbid } = props;
  const [like, setLike] = useState(false);
  return (
    <div className="p-5 bg-white rounded-lg shadow">
      <div className="flex flex-col justify-center">
        <div className="relative mb-5">
          <div className="aspect-w-7 aspect-h-5">
            <img src={image.src} className="w-full rounded-lg" alt="" />
          </div>
          <button
            className="absolute bg-white hover:bg-gray-200 active:bg-white focus:bg-white p-0 top-3.5 right-3.5 rounded-full w-9 h-9"
            onClick={() => setLike(!like)}
          >
            {like ? (
              <IoHeart className="w-5 h-5 text-brand-500 transition duration-200 ease-linear" />
            ) : (
              <IoHeartOutline className="w-5 h-5 text-brand-500 transition duration-200 ease-linear" />
            )}
          </button>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-auto">
            <div className="flex flex-col">
              <span className="text-navy-700 font-bold text-lg mb-1.5">
                {name}
              </span>
              <span className="text-secondaryGray-600 text-sm font-normal">
                {author}
              </span>
            </div>
            <div className="flex -space-x-2 mt-0">
              {bidders.map((avt, key) => (
                <img key={key} src={avt.src} alt="" className="w-8 h-8 rounded-full border-2 border-white" />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <span className="font-bold text-sm text-brand-500">
              Current Bid: {currentbid}
            </span>
            <a href={download}>
              <button
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Place Bid
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}