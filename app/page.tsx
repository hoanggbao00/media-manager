import { LoginForm } from '@/components/auth/LoginForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Media Management System</h1>
        <LoginForm />
      </div>
    </div>
  )
}