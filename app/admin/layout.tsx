import { AdminSidebar } from '@/components/admin/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<div className='flex w-full h-screen'>
				<AdminSidebar />
				<main className='flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
		</SidebarProvider>
	);
}
