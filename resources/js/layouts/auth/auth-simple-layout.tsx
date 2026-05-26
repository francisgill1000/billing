import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div
            className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
            style={{
                background:
                    'radial-gradient(1400px 800px at 75% -10%, rgba(0,255,204,0.12), transparent 55%), ' +
                    'radial-gradient(1000px 700px at -10% 110%, rgba(0,255,204,0.08), transparent 55%), ' +
                    'radial-gradient(600px 400px at 50% 50%, rgba(0,255,204,0.025), transparent 70%), ' +
                    '#0a0e0c',
            }}
        >
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div
                                className="mb-1 flex h-9 w-9 items-center justify-center rounded-[9px]"
                                style={{
                                    background: 'linear-gradient(160deg, #00e6b8, #00b894)',
                                    boxShadow: '0 0 0 1px rgba(0,255,204,0.4), 0 8px 28px -4px rgba(0,255,204,0.55), inset 0 1px 0 rgba(255,255,255,0.3)',
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="#03130b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                </svg>
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-foreground">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
