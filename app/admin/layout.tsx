import { AdminSidebar } from '@/components/admin/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<div className='flex w-full h-screen'>
				<AdminSidebar />
				<main className='flex-1 overflow-y-auto p-6'>
					<SidebarTrigger />
					{children}
				</main>
			</div>
		</SidebarProvider>
	);
}
