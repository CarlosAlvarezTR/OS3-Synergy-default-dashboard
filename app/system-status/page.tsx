"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function SystemStatus() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState("All applications");
  const [applicationDropdownOpen, setApplicationDropdownOpen] = useState(false);

  const applications = [
    "All applications",
    "Dashboard",
    "My applications",
    "My tasks",
    "Help and Support",
    "Recent activity",
    "System Status",
    "Workflow manager",
  ];

  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
    }

    if (accountDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountDropdownOpen]);

  const systemCategories = [
    {
      name: "Core Platform",
      components: [
        { name: "Platform", status: "operational" },
        { name: "WorkFlow Tools", status: "operational" },
        { name: "Data Tools", status: "operational" },
      ],
    },
    {
      name: "Tax Solutions",
      components: [
        { name: "Direct Tax", status: "operational" },
        { name: "Indirect Tax", status: "operational" },
        { name: "Tax Brazil", status: "operational" },
        { name: "Tax Brazil - Tax One", status: "operational" },
      ],
    },
    {
      name: "Business Solutions",
      components: [
        { name: "Global Trade", status: "operational" },
        { name: "Legal Solutions", status: "operational" },
        { name: "Risk Solutions", status: "operational" },
        { name: "Trust & Info Rptg", status: "operational" },
      ],
    },
    {
      name: "Support & Integration",
      components: [
        { name: "IDT Integrations", status: "operational", hasTooltip: true },
        { name: "Customer Support", status: "operational" },
      ],
    },
  ];

  const maintenanceItems = [
    {
      title:
        "ONESOURCE Determination – Configuration API Version 2025.5 Production Release Information (EMEA Region)",
      description:
        "ONESOURCE Determination – Configuration API Version 2025.5 is being deployed in the EMEA Production environment. No downtime is expected during this deployment window.",
      scheduledFor: "Sep 16, 2025 05:00-08:00 CDT",
      postedOn: "Sep 03, 2025 • 10:47 CDT",
    },
    {
      title:
        "ONESOURCE Determination Enterprise Cloud– Version 2025.05 Release Information (PROD EMEA environment)",
      scheduledFor: "Sep 16, 2025 08:00-12:00 CDT",
    },
  ];

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "operational":
        return <div className="w-4 h-4 text-[rgba(28,75,52,1)]">✓</div>;
      case "degraded":
        return <div className="w-4 h-4 text-yellow-500">⚠</div>;
      case "partial":
        return <div className="w-4 h-4 text-orange-500">▲</div>;
      case "major":
        return <div className="w-4 h-4 text-red-500">✕</div>;
      case "maintenance":
        return <div className="w-4 h-4 text-blue-500">🔧</div>;
      default:
        return <div className="w-4 h-4 text-green-500">✓</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#123021] text-white px-6 py-2 flex items-center justify-between h-14">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/thomson-reuters-official-logo.png"
              alt="Thomson Reuters Logo"
              width={140}
              height={36}
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Image
            src="/icons/search-icon.png"
            alt="Search"
            width={24}
            height={24}
            className="cursor-pointer w-3.5"
          />
          <Image
            src="/icons/cocounsel-header-icon.png"
            alt="coCounsel"
            width={24}
            height={24}
            className="cursor-pointer w-3.5"
          />
          <Image
            src="/icons/notification-icon.png"
            alt="Notifications"
            width={24}
            height={24}
            className="cursor-pointer w-3.5"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          />
          <Image
            src="/icons/user-profile-icon.png"
            alt="Profile"
            width={24}
            height={24}
            className="cursor-pointer w-3.5"
            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
          />
        </div>
      </header>

      <div className="flex relative">
        <aside
          className={`${
            sidebarCollapsed ? "w-16" : "w-60"
          } bg-gray-100 border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out`}
        >
          <div className="p-3">
            <Button
              variant="ghost"
              size="sm"
              className="mb-3 p-0 h-auto hover:bg-gray-200 ml-auto block"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Image
                src="/icons/back-arrow-icon.png"
                alt="Toggle Sidebar"
                width={20}
                height={20}
              />
            </Button>

            <nav className="space-y-1">
              <Link href="/" className="block">
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] hover:text-[#1D4B34] rounded-md cursor-pointer transition-all duration-200">
                  <Image
                    src="/icons/dashboard-grid-icon.png"
                    alt="Dashboard"
                    width={20}
                    height={20}
                  />
                  {!sidebarCollapsed && <span>Dashboard</span>}
                </div>
              </Link>
              <Link href="/applications" className="block">
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] hover:text-[#1D4B34] rounded-md cursor-pointer transition-all duration-200">
                  <Image
                    src="/icons/menu-grid-icon.png"
                    alt="Applications"
                    width={20}
                    height={20}
                    className="hover:filter hover:brightness-0 hover:saturate-100 hover:hue-rotate-90"
                  />
                  {!sidebarCollapsed && (
                    <>
                      <span>My applications</span>
                      <Image
                        src="/icons/chevron-right-icon.png"
                        alt="Expand"
                        width={16}
                        height={16}
                        className="ml-auto"
                      />
                    </>
                  )}
                </div>
              </Link>
              <div className="flex items-center gap-3 px-3 py-2 bg-white border-2 border-orange-500 rounded-md shadow-sm">
                <Image
                  src="/icons/warning-triangle-icon.png"
                  alt="System Status"
                  width={20}
                  height={20}
                />
                {!sidebarCollapsed && (
                  <span className="font-medium text-gray-900">
                    System Status
                  </span>
                )}
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              System Status
            </h1>
            <Button
              className="bg-[#123021] hover:bg-[#EDF2F0] hover:border-[#1D4B34] hover:border-2 hover:text-[#1D4B34] border border-[#123021] shadow-sm rounded text-white flex items-center justify-center gap-2 cursor-pointer h-10 w-56 transition-all"
              style={{
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)",
              }}
            >
              SUBSCRIBE TO UPDATES
            </Button>
          </div>

          {/* Overall Status Banner */}
          <div className="text-white text-center py-6 rounded-lg mb-8 bg-[#123021]">
            <h2 className="text-2xl font-semibold">All Systems Operational</h2>
          </div>

          {/* System Components Accordion */}
          <div className="mb-12">
            <Accordion type="multiple" className="space-y-2">
              {systemCategories.map((category, categoryIndex) => (
                <AccordionItem
                  key={categoryIndex}
                  value={`category-${categoryIndex}`}
                  className="border border-gray-200 rounded-lg"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-gray-400">
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({category.components.length} services)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status="operational" />
                        <span className="text-sm font-medium text-[rgba(28,75,52,1)]">
                          All Operational
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {category.components.map((component, componentIndex) => (
                        <div
                          key={componentIndex}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 text-gray-400">
                              <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {component.name}
                            </span>
                            {component.hasTooltip && (
                              <span className="text-gray-400 text-sm">?</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusIcon status={component.status} />
                            <span className="text-xs text-green-600 capitalize">
                              {component.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-[rgba(28,75,52,1)]">✓</div>
              <span>Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-yellow-500">⚠</div>
              <span>Degraded Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-orange-500">▲</div>
              <span>Partial Outage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-red-500">✕</div>
              <span>Major Outage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-blue-500">🔧</div>
              <span>Maintenance</span>
            </div>
          </div>

          {/* Scheduled Maintenance Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Scheduled Maintenance
            </h3>

            <div className="space-y-6">
              {maintenanceItems.map((item, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-900 text-lg pr-4">
                        {item.title}
                      </h4>
                      <div className="text-right">
                        <div className="font-medium text-sm text-orange-700">
                          Scheduled for {item.scheduledFor}
                        </div>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {item.postedOn && (
                      <p className="text-gray-500 text-sm">
                        Posted on {item.postedOn}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* See more button at bottom of page */}
          <div className="flex justify-center mb-8">
            <Button
              variant="outline"
              className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 bg-transparent"
            >
              See more
            </Button>
          </div>
        </main>

        {notificationsOpen && (
          <div className="fixed top-0 right-0 w-80 h-full bg-white border-l border-gray-300 shadow-xl z-50 overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Platform Header
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 hover:bg-gray-100"
                onClick={() => setNotificationsOpen(false)}
              >
                <span className="text-gray-500 text-lg">×</span>
              </Button>
            </div>

            {/* Application Dropdown */}
            <div className="px-4 pb-2 flex-shrink-0">
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full justify-between text-left bg-white border-gray-300 hover:bg-gray-50 h-9"
                  onClick={() =>
                    setApplicationDropdownOpen(!applicationDropdownOpen)
                  }
                >
                  <span className="text-sm text-gray-700">
                    {selectedApplication}
                  </span>
                  <span
                    className={`text-gray-400 transition-transform ${
                      applicationDropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </Button>

                {applicationDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    {applications.map((app) => (
                      <button
                        key={app}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        onClick={() => {
                          setSelectedApplication(app);
                          setApplicationDropdownOpen(false);
                        }}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between p-4 pb-2 flex-shrink-0">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  style={{ backgroundColor: "#054688" }}
                  className="hover:bg-blue-700 text-white px-3 py-1 text-xs"
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 py-1 text-xs bg-transparent"
                >
                  Unread
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <span className="text-gray-400">⚙</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <span className="text-gray-400">⋮</span>
                </Button>
              </div>
            </div>

            {/* Notifications Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="text-center py-8 text-gray-500">
                No notifications
              </div>
            </div>
          </div>
        )}

        {accountDropdownOpen && (
          <div
            ref={accountDropdownRef}
            className="fixed top-14 right-6 w-72 bg-white border border-gray-300 rounded-lg shadow-xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Account settings
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 hover:bg-gray-100"
                onClick={() => setAccountDropdownOpen(false)}
              >
                <span className="text-gray-500 text-lg">×</span>
              </Button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1">
                Jessica Smith
              </h3>
              <p className="text-sm text-gray-600">
                jessica.smith@thomsonreuters.com
              </p>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-3">
              <a
                href="#"
                className="block text-sm hover:underline"
                style={{ color: "#054688" }}
              >
                Account information
              </a>
              <a
                href="#"
                className="block text-sm hover:underline"
                style={{ color: "#054688" }}
              >
                Community
              </a>
              <a
                href="#"
                className="block text-sm hover:underline"
                style={{ color: "#054688" }}
              >
                Training and support
              </a>
              <a
                href="#"
                className="block text-sm hover:underline"
                style={{ color: "#054688" }}
              >
                Manage subscriptions
              </a>
            </div>

            {/* Sign Out Button */}
            <div className="p-4 pt-2">
              <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center gap-2 h-9">
                <span className="text-white">↗</span>
                Sign out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
