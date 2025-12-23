export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-black pt-32 px-4 md:px-8">
            <div className="container mx-auto">
                {children}
            </div>
        </div>
    );
}
