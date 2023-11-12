import '@src/styles/reset.css';
import '@radix-ui/themes/styles.css';
import { Container, Theme } from '@radix-ui/themes';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Theme>
                    <Container py="4" px="4" size="2">
                        {children}
                    </Container>
                </Theme>
            </body>
        </html>
    );
}
