import { PlusIcon } from '@heroicons/react/20/solid'

export default function EmptyState({
    title,
    desciption,
    btnText,
    icon
}: {
    title: string
    desciption: string
    btnText?: string
    icon?: React.ReactNode
}) {
    return (
        <div className="text-center h-full content-center w-full">
            {icon ? icon : <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
            </svg>}
            <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{desciption}</p>
            {btnText && <div className="mt-6">
                <button
                    type="button"
                    className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-[#2064e4] border border-blue-500 h-8"
                >
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    {btnText}
                </button>
            </div>}
        </div>
    )
}