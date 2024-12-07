'use client';

import { LayoutDashboard, Users, Image, Play, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/authStore';
import { Separator } from '../ui/separator';

const navItems = [
	{ title: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
	{ title: 'User Management', icon: Users, href: '/admin/users' },
	{ title: 'Media Management', icon: Image, href: '/admin/media' },
	{ title: 'Actions', icon: Play, href: '/admin/actions' },
];

export function AdminSidebar() {
	const pathname = usePathname();
	const { logOut } = useAuthStore();
  const router = useRouter()

  const handleLogout = () => {
    logOut();
    router.push('/');
  };

	return (
		<Sidebar>
			<SidebarHeader>
				<h2 className='px-6 text-lg font-semibold'>Admin Panel</h2>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup className='h-full'>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent className='flex flex-col justify-between h-full'>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton asChild isActive={pathname === item.href}>
										<Link href={item.href}>
											<item.icon className='mr-2 h-4 w-4' />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
						<div>
							<Button
								variant='secondary'
								onClick={handleLogout}
								className='text-destructive pl-2.5 w-full justify-start gap-4 hover:bg-destructive hover:text-destructive-foreground'
							>
								<LogOut />
								Logout
							</Button>
							<Separator className='my-4' />
							<div className='h-20 w-full' />
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
