import { unlinkSync } from 'fs';

import { NextResponse } from 'next/server';

import { prisma } from '@src/server/db';

export async function POST(request: Request) {
    if (!request.body) {
        return NextResponse.json({
            message: 'No body',
        }, {
            status: 400,
        });
    }

    const formData = await request.formData();

    const id = formData.get('id')?.toString();

    if (!id || Number.isNaN(Number(id))) {
        return NextResponse.json({
            message: 'No id',
        }, {
            status: 400,
        });
    }

    await prisma.accessLog.deleteMany({
        where: {
            userId: Number(id),
        },
    });

    await prisma.user.delete({
        where: {
            id: Number(id),
        },
    });

    const path = `${process.env.PHOTO_PATH}/${id}.jpg`;

    unlinkSync(path);

    return NextResponse.json({
        message: 'OK',
    }, {
        status: 200,
    });
};
