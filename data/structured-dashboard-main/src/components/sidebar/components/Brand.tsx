import { AppIconNoText } from 'components/icons/AppIconNoText';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '../../../zustand/app/appStore';

export function SidebarBrand() {
  const router = useRouter();

  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const mobileScreenSidebarOpen = useSidebarStore((state) => state.mobileScreenSidebarOpen);

  return (
    <div
      className="flex items-center justify-center h-12 flex-col"
    >
      <div
        className="w-full h-full flex items-center justify-center cursor-pointer"
        onClick={() => router.push('/harbor')}
      >
        {isSidebarOpen || mobileScreenSidebarOpen ? (
          <div
            className="w-full h-12 mx-auto flex items-center justify-center border-b border-gray-200"
          >
            <div
              className="rounded-full bg-gray-100 w-8 h-8 flex items-center justify-center mr-2 overflow-hidden"
            >
              <div
                className="flex items-center justify-center scale-125"
              >
                <AppIconNoText />
              </div>
            </div>
            <span className="text-lg font-bold text-black">{'structured'}</span>
          </div>
        ) : (
          <div
            className="w-full h-12 flex items-center justify-center overflow-hidden border-b border-gray-200"
          >
            <div
              className="rounded-full bg-gray-100 mx-auto w-8 h-8 flex items-center justify-center overflow-hidden"
            >
              <div
                className="flex items-center justify-center scale-125"
              >
                <AppIconNoText />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default SidebarBrand;
