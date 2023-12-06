import ThreadsList from '@/components/ThreadsList'
import Card from '@/components/UI/Card'
import Link from 'next/link'
import { getMongoDB } from "@/components/utils/getMongo";
import { GeneratorArrowIcon } from '@/components/icons';



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
    <main className="w-[90%] mx-auto flex flex-col gap-4 h-full flex-grow">
      <section className="flex-grow flex flex-col gap-8 inset-0 bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:13px_13px] py-[5%] px-[2.5%]">

        <div className='w-full'>
          <h1 className='text-4xl font-bold text-gray-700 w-full'>Say Hello to Apprentice</h1>
          <p className='text-gray-500'>Your newest team member. Generate effective marketing in 15 minutes or less.</p>
        </div>

        <div className="w-full">
          {/* Geerator card */}
          <Card className='!bg-neutral-50 col-span-full flex flex-col gap-2'>
            <h2 className='text-xl text-gray-700 m-0'>Generate content</h2>
            <p className='text-gray-500 mb-2'>Generate content for your social media, blog, or website.</p>
            <Link
              href="/generate"
              className={`mt-auto no-underline bg-transparent border border-gray-700 text-gray-500 flex justify-center items-center gap-2 rounded-md max-w-max py-1 px-1`}>
              <span className="px-3 text-lg ">Go to generator</span>
              <span className='bg-gray-700 text-white p-2 h-full rounded-md aspect-square flex justify-center items-center'><GeneratorArrowIcon className="w-4 h-4 block" /></span>
            </Link>
          </Card>
        </div>

        {/* Library cards */}
        <div className='grid grid-cols-6 auto-rows-max gap-2'>
          <div className='col-span-full'>
            <div className='prose'>
              <h2 className='text-2xl font-bold text-gray-500 m-0'>Libraries</h2>
              <p className="">Give Apprentice superpowers! Teach him to use a specific tone of voice, learn specific information about your industry, and create content by following exact formulas</p>
            </div>
          </div>

          <Card className='!bg-neutral-50 flex flex-col gap-2 col-span-full md:col-span-3 xl:col-span-2'>
            <h3 className='text-xl text-gray-700 m-0'>Formula Library</h3>
            <p className='text-gray-500 mb-2'>Create formulas to generate content with your own patterns.</p>
            <Link
              href="/formula-library"
              className={`mt-auto no-underline bg-transparent border border-gray-700 rounded-md max-w-max text-gray-500 py-1 px-4 text-lg`}>
              Go to formula library
            </Link>
          </Card>
          <Card className='!bg-neutral-50 flex flex-col gap-2 col-span-full md:col-span-3 xl:col-span-2'>
            <h3 className='text-xl text-gray-700 m-0'>Tone Library</h3>
            <p className='text-gray-500 mb-2'>Create your own styles and tone of voice.</p>
            <Link
              href="/tone-library"
              className={`mt-auto no-underline bg-transparent border border-gray-700 rounded-md max-w-max text-gray-500 py-1 px-4 text-lg`}>
              Go to tone library
            </Link>
          </Card>
          <Card className='!bg-neutral-50 flex flex-col gap-2 col-span-full md:col-span-3 xl:col-span-2'>
            <h3 className='text-xl text-gray-700 m-0'>Source Library</h3>
            <p className='text-gray-500 mb-2'>Give Apprentice source material to use while generating content.</p>
            <Link
              href="/source-library"
              className={`mt-auto no-underline bg-transparent border border-gray-700 rounded-md max-w-max text-gray-500 py-1 px-4 text-lg`}>
              Go to source library
            </Link>
          </Card>
        </div>

        {/* Coming soon cards */}
        <div className='grid grid-cols-6 auto-rows-max grid-flow-dense gap-2'>

          <div className='w-full col-span-full prose'>
            <h2 className='text-2xl font-bold text-gray-500 m-0'>In the works</h2>
            <p className="">We're working on some cool features to make Apprentice even more powerful. Stay tuned!</p>
          </div>

          <Card className="!bg-neutral-50 flex flex-col gap-2 col-span-full md:col-span-3">
            <h3 className='text-xl text-gray-700 m-0'>Layout Library</h3>
            <p className='text-gray-500 mb-2'>Create complex content patterns for Apprentice to follow.</p>
            <span className="mt-auto bg-gray-700 text-white p-2 w-full rounded-md flex justify-center items-center">Coming soon</span>
            {/* <Link
              href="/layout-library"
              className={`no-underline bg-transparent border border-gray-700 rounded-md max-w-max text-gray-500 py-1 px-4 text-lg`}>
                Go to layout library
            </Link> */}
          </Card>

          <Card className='!bg-neutral-50 flex flex-col gap-2 col-span-full md:col-span-3'>
            {/* Create a commin soon tag */}
            <h3 className='text-xl text-gray-700 m-0'>Campaigns</h3>
            <p className='mb-2 text-gray-500'>Create campaign templates that enable you to generate all of the marketing material you need for an entire month in a single command.</p>
            <span className="mt-auto bg-gray-700 text-white p-2 w-full rounded-md flex justify-center items-center">Coming soon</span>
            {/* <Link
              href="/campaigns"
              className={`no-underline bg-transparent border border-gray-700 rounded-md max-w-max text-gray-500 py-1 px-4 text-lg`}>
                Go to campaigns
            </Link> */}
          </Card>

          {/* 
          <div>
              <Link
                  href="/campaigns"
                  className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}>Campaigns</Link>
          </div> 
            <div>
              <Link
                href="/layout-Library"
                className={`w-full flex gap-2 font-bold py-2 px-4 rounded-md hover:text-highlight`}
              >
                Layouts
              </Link>
            </div> 
          */}
        </div>

        <div className='w-full flex flex-col gap-4'>
          <h2 className='text-2xl font-bold text-gray-700 w-full'>Your recent generations</h2>
          <div
            className={'bg-gray-700 text-white p-6 rounded-lg max-h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 z-50'}
          >
            <ThreadsList threads={threads} />
          </div>
        </div>

      </section>
    </main>
  )
}
