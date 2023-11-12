'use client';
import {
    Avatar,
    Button,
    Flex,
    Heading,
    Separator,
    Table,
    Text,
} from '@radix-ui/themes';
import format from 'date-fns/format';
import Link from 'next/link';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import React from 'react';

import type { AccessLog, User } from '@prisma/client';

interface Props {
    user: User;
    items: AccessLog[];
}

export const UserPage: React.FC<Props> = ({ user, items }) => {
    const handleRemove = React.useCallback(() => {
        const confirm = window.confirm('Are you sure?');

        if (!confirm) return;

        const fd = new FormData();

        fd.append('id', user.id.toString());

        fetch('/api/remove', {
            method: 'POST',
            body: fd,
        })
            .then(() => {
                window.location.href = '/';
            })
            .catch(() => {
                alert('Something went wrong. Please try again.');
            });
    }, [user.id]);

    return (
        <Flex direction="column" gap="4">
            <Flex align="center" gap="4">
                <Button asChild variant="ghost" size="2">
                    <Link href="/">
                        <ChevronLeftIcon />
                    </Link>
                </Button>
                <Flex direction="column">
                    <Heading size="5">User</Heading>
                    <Text size="2" color="gray">
                        More information about user
                    </Text>
                </Flex>
            </Flex>
            <Separator size="4" />
            <Flex align="center" gap="4">
                <Avatar
                    src={`/api/photo?id=${user.id}`}
                    fallback={user.name.charAt(0)}
                    size="5"
                    radius="full"
                />
                <Flex direction="column">
                    <Heading size="5">{user.name}</Heading>
                    <Text size="2" color="gray">
                        Added: {format(user.createdAt, 'dd.MM.yyyy HH:mm:ss')}
                    </Text>
                </Flex>
            </Flex>
            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {items.map((item) => (
                        <Table.Row key={item.id} align="center">
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
            <Flex>
                <Button onClick={handleRemove} color="red">
                    Remove user
                </Button>
            </Flex>
        </Flex>
    );
};
