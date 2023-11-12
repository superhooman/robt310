'use client';
import { Avatar, Button, Flex, Heading, Table, Text } from '@radix-ui/themes';
import format from 'date-fns/format';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import type { AccessLog, User } from '@prisma/client';

interface Props {
    items: (AccessLog & { user: User })[];
}

export const Logs: React.FC<Props> = ({ items }) => {
    return (
        <Flex direction="column" gap="4">
            <Flex align="center" justify="between">
                <Flex direction="column" gap="1">
                    <Heading size="5">Access Log</Heading>
                    <Text size="2" color="gray">
                        Last accessed records
                    </Text>
                </Flex>
                <Button asChild>
                    <Link href="/add">
                        <PlusCircledIcon />
                        Add User
                    </Link>
                </Button>
            </Flex>
            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {items.map((item) => (
                        <Table.Row key={item.id} align="center">
                            <Table.RowHeaderCell>
                                <Flex align="center" gap="2" asChild>
                                    <Link href={`/user/${item.user.id}`}>
                                        <Avatar
                                            src={`/api/photo?id=${item.user.id}`}
                                            fallback={item.user.name.charAt(0)}
                                            size="2"
                                            radius="full"
                                        />
                                        <Text size="2" weight="medium">
                                            {item.user.name}
                                        </Text>
                                    </Link>
                                </Flex>
                            </Table.RowHeaderCell>
                            <Table.Cell>
                                <Text color="gray">
                                    {format(
                                        item.createdAt,
                                        'dd.MM.yyyy HH:mm:ss'
                                    )}
                                </Text>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Flex>
    );
};
