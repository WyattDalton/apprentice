import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ul className="flex flex-col gap-2 p-2 pb-4 mb-4 border-b border-gray-200">
        <li>
          <Link
            href="/generate"
            className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}>
            Generator
          </Link>
        </li>
        {/* <li>
                    <Link
                        href="/campaigns"
                        className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}>Campaigns</Link>
                </li> */}
        <li>
          <Link
            href="/formula-library"
            className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}>Formulas</Link>
        </li>
        <li>
          <Link
            href="/tone-library"
            className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}>Tones</Link>
        </li>
        <li>
          <Link
            href="/source-library"
            className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}>Sources</Link>
        </li>
        {/* <li>
                    <Link
                        href="/layout-Library"
                        className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}>Layouts</Link>
                </li> */}
      </ul>
    </main>
  )
}
