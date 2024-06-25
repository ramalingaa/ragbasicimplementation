const ModalButtons = ({ connectBtnText, onClose, handleConnect, hideConnectBtn, showCloseBtnToTheRight, loading, loadingText, divClassName }: { connectBtnText?: string, onClose: () => void, handleConnect: () => void, hideConnectBtn?: boolean, showCloseBtnToTheRight?: boolean, loading?: boolean, loadingText?: string, divClassName?: string }) => {
    return (<div className={`flex flex-row items-center ${showCloseBtnToTheRight ? 'justify-end' : 'justify-center'} ${divClassName ? divClassName : 'w-full'}`}>
        {
            !showCloseBtnToTheRight && (
                <button
                    onClick={handleConnect}
                    hidden={hideConnectBtn}
                    disabled={loading}
                    className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-blue-500 hover:bg-[#2064e4] border
                    focus-visible:outline-blue-500"
                >
                    {loading ? loadingText ? loadingText : "Loading..." : connectBtnText || 'Connect'}
                </button>
            )
        }

    </div>
    )
}

export default ModalButtons;