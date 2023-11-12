import { readFileSync } from 'fs';

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // get the photo id from the request
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.next();
    }

    // get photo path from the id
    const path = `${process.env.PHOTO_PATH}/${id}.jpg`;

    // get the photo from the file system
    const photo = readFileSync(path);

    // return the photo
    return new Response(photo, {
        headers: {
            'Content-Type': 'image/jpeg',
        },
    });
};
