import { FilePlusIcon, ImageIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Text, VisuallyHidden } from '@radix-ui/themes';
import React from 'react';

interface Props {
  onChange: (file: File) => void;
  value: File | null;
}

export const PhotoInput: React.FC<Props> = ({ onChange, value }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const url = React.useMemo(() => {
        if (!value) {
            return null;
        }
        return URL.createObjectURL(value);
    }, [value]);

    const label = React.useMemo(() => {
        if (value) {
            return value.name;
        }

        return 'Add a photo';
    }, [value]);

    const handleClick = React.useCallback(() => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }, []);

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log('change???');
            if (event.target.files?.length) {
                onChange(event.target.files[0]);
            }
        },
        [onChange]
    );

    return (
        <Flex align="center" justify="between" gap="4" style={{ minWidth: 0 }}>
            <Flex align="center" gap="4" style={{ minWidth: 0 }}>
                <VisuallyHidden>
                    <input
                        type="file"
                        onChange={handleChange}
                        accept="image/jpeg"
                        ref={inputRef}
                    />
                </VisuallyHidden>
                <Flex align="center" shrink="0" justify="center" asChild>
                    <Box
                        height="8"
                        width="8"
                        style={{
                            backgroundImage: url ? `url(${url})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '9999px',
                            boxShadow: '0 0 0 1px var(--gray-a6)',
                        }}
                    >
                        {value ? null : (
                            <ImageIcon color="var(--gray-a11)" height={20} width={20} />
                        )}
                    </Box>
                </Flex>
                <Text color="gray" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</Text>
            </Flex>
            <Button type="button" size="3" variant="soft" onClick={handleClick}>
                <FilePlusIcon />
        Pick
            </Button>
        </Flex>
    );
};
