import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CloudLightning, LockKeyhole, User as UserIcon } from 'lucide-react'

// Prevent caching for this page so it always fetches fresh data
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Check if user is logged in
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    redirect('/login')
  }

  // 2. Fetch secure data from our Hono Backend API
  let backendData = null
  let apiError = null

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const response = await fetch(`${apiUrl}/api/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      // Ensure Next.js doesn't aggressively cache this fetch
      cache: 'no-store'
    })

    if (!response.ok) {
      let errorMsg = response.statusText
      try {
        const errorData = await response.json()
        if (errorData.error) errorMsg = errorData.error
      } catch (e) {}
      throw new Error(`Backend Error (${response.status}): ${errorMsg}`)
    }

    backendData = await response.json()
  } catch (err: any) {
    apiError = err.message
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <CloudLightning className="w-6 h-6 text-white" />
            </div>
            SupaCloud Dashboard
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <UserIcon className="w-4 h-4" />
            {session.user.email}
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Frontend Auth Status */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockKeyhole className="w-5 h-5 text-emerald-500" />
                Frontend Authentication
              </CardTitle>
              <CardDescription>Supabase SSR Session Information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs text-zinc-700 dark:text-zinc-300">
                  {JSON.stringify(
                    {
                      status: 'Authenticated',
                      userId: session.user.id,
                      email: session.user.email,
                      lastSignIn: session.user.last_sign_in_at
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Backend API Response */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudLightning className="w-5 h-5 text-indigo-500" />
                Backend API Response
              </CardTitle>
              <CardDescription>Data securely fetched from Hono (/api/me)</CardDescription>
            </CardHeader>
            <CardContent>
              {apiError ? (
                <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm font-medium">
                  Failed to fetch from backend: {apiError}
                  <div className="mt-2 text-xs opacity-75">
                    Make sure the Hono backend is running on {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}
                  </div>
                </div>
              ) : backendData ? (
                <div className="bg-zinc-950 p-4 rounded-lg overflow-x-auto border border-zinc-800">
                  <pre className="text-xs text-emerald-400">
                    {JSON.stringify(backendData, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
