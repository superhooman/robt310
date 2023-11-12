import { writeFileSync } from 'fs';

import { NextResponse } from 'next/server';

import { prisma } from '@src/server/db';
import { getFile } from '@src/server/utils/getFile';

const FILE_FIELDNAME = 'file';

export async function POST(request: Request) {
    if (!request.body) {
        return NextResponse.json({
            message: 'No body',
        }, {
            status: 400,
        });
    }

    const [file, formData] = await getFile(request, FILE_FIELDNAME);

    const buffer = Buffer.from(await file.arrayBuffer());

    const name = formData.get('name');

    if (!name) {
        return NextResponse.json({
            message: 'No name',
        }, {
            status: 400,
        });
    }

    const { id } = await prisma.user.create({
        data: {
            name: name.toString(),
        }
    });

    const path = `${process.env.PHOTO_PATH}/${id}.jpg`;

    writeFileSync(path, buffer);

    return NextResponse.json({
        message: 'OK',
    }, {
        status: 200,
    });
};
