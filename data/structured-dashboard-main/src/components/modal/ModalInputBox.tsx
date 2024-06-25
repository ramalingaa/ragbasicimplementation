const ModalInputBox = ({ className, title, value, type, required, disabled, onChange, placeholder, textArea }: { title: string, value: any, type?: string, required?: boolean, disabled?: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string, className?: string, textArea?: boolean }) => {
  return (
    <div className={` ${className}`}>
      <label htmlFor={title} className={`block text-sm font-medium leading-6 text-gray-900`}>
        {title}
      </label>
      <div className="mt-2">
        {
          textArea ?
            <textarea
              id={title}
              name={title}
              autoComplete="type"
              required={required || false}
              disabled={disabled || false}
              value={value}
              rows={3}
              onChange={onChange}
              placeholder={placeholder || ""}
              className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6 focus:outline-none"
            />
            :
            <input
              id={title}
              name={title}
              type={type || "text"}
              autoComplete="type"
              required={required || false}
              disabled={disabled || false}
              value={value}
              onChange={onChange}
              placeholder={placeholder || ""}
              className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6 focus:outline-none"
            />}
      </div>
    </div>
  )
}

export default ModalInputBox;