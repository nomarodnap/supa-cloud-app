'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CloudLightning, Loader2, ArrowRight } from 'lucide-react'
import { login, signup } from './actions'
import { toast } from 'sonner'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(formData: FormData) {
    setIsLoading(true)
    const result = await login(formData)
    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
    }
    // On success, redirect happens in server action
  }

  async function handleSignup(formData: FormData) {
    setIsLoading(true)
    const result = await signup(formData)
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Left side - Branding/Hero (hidden on small screens) */}
      <div className="hidden lg:flex flex-col w-1/2 bg-zinc-950 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-zinc-950" />
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[120px]" />
        
        <div className="relative z-10 flex items-center gap-3 text-2xl font-bold tracking-tight">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <CloudLightning className="w-6 h-6 text-white" />
          </div>
          SupaCloud
        </div>
        
        <div className="relative z-10 mt-auto mb-12">
          <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl mb-6 leading-tight">
            Build infinitely scalable applications faster.
          </h1>
          <p className="text-lg text-zinc-400 max-w-md">
            Join thousands of developers building modern architectures with Next.js, Supabase, and Google Cloud.
          </p>
        </div>
        
        <div className="relative z-10 text-sm text-zinc-500 font-medium">
          © 2026 SupaCloud Inc. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900">
        <div className="w-full max-w-md space-y-8">
          
          <div className="flex items-center gap-3 lg:hidden mb-12 text-2xl font-bold tracking-tight justify-center text-zinc-900 dark:text-white">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <CloudLightning className="w-6 h-6 text-white" />
            </div>
            SupaCloud
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-xl">
              <TabsTrigger value="login" className="rounded-lg">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg">Create Account</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <Card className="border-none shadow-xl shadow-zinc-200/50 dark:shadow-black/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="name@example.com" required className="bg-white/50 dark:bg-zinc-900/50" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                          Forgot password?
                        </a>
                      </div>
                      <Input id="password" name="password" type="password" required className="bg-white/50 dark:bg-zinc-900/50" />
                    </div>
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <>Sign In <ArrowRight className="ml-2 w-4 h-4" /></>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <Card className="border-none shadow-xl shadow-zinc-200/50 dark:shadow-black/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                  <CardDescription>
                    Enter your details below to get started for free
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={handleSignup} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input id="register-email" name="email" type="email" placeholder="name@example.com" required className="bg-white/50 dark:bg-zinc-900/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input id="register-password" name="password" type="password" required className="bg-white/50 dark:bg-zinc-900/50" />
                    </div>
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <>Create Account <ArrowRight className="ml-2 w-4 h-4" /></>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
