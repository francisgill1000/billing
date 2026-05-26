import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex"
                style={{
                    background:
                        'radial-gradient(800px 600px at 30% 20%, rgba(0,255,204,0.15), transparent 55%), ' +
                        '#05070a',
                }}
            >
                <Link
                    href={home()}
                    className="relative z-20 flex items-center text-lg font-medium gap-3"
                >
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-[8px]"
                        style={{
                            background: 'linear-gradient(160deg, #00e6b8, #00b894)',
                            boxShadow: '0 0 0 1px rgba(0,255,204,0.4), 0 6px 20px -4px rgba(0,255,204,0.5)',
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="#03130b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 17L12 22L22 17" />
                            <path d="M2 12L12 17L22 12" />
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                        </svg>
                    </div>
                    <span className="text-[#00d4aa]">{name}</span>
                </Link>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-[9px]"
                            style={{
                                background: 'linear-gradient(160deg, #00e6b8, #00b894)',
                                boxShadow: '0 0 0 1px rgba(0,255,204,0.4), 0 8px 28px -4px rgba(0,255,204,0.55)',
                            }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="#03130b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 17L12 22L22 17" />
                                <path d="M2 12L12 17L22 12" />
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                            </svg>
                        </div>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium text-foreground">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
