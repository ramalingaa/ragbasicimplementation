import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';

interface SettingsSubpageHeadingProps {
  backLink: string;
  emoji?: string;
  title: string;
}

const SettingsSubpageHeading: React.FC<SettingsSubpageHeadingProps> = ({
  backLink,
  emoji,
  title,
}) => {
  const router = useRouter();

  return (
    <div
      className='flex items-center justify-center mb-6 relative flex-wrap'
    >
      <IoArrowBackOutline className='w-8 h-8 p-2 rounded-md hover:text-gray-600 focus:outline-none text-md absolute left-0 top-[50%] -translate-y-1/2 z-10 hover:bg-gray-100' onClick={() => router.push(backLink)} />
      <span
        className='sm:text-sm md:text-base ml-10 text-center font-extrabold'
      >
        <span> {emoji}</span>&nbsp;&nbsp;
        {title}
      </span>
    </div>
  );
};

export default SettingsSubpageHeading;
