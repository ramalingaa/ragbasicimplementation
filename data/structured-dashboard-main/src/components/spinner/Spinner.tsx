const Spinner = ({className}:{className?:string}) => {
    return (<div className="flex items-center justify-center">
        <div
            className={`inline-block ${className ? className : 'h-8 w-8 border-4'} animate-spin rounded-full border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-gray-600`}
            role="status">
            <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
        </div>
    </div>
    )
}

export default Spinner;