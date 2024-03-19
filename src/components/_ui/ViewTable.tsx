"use client";
import { useEffect } from "react";

type ViewTableProps = {
    viewTitle: string | "View Table";
    addItem: any;
    deleteItem: any;
    editItem: any;
    data: any | [];
    headerData?: any | [];
}

export default function ViewTable(
    { viewTitle, addItem, deleteItem, editItem, data, headerData }: ViewTableProps
) {

    const [headers, setHeaders] = !!headerData ? headerData : [];
    const [tableData, setTableData] = !!data ? data : [];

    useEffect(() => {

        if (!!data && !headerData) {
            const headerDataSet = [] as any;
            data.map((item: any) => {
                Object.keys(item).forEach((key) => {
                    if (!headerDataSet.includes(key)) {
                        headerDataSet.push(key);
                    }
                })
            })
            setHeaders(headerDataSet);
        }

    }, [])

    useEffect(() => {
        console.log(headers);
    }, [headers])

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

            <div className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 dark:text-white">
                <h1 className="text-2xl font-bold">{viewTitle}</h1>
                <button onClick={(e) => addItem()} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Item</button>
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {/* {!!headers.length && headers.map((header: any) => {
                            return (
                                <th scope="col" className="px-6 py-3">
                                    {header}
                                </th>
                            )
                        })} */}
                    </tr>
                </thead>

                <tbody>
                    {!!tableData.length && tableData.map((item: any) => {
                        return (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                {/* {headers.map((valueKey: any) => {
                                    return (
                                        <td className="px-6 py-4">
                                            {item[valueKey]}
                                        </td>
                                    )
                                })} */}
                                <td className="px-6 py-4 text-right">
                                    <button onClick={(e) => editItem(item._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                    <button onClick={(e) => deleteItem(item._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </div>
    )
}