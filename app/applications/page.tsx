"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link" // Added Link import for navigation
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function MyApplications() {
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Function to handle CoCounsel activation with URL tracking
  const handleCocounselActivation = () => {
    // Add #cocounsel to the URL - use relative path from basePath
    const currentPath = window.location.pathname.replace('/OS3-Synergy-default-dashboard', '') || '/'
    const search = window.location.search
    router.push(currentPath + search + '#cocounsel', { scroll: false })
  }

  const applications = [
    { name: "Administration", description: "System administration" },
    { name: "Alteryx", description: "Data analytics platform" },
    { name: "API Administration", description: "API management" },
    { name: "CHECKPOINT", description: "Research platform" },
    { name: "Checkpoint World", description: "Global research" },
    { name: "Data Hub", description: "Centralized data" },
    { name: "Data Query", description: "Query builder" },
    { name: "DataFlow", description: "Data processing" },
    { name: "DataFlow Classic", description: "Legacy data flow" },
    { name: "Entity Manager Classic", description: "Entity management" },
    { name: "Estimated Payments", description: "Payment estimates" },
    { name: "FileRoom", description: "Document management" },
    { name: "General Ledger Manager Classic", description: "GL management" },
    { name: "Income Tax", description: "Income tax processing" },
    { name: "Indirect Tax", description: "Indirect tax management" },
    { name: "Mapping", description: "Data mapping tools" },
    { name: "My Work", description: "Personal workspace" },
    { name: "Notification Rules", description: "Alert management" },
    { name: "Global Access", description: "Global system access" },
    { name: "Tax Provision Administration", description: "Tax provision admin" },
    { name: "State Apportionment", description: "State tax allocation" },
    { name: "Statutory Reporting", description: "Compliance reporting" },
    { name: "Tax Provision", description: "Tax provisioning" },
    { name: "Uncertain Tax Positions", description: "UTP management" },
    { name: "University - Training & Certifications", description: "Learning platform" },
    { name: "WorkFlow Manager", description: "Workflow management" },
    { name: "Workpapers", description: "Working papers" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#123021] text-white px-8 py-2 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            <Image
              src="../icons/thomson-reuters-official-logo.svg"
              alt="Thomson Reuters Logo"
              width={194}
              height={26}
              className="object-contain"
            />
            <span className="font-bold text-lg tracking-tight">ONESOURCE</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative group w-10 h-10 flex items-center justify-center">
            <Image src="../icons/search-icon.svg" alt="Search" width={16} height={16} className="cursor-pointer" />
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Search
            </span>
          </div>
          <div className="h-6 w-px bg-white/30 mx-1"></div>
          <div className="relative group w-10 h-10 flex items-center justify-center">
            <Image
              src="../icons/cocounsel-header-icon.svg"
              alt="coCounsel"
              width={16}
              height={16}
              className="cursor-pointer"
              onClick={handleCocounselActivation}
            />
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              CoCounsel
            </span>
          </div>
          <div className="relative group w-10 h-10 flex items-center justify-center">
            <Image
              src="../icons/notification-icon.svg"
              alt="Notifications"
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Notifications
            </span>
          </div>
          <div className="relative group w-10 h-10 flex items-center justify-center">
            <Image src="../icons/user-profile-icon.svg" alt="Profile" width={16} height={16} className="cursor-pointer" />
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Account
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarCollapsed ? "w-16" : "w-60"} bg-gray-100 border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out`}
        >
          <div className="p-3">
            <Button
              variant="ghost"
              size="sm"
              className="mb-3 p-0 h-auto hover:bg-gray-200 ml-auto block"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Image src="../icons/back-arrow-icon.png" alt="Toggle Sidebar" width={20} height={20} />
            </Button>

            <nav className="space-y-1">
              <Link href="/" className="block">
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] hover:text-[#1D4B34] rounded-md cursor-pointer transition-all duration-200">
                  <Image src="../icons/dashboard-grid-icon.png" alt="Dashboard" width={20} height={20} />
                  {!sidebarCollapsed && (
                    <>
                      <span>Dashboard</span>
                      <Image
                        src="../icons/chevron-right-icon.png"
                        alt="Expand"
                        width={16}
                        height={16}
                        className="ml-auto"
                      />
                    </>
                  )}
                </div>
              </Link>

              <div className="flex items-center gap-3 px-3 py-2 bg-[#EDF2F0] border-2 border-[#1D4B34] rounded-md shadow-sm">
                <Image src="../icons/menu-grid-icon.png" alt="Applications" width={20} height={20} />
                {!sidebarCollapsed && <span className="font-medium text-gray-900">My applications</span>}
              </div>

              <Link href="/system-status" className="block">
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] hover:text-[#1D4B34] rounded-md cursor-pointer transition-all duration-200">
                  <Image src="../icons/warning-triangle-icon.png" alt="System Status" width={20} height={20} />
                  {!sidebarCollapsed && (
                    <>
                      <span>System status</span>
                      <Image
                        src="../icons/chevron-right-icon.png"
                        alt="Expand"
                        width={16}
                        height={16}
                        className="ml-auto"
                      />
                    </>
                  )}
                </div>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">My applications</h1>

          <div className="grid grid-cols-4 gap-6">
            {applications.map((app, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer bg-white"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 hover:text-[#1D4B34] text-base mb-2 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-sm text-gray-600 hover:text-[#1D4B34] transition-colors">{app.description}</p>
                    </div>
                    <Image
                      src="../icons/external-link-icon.png"
                      alt="External link"
                      width={20}
                      height={20}
                      className="text-gray-400 flex-shrink-0 ml-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
