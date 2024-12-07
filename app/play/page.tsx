'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import MediaList from '@/components/play/MediaList'

export default function DashboardPage() {
  const { user, isAdmin } = useAuthStore()

  useEffect(() => {
    if (!user || isAdmin) {
      redirect('/')
    }
  }, [user, isAdmin])

  if (!user || isAdmin) return null

  return <MediaList />
}