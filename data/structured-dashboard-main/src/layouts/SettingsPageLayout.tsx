'use client';
import { useEffect, useState } from 'react';
import useUserProfileInfo from 'hooks/settings/useUserProfileInfo';
import TeamSettingsContainer from 'components/settings/team/TeamSettingsContainer';
import CurrentPlanContainer from 'components/settings/billing/CurrentPlanContainer';
import CustomPlanContainer from 'components/settings/billing/CustomPlanContainer';
import PlanCancellationPolicyContainer from 'components/settings/billing/PlanCancellationPolicyContainer';
import { usePathname, useRouter } from 'next/navigation';

const secondaryNavigation = [
    { name: 'Account', current: false, component: <AccountSettings /> },
    { name: 'Workspace', current: false, component: <Container><TeamSettingsContainer /></Container> },
    { name: 'Billing', current: false, component: <BillingPageContent /> },
]

function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col w-[80%] mx-auto bg-white rounded-md p-4 mt-4 mb-10'>
            {children}
        </div>
    )
}

function BillingPageContent() {
    return (
        <Container>
            <CurrentPlanContainer />
            <div
                className='flex flex-col mt-40 gap-y-4'>
                <CustomPlanContainer />
                <PlanCancellationPolicyContainer />
            </div>
        </Container>
    )
}

function InputBox({ title, type, onChange, textArea, value }: { title: string, type?: string, onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void, textArea?: boolean, value: any }) {
    return (
        <div className="col-span-full">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-black">
                {title}
            </label>
            <div className="mt-2">
                {
                    textArea ?
                        <textarea
                            id={title}
                            name={title}
                            autoComplete={title}
                            value={value}
                            onChange={onChange}
                            className="px-2 block w-full rounded-md border-0 bg-white py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                        :
                        <input
                            id={title.toLocaleLowerCase()}
                            name={title.toLocaleLowerCase()}
                            type={type || "text"}
                            autoComplete={title.toLocaleLowerCase()}
                            onChange={onChange}
                            value={value}
                            className="block w-full rounded-md border-0 bg-white py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-2"
                        />
                }
            </div>
        </div>
    )
}

function PasswordChangeSection() {
    return (
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
                <h2 className="text-base font-semibold leading-7 text-black">Change password</h2>
                <p className="mt-1 text-sm leading-6 text-gray-800">
                    Update your password associated with your account.
                </p>
            </div>

            <form className="md:col-span-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                        <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-black">
                            Current password
                        </label>
                        <div className="mt-2">
                            <input
                                id="current-password"
                                name="current_password"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-black">
                            New password
                        </label>
                        <div className="mt-2">
                            <input
                                id="new-password"
                                name="new_password"
                                type="password"
                                autoComplete="new-password"
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-black">
                            Confirm password
                        </label>
                        <div className="mt-2">
                            <input
                                id="confirm-password"
                                name="confirm_password"
                                type="password"
                                autoComplete="new-password"
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}

export default function SettingsPageLayout() {

    const [navigations, setNavigations] = useState(secondaryNavigation)
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // get the current navigation from the url
        const currentNavigation = pathname.split('/').pop()
        if (currentNavigation == 'settings') {
            setNavigations(
                secondaryNavigation.map((nav) => {
                    if (nav.name.toLowerCase() === 'account') {
                        router.push('/settings/account')
                        return { ...nav, current: true }
                    }
                    return { ...nav, current: false }
                })
            )
        } else {
            setNavigations(
                secondaryNavigation.map((nav) => {
                    if (nav.name.toLowerCase() === currentNavigation) {
                        router.push(`/settings/${nav.name.toLowerCase()}`)
                        return { ...nav, current: true }
                    }
                    return { ...nav, current: false }
                })
            )
        }
    }, [])

    return (
        <>
            <h1 className="sr-only">Account Settings</h1>
            <header className="border-b border-[#eeeff1] h-12 content-center">
                <nav className="flex overflow-x-auto">
                    <ul
                        role="list"
                        className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-medium leading-6 text-gray-800 sm:px-6 lg:px-8"
                    >
                        {navigations.map((item) => (
                            <li key={item.name}>
                                <a className={`cursor-pointer ${item.current ? 'text-gray-800' : 'text-gray-400'}`}
                                    onClick={() => {
                                        setNavigations(
                                            navigations.map((nav) => {
                                                if (nav.name === item.name) {
                                                    return { ...nav, current: true }
                                                }
                                                return { ...nav, current: false }
                                            })
                                        )
                                        router.push(`/settings/${item.name.toLowerCase()}`)
                                    }}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            {navigations.find((nav) => nav.current)?.component || <div className="mt-4 py-4 flex justify-center items-center h-full">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-gray-600"
                    role="status">
                    <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span>
                </div>
            </div>}
        </>
    )
}

function AccountSettings() {
    const {
        phoneNumber,
        setPhoneNumber,
        email,
        setEmail,
        initiateSaveUserProfileInfo,
        isLoading,
        error,
        isSavedSuccessfully,
        name,
        setName,
        company,
        setCompany,
        techStack,
        setTechStack,
    } = useUserProfileInfo();

    const handleDeleteAccount = () => {
        window.location.href = 'mailto:help@structuredlabs.io';
    };

    const handleSaveUserProfileInfo = async (e:any) => {
        e?.preventDefault();
        console.log('saving user profile info');
        await initiateSaveUserProfileInfo();
    }

    function DeleteAccountSection() {
        return (
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-black">Delete account</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-800">
                        No longer want to use our service? You can delete your account here. This action is not reversible.
                        All information related to this account will be deleted permanently.
                    </p>
                </div>

                <form className="flex items-start md:col-span-2 justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
                        onClick={handleDeleteAccount}
                    >
                        Yes, delete my account
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="divide-y divide-white/5">
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-black">
                        Personal Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-800">
                        Use a permanent address where you can receive mail.
                    </p>
                </div>

                <form className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                        {/* <div className="col-span-full flex items-center gap-x-8">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                                className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                            />
                            <div>
                                <button
                                    type="button"
                                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-white/20"
                                >
                                    Change avatar
                                </button>
                                <p className="mt-2 text-xs leading-5 text-gray-800">JPG, GIF or PNG. 1MB max.</p>
                            </div>
                        </div> */}

                        <InputBox
                            title="Name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />

                        <InputBox
                            title="Phone Number"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                        />

                        <InputBox
                            title="Email Address"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />

                        <InputBox
                            title="Company (Optional)"
                            onChange={(e) => setCompany(e.target.value)}
                            value={company}
                        />

                        <InputBox
                            title="Tell us a bit about your tech stack"
                            onChange={(e) => setTechStack(e.target.value)}
                            textArea
                            value={techStack}
                        />
                    </div>

                    <div className="mt-8 flex">
                        <button
                            type="submit"
                            className={`focus-visible:outline-indigo-500 flex mt-4 justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${isLoading ? 'bg-blue-300 cursor-not-allowed' : ''
                                }`}
                            onClick={handleSaveUserProfileInfo}
                            disabled={isLoading}
                        >
                            {!isLoading ? "Save" : "Saving..."}
                            {/* {'Save'} */}
                        </button>
                    </div>
                </form>
            </div>

            <DeleteAccountSection />
        </div>
    );
}

export function WarningsSection({
    title,
    subString,
    btnText,
    btnFunc,
    isLoading,
}: {
    title: string;
    subString: string;
    btnText: string;
    btnFunc: () => void;
    isLoading: boolean;
}) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        btnFunc();
    };

    return (
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
                <h2 className="text-base font-semibold leading-7 text-black">
                    {title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-800">{subString}</p>
            </div>

            <div className="md:col-span-2">
                <div className="flex w-full justify-end">
                    <button
                        type="button"
                        onClick={handleClick}
                        className="rounded-md bg-gray-100 text-red-500 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-red-500 hover:text-gray-100"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : btnText}
                    </button>
                </div>
            </div>
        </div>
    );
}

function LogoutAllSessions() {
    return (
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
                <h2 className="text-base font-semibold leading-7 text-black">Log out other sessions</h2>
                <p className="mt-1 text-sm leading-6 text-gray-800">
                    Please enter your password to confirm you would like to log out of your other sessions across all of
                    your devices.
                </p>
            </div>

            <form className="md:col-span-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                        <label htmlFor="logout-password" className="block text-sm font-medium leading-6 text-black">
                            Your password
                        </label>
                        <div className="mt-2">
                            <input
                                id="logout-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        Log out other sessions
                    </button>
                </div>
            </form>
        </div>

    )
}