import Card from '@/components/UI/Card'
import Link from 'next/link'

async function getData() {

  try {
    const api = process.env.API_URL ? process.env.API_URL : false;
    if (!api) {
      throw new Error('API_URL not found')
    }
    const res = await fetch(`${api}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dataType: 'get',
        data: { _id: false }
      }),
      cache: 'no-store'
    })

    if (!res.ok) {
      console.log(api)
      throw new Error('Failed to fetch sources')
    }

    return await res.json()
  } catch (error) {
    return false;
  }
}


export default async function Home() {

  const threads = await getData();

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
        <Card className=''>

          {!!threads && threads.threads.map((thread: any, index: any) => {
            const created = new Date(thread.created).toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            }).replace(',', ' at');
            return (
              <div key={index} className='flex flex-col gap-2'>
                <span className='text-sm text-gray-700 w-full'>{created}</span>
                <h3 className='text-xl font-semibold text-gray-700 w-full'>{thread._id}</h3>
                <p className='text-gray-700 w-full'>{thread.initial_prompt}</p>
                <Link href={`/generate/${thread._id}`}><button className='bg-secondary py-2 px-4 rounded-lg'>Go to generation</button></Link>
              </div>
            )
          })}
          <button className="flex items-center gap-2 bg-secondary text-dark px-4 py-2">See all generations</button>
        </Card>
      </div>
    </main>
  )
}
