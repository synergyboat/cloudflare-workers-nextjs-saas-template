"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentIcon, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSessionStore } from "@/state/session"
import { signOutAction } from "@/actions/sign-out.action"
import { cn } from "@/lib/utils"
import { useNavStore } from "@/state/nav"
import { Skeleton } from "@/components/ui/skeleton"

const ActionButtons = () => {
  const { session, clearSession, isLoading } = useSessionStore()

  if (isLoading) {
    return <Skeleton className="h-10 w-[70px] bg-primary" />
  }

  if (session) {
    return (
      <Button onClick={() => {
        signOutAction().then(() => {
          setTimeout(() => {
            clearSession()
          }, 200)
        })
      }}>Sign out</Button>
    )
  }

  return (
    <Button asChild>
      <Link href="/sign-in">Sign In</Link>
    </Button>
  )
}

export function Navigation() {
  const { session, isLoading } = useSessionStore()
  const { isOpen, setIsOpen } = useNavStore()
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    ...(session ? [{ name: "Settings", href: "/settings" }] : []),
  ]

  const isActiveLink = (itemHref: string) => {
    if (itemHref === "/") {
      return pathname === "/"
    }
    return pathname === itemHref || pathname.startsWith(`${itemHref}/`)
  }

  return (
    <nav className="bg-background shadow dark:shadow-xl z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-3">
              <ComponentIcon className="w-7 h-7" />
              SaaS Template
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            <div className="flex items-baseline space-x-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-10" />
                  <Skeleton className="h-8 w-10" />
                  {/* Show Settings skeleton if we don't know session state yet */}
                  <Skeleton className="h-8 w-14" />
                </>
              ) : (
                navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-muted-foreground hover:text-foreground no-underline px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActiveLink(item.href) && "bg-muted text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))
              )}
            </div>
            <ActionButtons />
          </div>
          <div className="md:hidden flex items-center">
            <ActionButtons />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-3">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="mt-6 flow-root">
                  <div className="space-y-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : (
                      navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 no-underline transition-colors",
                            isActiveLink(item.href) && "bg-muted text-foreground"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

