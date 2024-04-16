"use client";

import { Dialog, Transition } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import LoadingText from "../_elements/LoadingText";
import { PlusIcon } from "../_elements/icons";

type ViewTableProps = {
    viewTitle: string | "View Table";
    addItem: any;
    deleteItem: any;
    data: any | [];
    headers: any | [];
    viewItemRoutePrefix?: string;
    structureTheData?: any;
}

export default function ViewTable(
    { viewTitle, addItem, deleteItem, data, headers, viewItemRoutePrefix, structureTheData }: ViewTableProps
) {
    const router = useRouter();
    const path = usePathname();
    const [allItems, setAllItems] = useState<any>(data || []);
    const [openModal, setOpenModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>({
        id: '',
        title: ''
    });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!!data) {
            setAllItems(data);
        }
    }, [data]);

    const handleOpenItem = async (itemId: string) => {
        let route = !!viewItemRoutePrefix ? viewItemRoutePrefix : '';
        route += `/${itemId}`;
        router.push(route)
    }

    const handleOpenModal = (id: any, title: any) => {
        const payload = {} as any;
        payload.id = id;
        payload.title = !!title ? title : false;

        setItemToDelete({ id, title });
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setItemToDelete({ id: '', title: '' });
        setOpenModal(false);
    }

    const handleDeleteItem = async (itemId: string) => {
        setDeleting(true);
        const payload = { _id: itemId }
        const rawData = await deleteItem(payload);

        if (!rawData.success) {
            console.error(rawData.error);
            setDeleting(false);
            handleCloseModal();
            return;
        }
        const structuredData = await structureTheData(rawData.data);
        const data = structuredData.body;
        setAllItems(data);
        setDeleting(false);
        handleCloseModal();
    }

    return (
        <>
            <Transition appear show={openModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Permanently Delete
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete the item titled: <span className="font-semibold">{!!itemToDelete.title ? itemToDelete.title : itemToDelete.id}</span>? This cannot be undone.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        {!deleting && (
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-shade-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={handleCloseModal}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ml-2"
                                            onClick={() => handleDeleteItem(itemToDelete.id)}
                                        >
                                            {!deleting ? ('Delete') : (<LoadingText text={'Deleting...'} className={''} iconClassName={'w-4 h-4'} />)}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <div className="relative overflow-x-auto shadow-md rounded-lg m-4 bg-white">



                {!!allItems.length ? (
                    <>
                        <div className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 dark:text-white">
                            <h1 className="text-2xl font-bold mr-auto">{viewTitle}</h1>
                            {addItem}
                        </div>
                        <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-[calc(100%-20px)] mx-auto table-auto">
                            <thead className="max-[760px]:hidden text-xs text-gray-700 uppercase dark:text-gray-400 rounded-md ">
                                <tr className="">
                                    {headers.map((header: any, index: any) => {
                                        return (
                                            <th
                                                key={index}
                                                scope="col"
                                                className={`bg-gray-50 px-6 py-3 ${index === 0 ? 'rounded-l-lg' : ''}`}
                                            >
                                                {header}
                                            </th>
                                        )
                                    })}
                                    <th scope="col" className="bg-gray-50 px-6 py-3 text-right rounded-r-lg">Actions</th>
                                </tr>
                            </thead>


                            <tbody className="">
                                {allItems.map((item: any, index: any) => {
                                    return (
                                        <tr key={index} className="p-2 mb-4 rounded-lg md:rounded-none bg-gray-50 md:bg-white md:border-b dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-2 md:table-row relative cursor-pointer hover:bg-gray-100 md:hover:bg-gray-50 transition-300">
                                            {headers.map((valueKey: any, index: any) => {

                                                let styles = 'md:px-6 md:py-2 md:my-2 ';
                                                if (valueKey === 'id') styles += ' -mb-2 font-semibold';
                                                if (valueKey === 'created') styles += ' text-gray-400 dark:text-gray-500 text-sm md:text-md';
                                                if (valueKey === 'title') styles += ' text-gray-800 dark:text-gray-200 font-medium text-lg md:text-xl';
                                                if (valueKey === 'type') styles += ' text-gray-500 dark:text-gray-400 text-sm md:text-md absolute top-2 right-2 md:relative md:top-0 md:right-0';

                                                let content = '';
                                                if (valueKey === 'id') content += '#';
                                                content += !!item[valueKey] ? item[valueKey] : 'Undefined';

                                                return (
                                                    <td
                                                        onClick={(e) => handleOpenItem(item._id)}
                                                        key={index}
                                                        className={styles}>
                                                        {content}
                                                    </td>
                                                )
                                            })}
                                            <td className="md:px-6 md:py-4 md:text-right flex gap-4 md:justify-end">
                                                <button onClick={(e) => handleOpenItem(item._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                                <button onClick={(e) => handleOpenModal(item._id, item.title)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <div className="flex flex-col gap-4 items-center justify-center p-8">
                        <h2 className="text-gray-500 dark:text-gray-400 text-2xl font-bold">No {viewTitle} Found!</h2>
                        <p>Ready to add your very first item and put Apprentice to work for you?</p>
                        {addItem}
                    </div>
                )}

            </div>
        </>
    )
}