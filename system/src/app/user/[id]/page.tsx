import { notFound } from 'next/navigation';

import { UserPage } from '@src/features/User';
import { prisma } from '@src/server/db';

interface Props {
    params: {
        id: string;
    };
}

export default async function Page({ params }: Props) {
    const id = parseInt(params.id, 10);

    if (Number.isNaN(id)) {
        return notFound();
    }

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        return notFound();
    }

    const log = await prisma.accessLog.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        where: {
            userId: id,
        },
        take: 20,
    });

    return <UserPage user={user} items={log} />;
}
