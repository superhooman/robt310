import { Logs } from '@src/features/Logs';
import { prisma } from '@src/server/db';

export default async function Page() {
    const log = await prisma.accessLog.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: true,
        },
        take: 20,
    });

    return <Logs items={log} />;
}
