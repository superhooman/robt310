'use client';
import {
    Button,
    Flex,
    Heading,
    Separator,
    Text,
    TextField,
} from '@radix-ui/themes';
import React from 'react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PhotoInput } from './components/PhotoInput';

export const Add = () => {
    const router = useRouter();
    const [file, setFile] = React.useState<File | null>(null);
    const [name, setName] = React.useState<string>('');

    const handleNameChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
        },
        []
    );

    const handleSubmit = React.useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (!file || !name) return;

            const fd = new FormData();

            fd.append('name', name);
            fd.append('file', file);

            fetch('/api/add', {
                method: 'POST',
                body: fd,
            })
                .then(() => {
                    router.push('/');
                })
                .catch(() => {
                    alert('Something went wrong. Please try again.');
                })
                .finally(() => {
                    setName('');
                    setFile(null);
                });
        },
        [file, name, router]
    );

    return (
        <Flex direction="column" gap="4" asChild>
            <form onSubmit={handleSubmit}>
                <Flex align="center" gap="4">
                    <Button asChild variant="ghost" size="2">
                        <Link href="/">
                            <ChevronLeftIcon />
                        </Link>
                    </Button>
                    <Flex direction="column">
                        <Heading size="5">Add a new person</Heading>
                        <Text size="2" color="gray">
                            Add a new person to the access list.
                        </Text>
                    </Flex>
                </Flex>
                <Separator size="4" />
                <PhotoInput onChange={setFile} value={file} />
                <TextField.Root>
                    <TextField.Input
                        type="text"
                        placeholder="Name"
                        size="3"
                        onChange={handleNameChange}
                        value={name}
                    />
                </TextField.Root>
                <Flex>
                    <Button size="3">Submit</Button>
                </Flex>
            </form>
        </Flex>
    );
};
