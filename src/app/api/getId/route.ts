import { NextResponse } from 'next/server'

export async function GET() {
    // Get user information from Wordpress API
    // For development, we can use the following:
    const data = {
        userId: 1, // userId is used to create MongoDB collection
        name: "Wyatt Development",
        username: "wyattdev",
        email: "w.dev@website.com",
        organization: "Maker Digital"
    }

    return NextResponse.json(data)

}
