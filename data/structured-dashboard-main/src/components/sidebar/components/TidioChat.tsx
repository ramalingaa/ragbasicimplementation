import Script from 'next/script'
import React, { useEffect } from 'react'

type Props = {
    visible?: boolean
}
declare global {
    interface Window {
        tidioChatApi: any;
    }
    interface Element {
        style: any;
    }
}

export function TidioChat(
    {
        visible
    }: Props
) {

    useEffect(() => {
        const onTidioChatApiReady = () => {
            if (!visible) {
                window.tidioChatApi.hide();
            }
        };
        if (window.tidioChatApi) {
            if (!visible) {
                window.tidioChatApi.hide();
                window.tidioChatApi.popUpOpen();
            } else {
                window.tidioChatApi.show();
            }
            window.tidioChatApi.on("ready", onTidioChatApiReady);
        } else {
            document.addEventListener("tidioChat-ready", onTidioChatApiReady);
        }

        return () => {
            if (window.tidioChatApi) {
                // window?.tidioChatApi?.remove();
            }
        };
    }, [visible])

    useEffect(() => {
        // run every 1 second
        const interval = setInterval(() => {
            createCustomBtn();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const createCustomBtn = () => {
        // Select the target container
        // Access the iframe by its ID
        const iframe = document.getElementById('tidio-chat-iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow && iframe.contentDocument) {
            const iframeDocument = iframe.contentDocument;
            if (iframeDocument) {
                // Select the target container inside the iframe
                const container = iframeDocument.querySelector('.widget-position-right');
                if (container && !iframeDocument.querySelector('#custom-tidio-close-btn')) {
                    // Create the new button element
                    const buttonElement = document.createElement('div');
                    buttonElement.id = 'custom-tidio-close-btn';
                    buttonElement.className = 'bg-white';
                    buttonElement.style.cssText = `
                height: 2rem;
                width: 2rem;
                position: absolute;
                right: 0;
                display: flex;
                align-items: center;
                margin-right: 1rem;
              `;
                    buttonElement.innerHTML = `<button class="text-gray-800 outline-none" style="height: 2rem; font-size: x-large;">x</button>`;
                    buttonElement.onclick = () => window.tidioChatApi.hide();

                    // Prepend the new element to the container as the first child
                    if (container.firstChild) {
                        console.log("container.firstChild")
                        container.insertBefore(buttonElement, container.firstChild);
                    } else {
                        container.appendChild(buttonElement);
                    }
                }
            }
        }
    };

    return (
        <>
            <Script
                strategy="lazyOnload"
                src="//code.tidio.co/cyuxtfgfoyy4cvvgsxr3b0uyze8nsgas.js"
                async
            />
        </>
    )
}