import ThreadsList from '@/components/ThreadsList'
import Card from '@/components/UI/Card'
import Link from 'next/link'
import { getMongoDB } from "@/components/utils/getMongo";



export default async function Home() {

  async function getThreads() {
    try {
      const db = await getMongoDB() as any;
      const threads = await db.collection("threads").find({}).sort({ created: -1 }).toArray();
      const cleanThreads = threads.map(({ _id, ...rest }: any) => ({ _id: _id.toString(), ...rest }));
      return cleanThreads;
    } catch (error: any) {
      console.error('Error in GET:', error.message);
    }
  }
  const threads = await getThreads();



  return (
    <main className="flex gap-4 min-h-screen flex-col items-start max-w-[90%] mx-auto">
      <div className=''>
        <h1 className='text-4xl font-bold text-gray-700 w-full'>Say Hello to apprentice</h1>
        <Link href="/generate" className="">{">"} Get started</Link>
      </div>

      <ul className="flex flex-wrap gap-2 ">
        <li>
          <Link
            href="/generate"
            className={`w-full flex-grow `}>
            <Card className='w-full !bg-secondary'>
              <h2 className='text-xl font-semibold text-gray-700 w-full'>Generate content</h2>
            </Card>
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
            className={`w-full flex-grow `}>
            <Card className='w-full !bg-secondary'>
              <h2 className='text-xl font-semibold text-gray-700 w-full'>Formulas</h2>
            </Card></Link>
        </li>
        <li>
          <Link
            href="/tone-library"
            className={`w-full flex-grow `}>
            <Card className='w-full !bg-secondary'>
              <h2 className='text-xl font-semibold text-gray-700 w-full'>Tones</h2>
            </Card></Link>
        </li>
        <li>
          <Link
            href="/source-library"
            className={`w-full flex-grow `}>
            <Card className='w-full !bg-secondary'>
              <h2 className='text-xl font-semibold text-gray-700 w-full'>Sources</h2>
            </Card></Link>
        </li>
        {/* <li>
                    <Link
                        href="/layout-Library"
                        className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}>Layouts</Link>
                </li> */}
      </ul>

      <div className='w-full flex flex-col gap-4'>
        <h2 className='text-2xl font-bold text-gray-700 w-full'>Your recent generations</h2>

        <div
          className={'bg-gray-700 text-white p-6 rounded-lg max-h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 z-50'}
        >
          <ThreadsList threads={threads} />
        </div>
      </div>
    </main>
  )
}
