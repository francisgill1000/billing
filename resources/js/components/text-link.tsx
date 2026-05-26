import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof Link>;

export default function TextLink({
    className = '',
    children,
    ...props
}: Props) {
    return (
        <Link
            className={cn(
                'text-[#00d4aa] underline decoration-[rgba(0,255,204,0.3)] underline-offset-4 transition-colors duration-300 ease-out hover:text-[#00ffcc] hover:decoration-current!',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
