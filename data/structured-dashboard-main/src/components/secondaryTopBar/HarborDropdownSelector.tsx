import { Component, Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { ComponentView, useHarborStore } from 'zustand/harbor/harborStore'
import { useWorkspaceStore } from 'zustand/workspaces/workspaceStore'

type Option = {
    id: number
    name: ComponentView
}

const options: Option[] = [
    { id: 1, name: 'source' },
    { id: 2, name: 'type' },
    { id: 3, name: 'unit' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function HarborDropdownSelector() {
    const {
        componentView,
        setComponentView,
    } = useHarborStore();
    const { currentWorkspace } = useWorkspaceStore();
    const [selected, setSelected] = useState(options.find(option => option.name === componentView) || options[0]);
    useEffect(() => {
        setComponentView(selected.name)
    }, [selected]);
    // const [prevWorkspaceId, setPrevWorkspaceId] = useState<string | null>(null);
    // useEffect(() => {
    //     if (currentWorkspace?.WorkspaceID) {
    //         if (selected.id !== 1) {
    //             setSelected(options[0]);
    //         }
    //     }
    // }, [currentWorkspace?.WorkspaceID]);

    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <>
                    {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Listbox.Label> */}
                    <div className="relative">
                        <Listbox.Button className="relative w-32 cursor-default rounded-md bg-white py-1 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
                            <span className="block truncate capitalize">{selected.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-[1.75rem] w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {options.map((person) => (
                                    <Listbox.Option
                                        key={person.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-blue-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-8 pr-4'
                                            )
                                        }
                                        value={person}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate capitalize')}>
                                                    {person.name}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-blue-600',
                                                            'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                                        )}
                                                    >
                                                        <CheckIcon className="h-[1.75rem] w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
