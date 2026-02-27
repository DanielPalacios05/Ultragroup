import { Navbar } from '@/components/layout/Navbar';

export default function ViajeroLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="w-full max-w-[1440px]">
                <Navbar />
                <main className="w-full p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
