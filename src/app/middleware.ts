import { NextResponse, } from "next/server"

export async function Middleware(req: any) {
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-url', req.nextUrl.url)

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    })
}