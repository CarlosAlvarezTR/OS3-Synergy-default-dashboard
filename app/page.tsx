"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import {
  Star,
  EyeOff,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  LayoutGrid,
  ChevronUp,
  Plus,
  ArrowRight,
  Settings,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { SparkleIcon } from "@/components/ui/sparkle-icon";

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cocounselOpen, setCocounselOpen] = useState(false);
  const [cocounselMinimized, setCocounselMinimized] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false); // Add state for Account Settings modal
  const [selectedApplication, setSelectedApplication] =
    useState("All applications");
  const [applicationDropdownOpen, setApplicationDropdownOpen] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<{
    targetId: string;
    position: "before" | "after";
  } | null>(null);
  const [widgetOrder, setWidgetOrder] = useState([
    "applications",
    "tasks",
    "system-monitoring",
    "user-management",
    "help",
    "activity",
  ]);
  const [widgetSizes, setWidgetSizes] = useState<
    Record<string, "half" | "full">
  >({
    applications: "full",
    tasks: "full",
    "system-monitoring": "half",
    "user-management": "half",
    help: "half",
    activity: "half",
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragTooltipPosition, setDragTooltipPosition] = useState({
    x: 0,
    y: 0,
  });

  const [applicationsMenuOpen, setApplicationsMenuOpen] = useState(false);
  const [favoritesModalOpen, setFavoritesModalOpen] = useState(false);
  const [hideModalOpen, setHideModalOpen] = useState(false);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [customizeViewModalOpen, setCustomizeViewModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [uploadNotifications, setUploadNotifications] = useState<
    Array<{
      id: string;
      fileName: string;
      status: "uploading" | "complete" | "error";
      progress: number;
    }>
  >([]);
  const [uploadWindowMinimized, setUploadWindowMinimized] = useState(false);
  const [uploadWindowVisible, setUploadWindowVisible] = useState(false);

  const [dragOver, setDragOver] = useState(false);

  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({
    applications: true,
    tasks: true,
    "system-monitoring": false,
    "user-management": false,
    help: true,
    activity: true,
  });
  const [tempVisibleCards, setTempVisibleCards] = useState<
    Record<string, boolean>
  >({
    applications: true,
    tasks: true,
    "system-monitoring": false,
    "user-management": false,
    help: true,
    activity: true,
  });

  const [favoriteApps, setFavoriteApps] = useState<string[]>([]);
  const [hiddenApps, setHiddenApps] = useState<string[]>([]);
  const [appOrder, setAppOrder] = useState<string[]>([]);
  const [tempFavorites, setTempFavorites] = useState<string[]>([]);
  const [tempHidden, setTempHidden] = useState<string[]>([]);
  const [tempOrder, setTempOrder] = useState<string[]>([]);

  const [applicationsScrollPosition, setApplicationsScrollPosition] =
    useState(0);
  const applicationsScrollRef = useRef<HTMLDivElement>(null);

  const [systemStats] = useState({
    activeUsers: 1247,
    uptime: "99.9%",
    ssoEnabled: true,
    mfaEnabled: true,
    lastUpdate: "2 minutes ago",
  });

  const [users] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2 hours ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@company.com",
      role: "User",
      status: "Active",
      lastLogin: "1 day ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "e.rodriguez@company.com",
      role: "Tech Lead",
      status: "Inactive",
      lastLogin: "3 days ago",
    },
    {
      id: 4,
      name: "David Kim",
      email: "d.kim@company.com",
      role: "User",
      status: "Active",
      lastLogin: "5 minutes ago",
    },
  ]);

  const scrollApplications = (direction: "left" | "right") => {
    const container = applicationsScrollRef.current;
    if (!container) return;

    const scrollAmount = 280; // Width of one card plus gap
    const newPosition =
      direction === "left"
        ? Math.max(0, applicationsScrollPosition - scrollAmount)
        : applicationsScrollPosition + scrollAmount;

    container.scrollTo({ left: newPosition, behavior: "smooth" });
    setApplicationsScrollPosition(newPosition);
  };

  const getApplicationsSlideInfo = () => {
    const displayedApps = getDisplayedApplications();
    const cardWidth = widgetSizes.applications === "half" ? 192 : 256; // w-48 = 192px, w-64 = 256px
    const gap = 8; // gap-2 = 8px
    const totalWidth = displayedApps.length * (cardWidth + gap);
    const containerWidth = applicationsScrollRef.current?.clientWidth || 0;

    if (totalWidth <= containerWidth || displayedApps.length === 0)
      return { current: 1, total: 1 };

    const visibleCards = Math.max(
      1,
      Math.floor(containerWidth / (cardWidth + gap))
    ); // Ensure visibleCards is at least 1
    const totalSlides = Math.max(
      1,
      Math.ceil(displayedApps.length / visibleCards)
    ); // Ensure totalSlides is at least 1
    const currentSlide =
      Math.floor(
        applicationsScrollPosition / (visibleCards * (cardWidth + gap))
      ) + 1;

    return {
      current: Math.min(Math.max(1, currentSlide), totalSlides), // Ensure current is between 1 and totalSlides
      total: totalSlides,
    };
  };

  const myApplications = [
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
    {
      name: "Tax Provision Administration",
      description: "Tax provision admin",
    },
    { name: "State Apportionment", description: "State tax allocation" },
    { name: "Statutory Reporting", description: "Compliance reporting" },
    { name: "Tax Provision", description: "Tax provisioning" },
    { name: "Uncertain Tax Positions", description: "UTP management" },
    {
      name: "University - Training & Certifications",
      description: "Learning platform",
    },
    { name: "WorkFlow Manager", description: "Workflow management" },
    { name: "Workpapers", description: "Working papers" },
  ];

  useEffect(() => {
    if (appOrder.length === 0) {
      setAppOrder(myApplications.map((app) => app.name));
      setTempOrder(myApplications.map((app) => app.name));
    }
  }, []);

  const getDisplayedApplications = () => {
    const visibleApps = myApplications.filter(
      (app) => !hiddenApps.includes(app.name)
    );
    const orderedApps =
      appOrder.length > 0
        ? (appOrder
            .map((name) => visibleApps.find((app) => app.name === name))
            .filter(Boolean) as typeof myApplications)
        : visibleApps;

    // Sort favorites first
    return orderedApps.sort((a, b) => {
      const aIsFavorite = favoriteApps.includes(a.name);
      const bIsFavorite = favoriteApps.includes(b.name);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return 0;
    });
  };

  const applications = [
    "All applications",
    ...myApplications.map((app) => app.name),
  ];

  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const applicationsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
      if (
        applicationsMenuRef.current &&
        !applicationsMenuRef.current.contains(event.target as Node)
      ) {
        setApplicationsMenuOpen(false);
      }
    }

    if (accountDropdownOpen || applicationsMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountDropdownOpen, applicationsMenuOpen]);

  const handleFavoritesOpen = () => {
    setTempFavorites([...favoriteApps]);
    setFavoritesModalOpen(true);
    setApplicationsMenuOpen(false);
  };

  const handleHideOpen = () => {
    setTempHidden([...hiddenApps]);
    setHideModalOpen(true);
    setApplicationsMenuOpen(false);
  };

  const handleReorderOpen = () => {
    setTempOrder([...appOrder]);
    setReorderModalOpen(true);
    setApplicationsMenuOpen(false);
  };

  const handleFavoritesSave = () => {
    setFavoriteApps([...tempFavorites]);
    setFavoritesModalOpen(false);
  };

  const handleHideSave = () => {
    setHiddenApps([...tempHidden]);
    setHideModalOpen(false);
  };

  const handleReorderSave = () => {
    setAppOrder([...tempOrder]);
    setReorderModalOpen(false);
  };

  const moveAppUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...tempOrder];
      [newOrder[index - 1], newOrder[index]] = [
        newOrder[index],
        newOrder[index - 1],
      ];
      setTempOrder(newOrder);
    }
  };

  const moveAppDown = (index: number) => {
    if (index < tempOrder.length - 1) {
      const newOrder = [...tempOrder];
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index],
      ];
      setTempOrder(newOrder);
    }
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    e.stopPropagation();
    setDraggedWidget(widgetId);
    setIsDragging(true);
    setDragTooltipPosition({ x: e.clientX + 10, y: e.clientY - 30 });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", widgetId);
  };

  const handleDragOver = (e: React.DragEvent, widgetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (isDragging) {
      setDragTooltipPosition({ x: e.clientX + 10, y: e.clientY - 30 });
    }

    if (draggedWidget && draggedWidget !== widgetId) {
      const rect = e.currentTarget.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const position = e.clientY < midpoint ? "before" : "after";

      setDropPosition({ targetId: widgetId, position });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();
    if (draggedWidget && draggedWidget !== targetWidgetId && dropPosition) {
      const newOrder = [...widgetOrder];
      const draggedIndex = newOrder.indexOf(draggedWidget);
      const targetIndex = newOrder.indexOf(targetWidgetId);

      // Remove dragged item
      newOrder.splice(draggedIndex, 1);

      // Insert at the correct position
      const insertIndex =
        dropPosition.position === "before" ? targetIndex : targetIndex + 1;
      const adjustedIndex =
        draggedIndex < targetIndex ? insertIndex - 1 : insertIndex;
      newOrder.splice(adjustedIndex, 0, draggedWidget);

      setWidgetOrder(newOrder);
    }
    setDraggedWidget(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
    setDropPosition(null);
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setDragTooltipPosition({ x: e.clientX + 10, y: e.clientY - 30 });
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("dragover", (e) => {
        if (isDragging) {
          setDragTooltipPosition({ x: e.clientX + 10, y: e.clientY - 30 });
        }
      });
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("dragover", (e) => {
          if (isDragging) {
            setDragTooltipPosition({ x: e.clientX + 10, y: e.clientY - 30 });
          }
        });
      };
    }
  }, [isDragging]);

  const toggleWidgetSize = (widgetId: string) => {
    setWidgetSizes((prev) => ({
      ...prev,
      [widgetId]: prev[widgetId] === "half" ? "full" : "half",
    }));
  };

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return (
          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              <text
                x="12"
                y="16"
                fontSize="6"
                textAnchor="middle"
                fill="currentColor"
                fontWeight="bold"
              >
                PDF
              </text>
            </svg>
          </div>
        );
      case "xlsx":
      case "xls":
        return (
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              <text
                x="12"
                y="16"
                fontSize="6"
                textAnchor="middle"
                fill="currentColor"
                fontWeight="bold"
              >
                XLS
              </text>
            </svg>
          </div>
        );
      case "docx":
      case "doc":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              <text
                x="12"
                y="16"
                fontSize="5"
                textAnchor="middle"
                fill="currentColor"
                fontWeight="bold"
              >
                DOC
              </text>
            </svg>
          </div>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "svg":
        return (
          <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        );
    }
  };

  const renderWidget = (widgetId: string) => {
    if (!visibleCards[widgetId]) {
      return null;
    }

    const isDraggingWidget = draggedWidget === widgetId;
    const showDropBefore =
      dropPosition?.targetId === widgetId && dropPosition.position === "before";
    const showDropAfter =
      dropPosition?.targetId === widgetId && dropPosition.position === "after";

    const baseClasses = `transition-all duration-200 ${
      isDraggingWidget ? "opacity-50 scale-95" : ""
    }`;
    const heightClasses = "max-h-[340px] overflow-hidden";

    switch (widgetId) {
      case "applications":
        const displayedApps = getDisplayedApplications();
        const slideInfo = getApplicationsSlideInfo();
        const showNavigation = displayedApps.length > 5;

        return (
          <Card
            key="applications"
            className={`mb-4 leading-7 gap-0 ${baseClasses} ${heightClasses}`}
            onDragOver={(e) => handleDragOver(e, "applications")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "applications")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-1 gap-0 mb-3">
              <CardTitle className="text-lg font-medium">
                My applications ({displayedApps.length})
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-grab active:cursor-grabbing px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "applications")}
                  onDragEnd={handleDragEnd}
                >
                  <Image
                    src="/icons/drag-handle-icon.png"
                    alt="Drag"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  onClick={() => toggleWidgetSize("applications")}
                >
                  <Image
                    src="/icons/expand-icon.png"
                    alt="Expand"
                    width={20}
                    height={20}
                  />
                </Button>
                <div className="relative" ref={applicationsMenuRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={() =>
                      setApplicationsMenuOpen(!applicationsMenuOpen)
                    }
                  >
                    <Image
                      src="/icons/menu-dots-icon.png"
                      alt="Menu"
                      width={20}
                      height={20}
                    />
                  </Button>

                  {applicationsMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2"
                        onClick={handleFavoritesOpen}
                      >
                        <Star className="w-4 h-4 text-gray-500" />
                        Favorite
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2"
                        onClick={handleHideOpen}
                      >
                        <EyeOff className="w-4 h-4 text-gray-500" />
                        Hide
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2"
                        onClick={handleReorderOpen}
                      >
                        <ArrowUpDown className="w-4 h-4 text-gray-500" />
                        Reorder
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent
              className={`pt-0 ${
                widgetSizes.applications === "half" ? "overflow-y-auto" : ""
              } relative`}
            >
              <div
                ref={applicationsScrollRef}
                className="flex gap-2 overflow-x-scroll pb-2"
                style={{
                  scrollbarWidth: "auto",
                  scrollbarColor: "#9CA3AF #F3F4F6",
                  maxWidth: "100%",
                  WebkitOverflowScrolling: "touch",
                  scrollbarGutter: "stable",
                }}
                onScroll={(e) => {
                  const target = e.target as HTMLDivElement;
                  setApplicationsScrollPosition(target.scrollLeft);
                }}
              >
                {displayedApps.map((app, i) => (
                  <Card
                    key={i}
                    className={`border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer relative flex-shrink-0 pb-0 pt-2.5 ${
                      widgetSizes.applications === "half" ? "w-48" : "w-64"
                    }`}
                  >
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {favoriteApps.includes(app.name) && (
                        <span className="text-yellow-500 text-sm">★</span>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-1">
                        <h3
                          className={`font-medium group-hover:text-[#1D4B34] hover:text-[#1D4B34] ${
                            widgetSizes.applications === "half"
                              ? "text-xs"
                              : "text-sm"
                          }`}
                        >
                          {app.name}
                        </h3>
                      </div>
                      <p
                        className={`text-gray-600 hover:text-[#1D4B34] ${
                          widgetSizes.applications === "half"
                            ? "text-xs"
                            : "text-xs"
                        }`}
                      >
                        {app.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {showNavigation && (
                <div className="flex items-center justify-center gap-3 px-4 pb-0">
                  {/* Left arrow */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    onClick={() => scrollApplications("left")}
                    disabled={applicationsScrollPosition === 0}
                    aria-label="Previous applications"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </Button>

                  {/* Dot indicators */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.max(1, slideInfo.total || 1) },
                      (
                        _,
                        i // Added validation to ensure valid array length
                      ) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i + 1 === slideInfo.current
                              ? "bg-gray-600"
                              : "bg-gray-300"
                          }`}
                        />
                      )
                    )}
                  </div>

                  {/* Right arrow */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    onClick={() => scrollApplications("right")}
                    disabled={slideInfo.current >= slideInfo.total}
                    aria-label="Next applications"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "tasks":
        return (
          <Card
            key="tasks"
            className={`mb-4 leading-7 flex-col gap-0 ${baseClasses} ${heightClasses}`}
            onDragOver={(e) => handleDragOver(e, "tasks")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "tasks")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-1 gap-0 mb-3">
              <CardTitle className="text-lg font-medium">
                Workflow Manager Tasks
              </CardTitle>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-sm text-gray-600">
                    Urgent tasks due:
                  </span>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                    defaultValue="Today"
                  >
                    <option>Choose</option>
                    <option>Today</option>
                    <option>This week</option>
                    <option>This month</option>
                  </select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-grab active:cursor-grabbing px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "tasks")}
                  onDragEnd={handleDragEnd}
                >
                  <Image
                    src="/icons/drag-handle-icon.png"
                    alt="Drag"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  onClick={() => toggleWidgetSize("tasks")}
                >
                  <Image
                    src="/icons/expand-icon.png"
                    alt="Expand"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                ></Button>
              </div>
            </CardHeader>
            <CardContent
              className={`pt-0 ${
                widgetSizes.tasks === "half" ? "overflow-y-auto" : ""
              }`}
            >
              <div
                className={`grid gap-3 ${
                  widgetSizes.tasks === "half" ? "grid-cols-2" : "grid-cols-5"
                }`}
              >
                {/* In progress card */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer">
                  <div>
                    <p
                      className={`text-gray-600 hover:text-[#1D4B34] font-medium transition-colors ${
                        widgetSizes.tasks === "half" ? "text-xs" : "text-sm"
                      }`}
                    >
                      In progress
                    </p>
                    <p
                      className={`text-gray-800 hover:text-[#1D4B34] font-bold transition-colors ${
                        widgetSizes.tasks === "half" ? "text-base" : "text-xl"
                      }`}
                    >
                      10
                    </p>
                  </div>
                </div>

                {/* Not started card */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer">
                  <div>
                    <p
                      className={`text-gray-600 hover:text-[#1D4B34] font-medium transition-colors ${
                        widgetSizes.tasks === "half" ? "text-xs" : "text-sm"
                      }`}
                    >
                      Pending
                    </p>
                    <p
                      className={`text-gray-800 hover:text-[#1D4B34] font-bold transition-colors ${
                        widgetSizes.tasks === "half" ? "text-base" : "text-xl"
                      }`}
                    >
                      25
                    </p>
                  </div>
                </div>

                {/* Pending card */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer">
                  <div>
                    <p
                      className={`text-gray-600 hover:text-[#1D4B34] font-medium transition-colors ${
                        widgetSizes.tasks === "half" ? "text-xs" : "text-sm"
                      }`}
                    >
                      Completed
                    </p>
                    <p
                      className={`text-gray-800 hover:text-[#1D4B34] font-bold transition-colors ${
                        widgetSizes.tasks === "half" ? "text-base" : "text-xl"
                      }`}
                    >
                      2
                    </p>
                  </div>
                </div>

                {/* Upcoming Deadline card */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer">
                  <div>
                    <p
                      className={`text-gray-600 hover:text-[#1D4B34] font-medium transition-colors ${
                        widgetSizes.tasks === "half" ? "text-xs" : "text-sm"
                      }`}
                    >
                      Upcoming Deadline
                    </p>
                    <p
                      className={`text-gray-800 hover:text-[#1D4B34] font-bold transition-colors ${
                        widgetSizes.tasks === "half" ? "text-base" : "text-xl"
                      }`}
                    >
                      24
                    </p>
                  </div>
                </div>

                {/* Overdue card */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer">
                  <div>
                    <p
                      className={`text-gray-600 hover:text-[#1D4B34] font-medium transition-colors ${
                        widgetSizes.tasks === "half" ? "text-xs" : "text-sm"
                      }`}
                    >
                      Overdue
                    </p>
                    <p
                      className={`text-gray-800 hover:text-[#1D4B34] font-bold transition-colors ${
                        widgetSizes.tasks === "half" ? "text-base" : "text-xl"
                      }`}
                    >
                      10
                    </p>
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center"></div>
                </div>
              </div>

              <div className="flex justify-end pt-3"></div>
            </CardContent>
          </Card>
        );

      case "help":
        return (
          <Card
            key="help"
            className={`gap-0 ${baseClasses} ${heightClasses}`}
            onDragOver={(e) => handleDragOver(e, "help")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "help")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-lg font-medium">
                Help and Support
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-grab active:cursor-grabbing px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "help")}
                  onDragEnd={handleDragEnd}
                >
                  <Image
                    src="/icons/drag-handle-icon.png"
                    alt="Drag"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  onClick={() => toggleWidgetSize("help")}
                >
                  <Image
                    src="/icons/expand-icon.png"
                    alt="Expand"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                ></Button>
              </div>
            </CardHeader>
            <CardContent
              className={`pt-0 ${
                widgetSizes.help === "half"
                  ? "space-y-1 overflow-y-auto"
                  : "space-y-1"
              }`}
            >
              <Card className="border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer px-2 h-auto py-2 my-3.5">
                <CardContent
                  className={widgetSizes.help === "half" ? "p-1.5" : "p-2"}
                >
                  {" "}
                  {/* Reduced padding from p-3/p-2 to p-2/p-1.5 */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4
                        className={`font-medium hover:text-[#1D4B34] mb-0.5 ${
                          widgetSizes.help === "half" ? "text-xs" : "text-sm"
                        }`}
                      >
                        ONESOURCE Platform Help and Support
                      </h4>
                      <p
                        className={`text-gray-600 hover:text-[#1D4B34] ${
                          widgetSizes.help === "half" ? "text-xs" : "text-xs"
                        }`}
                      >
                        Browse guides & docs
                      </p>
                    </div>
                    <Image
                      src="/icons/external-link-icon.png"
                      alt="External link"
                      width={widgetSizes.help === "half" ? 14 : 18}
                      height={widgetSizes.help === "half" ? 14 : 18}
                      className="text-gray-400"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer py-2 px-1.5 my-3.5 mx-0">
                <CardContent
                  className={widgetSizes.help === "half" ? "p-1.5" : "p-2"}
                >
                  {" "}
                  {/* Reduced padding from p-3/p-2 to p-2/p-1.5 */}
                  <div className="flex items-start justify-between px-px">
                    <div className="mx-0 px-0">
                      <h4
                        className={`font-medium hover:text-[#1D4B34] mb-0.5 ${
                          widgetSizes.help === "half" ? "text-xs" : "text-sm"
                        }`}
                      >
                        Support Tickets
                      </h4>
                      <p
                        className={`text-gray-600 hover:text-[#1D4B34] ${
                          widgetSizes.help === "half" ? "text-xs" : "text-xs"
                        }`}
                      >
                        Open Ticket: #12345 API Integration Issue - In Progress
                      </p>
                    </div>
                    <Image
                      src="/icons/external-link-icon.png"
                      alt="External link"
                      width={widgetSizes.help === "half" ? 14 : 18}
                      height={widgetSizes.help === "half" ? 14 : 18}
                      className="text-gray-400"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end py-4 my-0">
                <Button
                  className={`bg-[#123021] hover:bg-[#EDF2F0] hover:border-[#1D4B34] hover:border-2 hover:text-[#1D4B34] border border-[#123021] shadow-sm rounded text-white flex items-center gap-2 cursor-pointer ${
                    widgetSizes.help === "half"
                      ? "text-xs px-3 py-1.5"
                      : "text-sm px-4 py-2"
                  }`}
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                  onClick={() => {
                    setCocounselOpen(true);
                    setCocounselMinimized(false);
                  }}
                >
                  <SparkleIcon className="w-5 h-5" />
                  Ask cocounsel
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "activity":
        return (
          <Card
            key="activity"
            className={`gap-0 ${baseClasses} ${heightClasses}`}
            onDragOver={(e) => handleDragOver(e, "activity")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "activity")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-lg font-medium">
                Recent activity
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-grab active:cursor-grabbing px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "activity")}
                  onDragEnd={handleDragEnd}
                >
                  <Image
                    src="/icons/drag-handle-icon.png"
                    alt="Drag"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  onClick={() => toggleWidgetSize("activity")}
                >
                  <Image
                    src="/icons/expand-icon.png"
                    alt="Expand"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                ></Button>
              </div>
            </CardHeader>
            <CardContent
              className={`pt-0 ${
                widgetSizes.activity === "half"
                  ? "space-y-1 overflow-y-auto"
                  : "space-y-1"
              }`}
            >
              <Card className="border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer px-2 h-auto py-2 my-3.5">
                <CardContent
                  className={widgetSizes.activity === "half" ? "p-1.5" : "p-2"}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4
                          className={`font-medium hover:text-[#1D4B34] mb-0.5 ${
                            widgetSizes.activity === "half"
                              ? "text-xs"
                              : "text-sm"
                          }`}
                        >
                          Filed trademark for Nike
                        </h4>
                        <p
                          className={`text-gray-600 hover:text-[#1D4B34] ${
                            widgetSizes.activity === "half"
                              ? "text-xs"
                              : "text-xs"
                          }`}
                        >
                          Trademark Center • 2 hours ago
                        </p>
                      </div>
                    </div>
                    <Image
                      src="/icons/external-link-icon.png"
                      alt="External link"
                      width={widgetSizes.activity === "half" ? 14 : 18}
                      height={widgetSizes.activity === "half" ? 14 : 18}
                      className="text-gray-400"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer px-2 h-auto py-2 my-3.5">
                <CardContent
                  className={widgetSizes.activity === "half" ? "p-1.5" : "p-2"}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4
                          className={`font-medium hover:text-[#1D4B34] mb-0.5 ${
                            widgetSizes.activity === "half"
                              ? "text-xs"
                              : "text-sm"
                          }`}
                        >
                          Updated case for Apple Inc.
                        </h4>
                        <p
                          className={`text-gray-600 hover:text-[#1D4B34] ${
                            widgetSizes.activity === "half"
                              ? "text-xs"
                              : "text-xs"
                          }`}
                        >
                          Westlaw Edge • 4 hours ago
                        </p>
                      </div>
                    </div>
                    <Image
                      src="/icons/external-link-icon.png"
                      alt="External link"
                      width={widgetSizes.activity === "half" ? 14 : 18}
                      height={widgetSizes.activity === "half" ? 14 : 18}
                      className="text-gray-400"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer px-2 h-auto py-2 my-3.5">
                <CardContent
                  className={widgetSizes.activity === "half" ? "p-1.5" : "p-2"}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4
                          className={`font-medium hover:text-[#1D4B34] mb-0.5 ${
                            widgetSizes.activity === "half"
                              ? "text-xs"
                              : "text-sm"
                          }`}
                        >
                          Research completed for Microsoft
                        </h4>
                        <p
                          className={`text-gray-600 hover:text-[#1D4B34] ${
                            widgetSizes.activity === "half"
                              ? "text-xs"
                              : "text-xs"
                          }`}
                        >
                          Practical Law • 6 hours ago
                        </p>
                      </div>
                    </div>
                    <Image
                      src="/icons/external-link-icon.png"
                      alt="External link"
                      width={widgetSizes.activity === "half" ? 14 : 18}
                      height={widgetSizes.activity === "half" ? 14 : 18}
                      className="text-gray-400"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer px-2 h-auto py-2 my-3.5">
                <CardContent
                  className={widgetSizes.activity === "half" ? "p-1.5" : "p-2"}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4
                          className={`font-medium hover:text-[#1D4B34] mb-0.5 ${
                            widgetSizes.activity === "half"
                              ? "text-xs"
                              : "text-sm"
                          }`}
                        >
                          Document review for Tesla
                        </h4>
                        <p
                          className={`text-gray-600 hover:text-[#1D4B34] ${
                            widgetSizes.activity === "half"
                              ? "text-xs"
                              : "text-xs"
                          }`}
                        >
                          Document Intelligence • 8 hours ago
                        </p>
                      </div>
                    </div>
                    <Image
                      src="/icons/external-link-icon.png"
                      alt="External link"
                      width={widgetSizes.activity === "half" ? 14 : 18}
                      height={widgetSizes.activity === "half" ? 14 : 18}
                      className="text-gray-400"
                    />
                  </div>
                </CardContent>
              </Card>

              {widgetSizes.activity === "full" && (
                <>
                  <Card className="border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer px-2 h-auto py-2 my-3.5">
                    <CardContent className="p-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div>
                            <h4 className="font-medium hover:text-[#1D4B34] mb-0.5 text-sm">
                              Contract analysis for Amazon
                            </h4>
                            <p className="text-gray-600 hover:text-[#1D4B34] text-xs">
                              Contract Express • 1 day ago
                            </p>
                          </div>
                        </div>
                        <Image
                          src="/icons/external-link-icon.png"
                          alt="External link"
                          width={18}
                          height={18}
                          className="text-gray-400"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer px-2 h-auto py-2 my-3.5">
                    <CardContent className="p-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <div>
                            <h4 className="font-medium hover:text-[#1D4B34] mb-0.5 text-sm">
                              Compliance check for Google
                            </h4>
                            <p className="text-gray-600 hover:text-[#1D4B34] text-xs">
                              Risk Manager • 1 day ago
                            </p>
                          </div>
                        </div>
                        <Image
                          src="/icons/external-link-icon.png"
                          alt="External link"
                          width={18}
                          height={18}
                          className="text-gray-400"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </CardContent>
          </Card>
        );

      // Added render logic for new admin widgets
      case "system-monitoring":
        return (
          <Card
            key="system-monitoring"
            className={`gap-0 ${baseClasses} ${heightClasses}`}
            onDragOver={(e) => handleDragOver(e, "system-monitoring")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "system-monitoring")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-lg font-medium">
                System Monitoring
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-grab active:cursor-grabbing px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "system-monitoring")}
                  onDragEnd={handleDragEnd}
                >
                  <Image
                    src="/icons/drag-handle-icon.png"
                    alt="Drag"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  onClick={() => toggleWidgetSize("system-monitoring")}
                >
                  <Image
                    src="/icons/expand-icon.png"
                    alt="Expand"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <Image
                    src="/icons/menu-dots-icon.png"
                    alt="Menu"
                    width={20}
                    height={20}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent
              className={`pt-0 ${
                widgetSizes["system-monitoring"] === "half"
                  ? "space-y-2 overflow-y-auto"
                  : "space-y-3"
              }`}
            >
              {/* Active Users */}
              <div
                className="flex items-center justify-between p-3 rounded-lg border border-blue-200"
                style={{ backgroundColor: "#EDF6FF" }}
              >
                <div>
                  <p
                    className={`text-blue-600 font-medium ${
                      widgetSizes["system-monitoring"] === "half"
                        ? "text-xs"
                        : "text-sm"
                    }`}
                  >
                    Active Users
                  </p>
                  <p
                    className={`text-blue-800 font-bold ${
                      widgetSizes["system-monitoring"] === "half"
                        ? "text-lg"
                        : "text-xl"
                    }`}
                  >
                    {systemStats.activeUsers.toLocaleString()}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#0062C4" }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              {/* System Uptime */}
              <div
                className="flex items-center justify-between p-3 rounded-lg border border-green-200"
                style={{ backgroundColor: "#EAFFE5" }}
              >
                <div>
                  <p
                    className={`font-medium ${
                      widgetSizes["system-monitoring"] === "half"
                        ? "text-xs"
                        : "text-sm"
                    }`}
                    style={{ color: "#387C2B" }}
                  >
                    System Uptime
                  </p>
                  <p
                    className={`font-bold ${
                      widgetSizes["system-monitoring"] === "half"
                        ? "text-lg"
                        : "text-xl"
                    }`}
                    style={{ color: "#387C2B" }}
                  >
                    {systemStats.uptime}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#387C2B" }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Security Status */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-50 rounded border">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        systemStats.ssoEnabled ? "" : "bg-red-500"
                      }`}
                      style={
                        systemStats.ssoEnabled
                          ? { backgroundColor: "#387C2B" }
                          : {}
                      }
                    ></div>
                    <span
                      className={`font-medium ${
                        widgetSizes["system-monitoring"] === "half"
                          ? "text-xs"
                          : "text-sm"
                      }`}
                    >
                      SSO Config
                    </span>
                  </div>
                  <p
                    className={`text-gray-600 ${
                      widgetSizes["system-monitoring"] === "half"
                        ? "text-xs"
                        : "text-xs"
                    }`}
                  >
                    {systemStats.ssoEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded border">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        systemStats.mfaEnabled ? "" : "bg-red-500"
                      }`}
                      style={
                        systemStats.mfaEnabled
                          ? { backgroundColor: "#387C2B" }
                          : {}
                      }
                    ></div>
                    <span
                      className={`font-medium ${
                        widgetSizes["system-monitoring"] === "half"
                          ? "text-xs"
                          : "text-sm"
                      }`}
                    >
                      MFA Enabled
                    </span>
                  </div>
                  <p
                    className={`text-gray-600 ${
                      widgetSizes["system-monitoring"] === "half"
                        ? "text-xs"
                        : "text-xs"
                    }`}
                  >
                    {systemStats.mfaEnabled ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div className="text-center pt-2">
                <p
                  className={`text-gray-500 ${
                    widgetSizes["system-monitoring"] === "half"
                      ? "text-xs"
                      : "text-xs"
                  }`}
                >
                  Last updated: {systemStats.lastUpdate}
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "user-management":
        return (
          <Card
            key="user-management"
            className={`gap-0 ${baseClasses} ${heightClasses}`}
            onDragOver={(e) => handleDragOver(e, "user-management")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "user-management")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-lg font-medium">
                User Management
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-grab active:cursor-grabbing px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "user-management")}
                  onDragEnd={handleDragEnd}
                >
                  <Image
                    src="/icons/drag-handle-icon.png"
                    alt="Drag"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  onClick={() => toggleWidgetSize("user-management")}
                >
                  <Image
                    src="/icons/expand-icon.png"
                    alt="Expand"
                    width={20}
                    height={20}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <Image
                    src="/icons/menu-dots-icon.png"
                    alt="Menu"
                    width={20}
                    height={20}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent
              className={`pt-0 ${
                widgetSizes["user-management"] === "half"
                  ? "space-y-1 overflow-y-auto"
                  : "space-y-2"
              }`}
            >
              {/* Quick Actions */}
              <div className="flex gap-2 mb-3 justify-end">
                <Button
                  className={`bg-[#123021] hover:bg-[#EDF2F0] hover:border-[#1D4B34] hover:border-2 hover:text-[#1D4B34] border border-[#1D4B34] shadow-sm rounded text-white flex items-center gap-2 cursor-pointer ${
                    widgetSizes["user-management"] === "half"
                      ? "text-xs px-3 py-1.5"
                      : "text-sm px-4 py-2"
                  }`}
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                >
                  <Plus
                    className={
                      widgetSizes["user-management"] === "half"
                        ? "w-3 h-3"
                        : "w-4 h-4"
                    }
                  />
                  Add User
                </Button>
              </div>

              {/* User List */}
              <div className="space-y-1">
                {users
                  .slice(0, widgetSizes["user-management"] === "half" ? 3 : 4)
                  .map((user) => (
                    <Card
                      key={user.id}
                      className="border border-gray-200 hover:shadow-md hover:bg-[#EDF2F0] hover:border-[#1D4B34] transition-all cursor-pointer"
                    >
                      <CardContent
                        className={
                          widgetSizes["user-management"] === "half"
                            ? "p-2"
                            : "p-3"
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ml-3">
                              <span
                                className={`font-medium text-gray-600 hover:text-[#1D4B34] ${
                                  widgetSizes["user-management"] === "half"
                                    ? "text-xs"
                                    : "text-sm"
                                }`}
                              >
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <h4
                                className={`font-medium hover:text-[#1D4B34] ${
                                  widgetSizes["user-management"] === "half"
                                    ? "text-xs"
                                    : "text-sm"
                                }`}
                              >
                                {user.name}
                              </h4>
                              <p
                                className={`text-gray-600 hover:text-[#1D4B34] ${
                                  widgetSizes["user-management"] === "half"
                                    ? "text-xs"
                                    : "text-xs"
                                }`}
                              >
                                {user.role}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full`}
                              style={{
                                backgroundColor:
                                  user.status === "Active"
                                    ? "#387C2B"
                                    : "#6B7280",
                              }}
                            ></div>
                            <span
                              className={`${
                                widgetSizes["user-management"] === "half"
                                  ? "text-xs"
                                  : "text-sm"
                              } ${
                                user.status === "Active"
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {user.status}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="link"
                  className="text-blue-600 text-sm p-0 cursor-pointer"
                >
                  View All Users ({users.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const dashboardCards = [
    {
      id: "applications",
      name: "My Applications",
      description: "View and manage your applications.",
    },
    {
      id: "tasks",
      name: "My Tasks",
      description: "Track your urgent and in-progress tasks.",
    },
    {
      id: "help",
      name: "Help and Support",
      description: "Access guides, docs, and support tickets.",
    },
    {
      id: "activity",
      name: "Recent Activity",
      description: "See your latest dashboard activity.",
    },
    // Added new admin cards to the dashboardCards array
    {
      id: "system-monitoring",
      name: "System Monitoring",
      description: "View system health and performance metrics.",
    },
    {
      id: "user-management",
      name: "User Management",
      description: "Manage user accounts and permissions.",
    },
  ];

  const handleCustomizeViewOpen = () => {
    setTempVisibleCards({ ...visibleCards });
    setCustomizeViewModalOpen(true);
  };

  const handleCustomizeViewSave = () => {
    setVisibleCards({ ...tempVisibleCards });
    setCustomizeViewModalOpen(false);
  };

  const handleImportOpen = () => {
    setImportModalOpen(true);
  };

  const handleFileUpload = (files: FileList) => {
    const newUploads = Array.from(files).map((file) => {
      const uploadId = Math.random().toString(36).substr(2, 9);
      return {
        id: uploadId,
        fileName: file.name,
        status: "uploading" as const,
        progress: 0,
      };
    });

    // Add all new uploads and show the window
    setUploadNotifications((prev) => [...prev, ...newUploads]);
    setUploadWindowVisible(true);
    setUploadWindowMinimized(false);

    // Simulate upload progress for each file
    newUploads.forEach((upload) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Update to complete status
          setUploadNotifications((prev) =>
            prev.map((notif) =>
              notif.id === upload.id
                ? { ...notif, status: "complete", progress: 100 }
                : notif
            )
          );
        } else {
          setUploadNotifications((prev) =>
            prev.map((notif) =>
              notif.id === upload.id ? { ...notif, progress } : notif
            )
          );
        }
      }, 200);
    });

    setImportModalOpen(false);
  };

  const handleDragOverModal = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeaveModal = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDropModal = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const closeUploadWindow = () => {
    setUploadWindowVisible(false);
    setUploadNotifications([]);
  };

  const toggleUploadWindow = () => {
    setUploadWindowMinimized(!uploadWindowMinimized);
  };

  const removeNotification = (id: string) => {
    setUploadNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isDragging && (
        <div
          className="fixed z-50 bg-black text-white px-2 py-1 rounded text-sm pointer-events-none"
          style={{
            left: dragTooltipPosition.x,
            top: dragTooltipPosition.y,
          }}
        >
          Move
        </div>
      )}

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
            onClick={() => {
              setCocounselOpen(!cocounselOpen);
              setCocounselMinimized(false);
            }}
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
        {/* Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? "w-16" : "w-60"
          } bg-gray-100 border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out my-0`}
        >
          <div className="p-3">
            <Button
              variant="ghost"
              size="sm"
              className="mb-3 p-0 h-auto hover:bg-gray-200 ml-auto block cursor-pointer"
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
              <div className="flex items-center gap-2 px-3 py-2 bg-[#EDF2F0] border-2 border-[#1D4B34] rounded min-h-[40px]">
                <Image
                  src="/icons/dashboard-grid-icon.png"
                  alt="Dashboard"
                  width={20}
                  height={20}
                />
                {!sidebarCollapsed && (
                  <span className="font-medium text-gray-900">Dashboard</span>
                )}
              </div>

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
                    </>
                  )}
                </div>
              </Link>
              <Link href="/system-status" className="block">
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] hover:text-[#1D4B34] rounded-md cursor-pointer transition-all duration-200">
                  <Image
                    src="/icons/warning-triangle-icon.png"
                    alt="System Status"
                    width={20}
                    height={20}
                    className="hover:filter hover:brightness-0 hover:saturate-100 hover:hue-rotate-90"
                  />
                  {!sidebarCollapsed && (
                    <>
                      <span>System Status</span>
                    </>
                  )}
                </div>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="flex gap-3">
              <Button
                className="bg-white border border-[#1D4B34] hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] shadow-sm rounded flex items-center justify-center gap-2 min-h-[40px] w-[174px] text-[#1D4B34] cursor-pointer"
                style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                onClick={handleCustomizeViewOpen}
              >
                <LayoutGrid className="w-4 h-4 text-[#1D4B34]" />
                Customize View
              </Button>
              <Button
                className="bg-[#123021] text-white hover:bg-[#EDF2F0] hover:border-[#1D4B34] hover:border-2 hover:text-[#1D4B34] border-2 border-[#123021] shadow-sm rounded flex items-center gap-2 min-h-[40px] cursor-pointer"
                style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                onClick={handleImportOpen}
              >
                <Upload className="w-4 h-4 text-white hover:text-[#1D4B34]" />
                Import
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Top row widgets */}
            <div className="grid grid-cols-12 gap-4">
              {widgetOrder.slice(0, 2).map((widgetId, index) => (
                <div
                  key={widgetId}
                  className={
                    widgetSizes[widgetId] === "full"
                      ? "col-span-12"
                      : "col-span-6"
                  }
                >
                  {/* Drop indicator before widget */}
                  {dropPosition?.targetId === widgetId &&
                    dropPosition.position === "before" && (
                      <div className="h-1 bg-blue-500 rounded-full mb-2 shadow-lg"></div>
                    )}
                  {renderWidget(widgetId)}
                  {/* Drop indicator after widget */}
                  {dropPosition?.targetId === widgetId &&
                    dropPosition.position === "after" && (
                      <div className="h-1 bg-blue-500 rounded-full mt-2 shadow-lg"></div>
                    )}
                </div>
              ))}
            </div>

            {/* Bottom row widgets */}
            <div className="grid grid-cols-12 gap-4">
              {widgetOrder.slice(2).map((widgetId, index) => (
                <div
                  key={widgetId}
                  className={
                    widgetSizes[widgetId] === "full"
                      ? "col-span-12"
                      : "col-span-6"
                  }
                >
                  {/* Drop indicator before widget */}
                  {dropPosition?.targetId === widgetId &&
                    dropPosition.position === "before" && (
                      <div className="h-1 bg-blue-500 rounded-full mb-2 shadow-lg"></div>
                    )}
                  {renderWidget(widgetId)}
                  {/* Drop indicator after widget */}
                  {dropPosition?.targetId === widgetId &&
                    dropPosition.position === "after" && (
                      <div className="h-1 bg-blue-500 rounded-full mt-2 shadow-lg"></div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* CoCounsel chat panel */}
        {cocounselOpen && !cocounselMinimized && (
          <div className="fixed bottom-4 right-4 w-96 h-[700px] bg-white border border-gray-300 rounded-lg shadow-xl z-50 flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg h-auto">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/cocounsel-logo.png"
                  alt="CoCounsel"
                  width={16}
                  height={16}
                />
                <span className="font-semibold text-gray-900 text-sm">
                  CoCounsel
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 hover:bg-gray-200 w-[32px ] cursor-pointer"
                  onClick={() => setCocounselMinimized(true)}
                >
                  <Image
                    src="/icons/cocounsel-minimize.png"
                    alt="Minimize"
                    width={36}
                    height={36}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 hover:bg-gray-200 w-8 cursor-pointer"
                >
                  <Image
                    src="/icons/cocounsel-expand.png"
                    alt="Expand"
                    width={36}
                    height={36}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 hover:bg-gray-200 w-8 cursor-pointer"
                >
                  <Image
                    src="/icons/cocounsel-menu.png"
                    alt="Menu"
                    width={36}
                    height={36}
                  />
                </Button>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-3 border-b border-gray-200">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-gray-700 bg-white border-gray-300 hover:bg-gray-50 h-9 cursor-pointer"
              >
                <Image
                  width="16"
                  height="16"
                  src="/icons/cocounsel-new-chat.png"
                  alt="New chat"
                  className="text-gray-500"
                />
                New chat
              </Button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-4 bg-gray-50">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Image
                    src="/icons/cocounsel-avatar.png"
                    alt="CoCounsel Avatar"
                    width={28}
                    height={28}
                    className="rounded-full flex-shrink-0 mt-1"
                  />
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-700">
                        Good afternoon, Amy Cocounsel uses generative AI to
                        answer questions based on user guides, help articles and
                        release notes. Answers can be inaccurate but will always
                        link to the original source. Ask a detailed question
                        about a ONESOURCE product to get started.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask CoCounsel..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button size="sm" className="px-3">
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Minimized CoCounsel */}
        {cocounselOpen && cocounselMinimized && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-3">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/cocounsel-logo.png"
                alt="CoCounsel"
                width={16}
                height={16}
              />
              <span className="font-semibold text-gray-900 text-sm">
                CoCounsel
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 hover:bg-gray-200 ml-2 cursor-pointer"
                onClick={() => setCocounselMinimized(false)}
              >
                <Image
                  src="/icons/cocounsel-expand.png"
                  alt="Expand"
                  width={16}
                  height={16}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 hover:bg-gray-200"
                onClick={() => setCocounselOpen(false)}
              >
                <span className="text-gray-500 text-sm">×</span>
              </Button>
            </div>
          </div>
        )}

        {/* Notifications dropdown */}
        {notificationsOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              onClick={() => setNotificationsOpen(false)}
            />

            {/* Notifications Panel - slides in from right */}
            <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <div className="text-sm text-gray-500">Platform Header</div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h2>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Tabs and Actions */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex space-x-1">
                  <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded">
                    All
                  </button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                    Unread
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>

              {/* Notifications Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Today Section */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Today
                  </h3>

                  {/* Notification Item 1 */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Tax Compliance Alert
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>34m ago</span>
                        <MoreVertical className="w-3 h-3 cursor-pointer hover:text-gray-700" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 mb-1">
                        Q3 Corporate Tax Filing Deadline Approaching
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Form 1120 due in 5 days for Acme Corp. All supporting
                        documents have been uploaded.
                      </div>
                      <div className="flex space-x-2">
                        <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          In Progress
                        </span>
                        <button className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                          Review Filing
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notification Item 2 */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          System Update
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>1h ago</span>
                        <MoreVertical className="w-3 h-3 cursor-pointer hover:text-gray-700" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 mb-1">
                        New Tax Regulation Updates Available
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        IRS Section 199A deduction guidelines updated. Review
                        changes affecting pass-through entities.
                      </div>
                      <div className="flex space-x-2">
                        <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          New
                        </span>
                        <button className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                          View Updates
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Yesterday Section */}
                <div className="p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Yesterday
                  </h3>

                  {/* Notification Item 3 */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Document Processing
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>1d ago</span>
                        <MoreVertical className="w-3 h-3 cursor-pointer hover:text-gray-700" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 mb-1">
                        Client W-9 Forms Processed Successfully
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        15 new W-9 forms from TechStart LLC have been validated
                        and added to client records.
                      </div>
                      <div className="flex space-x-2">
                        <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          Completed
                        </span>
                        <button className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                          View Documents
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notification Item 4 */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Compliance Alert
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>1d ago</span>
                        <MoreVertical className="w-3 h-3 cursor-pointer hover:text-gray-700" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 mb-1">
                        State Tax Nexus Review Required
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        GlobalTech Inc. may have established nexus in 3 new
                        states. Review sales activity and filing requirements.
                      </div>
                      <div className="flex space-x-2">
                        <span className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                          Action Required
                        </span>
                        <button className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                          Start Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* This Week Section */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    This week
                  </h3>

                  {/* Notification Item 5 */}
                  <div className="mb-4 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          System Maintenance
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>06-23</span>
                        <MoreVertical className="w-3 h-3 cursor-pointer hover:text-gray-700" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 mb-1">
                        Scheduled System Maintenance Complete
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Tax research database and e-filing systems have been
                        updated with enhanced security features.
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                          Resolved
                        </button>
                        <button className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account dropdown */}
        {accountDropdownOpen && (
          <div
            className="fixed top-14 right-4 w-48 bg-white border border-gray-300 rounded-lg shadow-xl z-50"
            ref={accountDropdownRef}
          >
            <div className="p-2">
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={() => {
                  setAccountSettingsOpen(true);
                  setAccountDropdownOpen(false);
                }}
              >
                Account Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Account Preferences
              </button>
              <hr className="my-2" />
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Account Settings Modal */}
        {accountSettingsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 relative">
              <button
                onClick={() => setAccountSettingsOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={32} strokeWidth={1.5} />
              </button>

              <div className="mb-8">
                <h1 className="text-4xl font-normal text-gray-900 mb-1">
                  Account settings
                </h1>
                <div className="w-full h-px bg-gray-300 mt-6"></div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                  Jessica Smith
                </h2>
                <p className="text-lg text-gray-600">
                  jessica.smith@thomsonreuters.com
                </p>
              </div>

              <div className="space-y-6 mb-12">
                <a
                  href="#"
                  className="block text-xl text-blue-600 underline hover:text-blue-800 transition-colors"
                >
                  Account information
                </a>
                <a
                  href="#"
                  className="block text-xl text-blue-600 underline hover:text-blue-800 transition-colors"
                >
                  Community
                </a>
                <a
                  href="#"
                  className="block text-xl text-blue-600 underline hover:text-blue-800 transition-colors"
                >
                  Training and support
                </a>
                <a
                  href="#"
                  className="block text-xl text-blue-600 underline hover:text-blue-800 transition-colors"
                >
                  Manage subscriptions
                </a>
              </div>

              <button className="bg-[#1D4B34] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#2A5F42] transition-colors flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                  Sign out
                </div>
              </button>
            </div>
          </div>
        )}

        {favoritesModalOpen && (
          <div className="fixed inset-0 bg-[#000000da] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[600px] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Manage Favorites
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 hover:bg-gray-100"
                  onClick={() => setFavoritesModalOpen(false)}
                >
                  <span className="text-gray-500 text-lg">×</span>
                </Button>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select applications to mark as favorites. Favorites will
                  appear first in your dashboard.
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    {tempFavorites.length} of {myApplications.length} selected
                  </span>
                  <Button
                    className="bg-white border border-[#1D4B34] hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] shadow-sm rounded flex items-center justify-center text-[#1D4B34] cursor-pointer px-3 py-1.5 text-sm"
                    style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                    onClick={() =>
                      setTempFavorites(
                        tempFavorites.length === myApplications.length
                          ? []
                          : myApplications.map((app) => app.name)
                      )
                    }
                  >
                    {tempFavorites.length === myApplications.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {myApplications.map((app) => (
                    <label
                      key={app.name}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={tempFavorites.includes(app.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTempFavorites([...tempFavorites, app.name]);
                          } else {
                            setTempFavorites(
                              tempFavorites.filter((name) => name !== app.name)
                            );
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">
                          {app.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {app.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                <Button
                  className="bg-white border border-[#1D4B34] hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] shadow-sm rounded flex items-center justify-center text-[#1D4B34] cursor-pointer px-4 py-2 min-h-[40px]"
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                  onClick={() => setFavoritesModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#123021] hover:bg-[#EDF2F0] hover:border-[#1D4B34] hover:border-2 hover:text-[#1D4B34] border-2 border-[#123021] shadow-sm rounded flex items-center gap-2 min-h-[40px] cursor-pointer text-white px-4 py-2"
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                  onClick={handleFavoritesSave}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {hideModalOpen && (
          <div className="fixed inset-0 bg-[#000000da] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[600px] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Manage Hidden Applications
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 hover:bg-gray-100"
                  onClick={() => setHideModalOpen(false)}
                >
                  <span className="text-gray-500 text-lg">×</span>
                </Button>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select applications to hide from your dashboard. Hidden
                  applications can be restored later.
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    {tempHidden.length} of {myApplications.length} selected
                  </span>
                  <Button
                    className="bg-white border border-[#1D4B34] hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] shadow-sm rounded flex items-center justify-center text-[#1D4B34] cursor-pointer px-3 py-1.5 text-sm"
                    style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                    onClick={() =>
                      setTempHidden(
                        tempHidden.length === myApplications.length
                          ? []
                          : myApplications.map((app) => app.name)
                      )
                    }
                  >
                    {tempHidden.length === myApplications.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {myApplications.map((app) => (
                    <label
                      key={app.name}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={tempHidden.includes(app.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTempHidden([...tempHidden, app.name]);
                          } else {
                            setTempHidden(
                              tempHidden.filter((name) => name !== app.name)
                            );
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">
                          {app.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {app.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                <Button
                  className="bg-white border border-[#1D4B34] hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] shadow-sm rounded flex items-center justify-center text-[#1D4B34] cursor-pointer px-4 py-2 min-h-[40px]"
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                  onClick={() => setHideModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#123021] hover:bg-[#EDF2F0] hover:border-[#1D4B34] hover:border-2 hover:text-[#1D4B34] border-2 border-[#123021] shadow-sm rounded flex items-center gap-2 min-h-[40px] cursor-pointer text-white px-4 py-2"
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                  onClick={handleHideSave}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {reorderModalOpen && (
          <div className="fixed inset-0 bg-[#000000da] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[600px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Reorder Applications
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReorderModalOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <p className="text-sm text-gray-600 mb-4">
                  Use the up and down buttons to reorder applications in your
                  dashboard.
                </p>
                <div className="space-y-2 overflow-y-auto max-h-80">
                  {tempOrder.map((appName, index) => {
                    const app = myApplications.find((a) => a.name === appName);
                    if (!app) return null;

                    return (
                      <div
                        key={appName}
                        className="flex items-center gap-3 p-2 border border-gray-200 rounded"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {app.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {app.description}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-1 h-6 w-6 bg-transparent"
                            onClick={() => moveAppUp(index)}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-1 h-6 w-6 bg-transparent"
                            onClick={() => moveAppDown(index)}
                            disabled={index === tempOrder.length - 1}
                          >
                            ↓
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                <Button
                  className="bg-white border border-[#1D4B34] hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] shadow-sm rounded flex items-center justify-center text-[#1D4B34] cursor-pointer px-4 py-2 min-h-[40px]"
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                  onClick={() => setReorderModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#123021] hover:bg-[#EDF2F0] hover:border-[#1D4B34] hover:border-2 hover:text-[#1D4B34] border-2 border-[#123021] shadow-sm rounded flex items-center gap-2 min-h-[40px] cursor-pointer text-white px-4 py-2"
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                  onClick={handleReorderSave}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {customizeViewModalOpen && (
          <div className="fixed inset-0 bg-[#000000da] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[600px] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Customize View
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 hover:bg-gray-100"
                  onClick={() => setCustomizeViewModalOpen(false)}
                >
                  <span className="text-gray-500 text-lg">×</span>
                </Button>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select which cards to display on your dashboard. Hidden cards
                  can be restored later.
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    {Object.values(tempVisibleCards).filter(Boolean).length} of{" "}
                    {dashboardCards.length} visible
                  </span>
                  <Button
                    className="bg-white border border-[#1D4B34] hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] shadow-sm rounded flex items-center justify-center text-[#1D4B34] cursor-pointer px-4 py-2 min-h-[40px]"
                    style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                    onClick={() => {
                      const allVisible =
                        Object.values(tempVisibleCards).every(Boolean);
                      const newVisibility = dashboardCards.reduce(
                        (acc, card) => ({
                          ...acc,
                          [card.id]:
                            card.id === "applications" ? true : !allVisible,
                        }),
                        {}
                      );
                      setTempVisibleCards(newVisibility);
                    }}
                  >
                    {Object.values(tempVisibleCards).every(Boolean)
                      ? "Hide All"
                      : "Show All"}
                  </Button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {dashboardCards.map((card) => (
                    <label
                      key={card.id}
                      className={`flex items-center gap-3 p-2 rounded ${
                        card.id === "applications"
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={tempVisibleCards[card.id]}
                        onChange={(e) => {
                          if (card.id === "applications") return;
                          setTempVisibleCards({
                            ...tempVisibleCards,
                            [card.id]: e.target.checked,
                          });
                        }}
                        disabled={card.id === "applications"}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div
                          className={`font-medium text-sm ${
                            card.id === "applications"
                              ? "text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {card.name}
                        </div>
                        <div
                          className={`text-xs ${
                            card.id === "applications"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {card.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                <Button
                  className="bg-white border border-[#1D4B34] hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] shadow-sm rounded flex items-center justify-center text-[#1D4B34] cursor-pointer px-4 py-2 min-h-[40px]"
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                  onClick={() => setCustomizeViewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#123021] hover:bg-[#EDF2F0] hover:border-[#1D4B34] hover:border-2 hover:text-[#1D4B34] border-2 border-[#123021] shadow-sm rounded flex items-center gap-2 min-h-[40px] cursor-pointer text-white px-4 py-2"
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                  onClick={handleCustomizeViewSave}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {importModalOpen && (
          <div className="fixed inset-0 bg-[#000000da] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[500px] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Import Documents
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 hover:bg-gray-100"
                  onClick={() => setImportModalOpen(false)}
                >
                  <span className="text-gray-500 text-lg">×</span>
                </Button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-6">
                  Upload documents or folders to be used across all ONESOURCE
                  applications. Supported formats include PDF, Word, Excel, and
                  more.
                </p>

                {/* Drag and Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver
                      ? "border-[#1D4B34] bg-[#EDF2F0]"
                      : "border-gray-300 hover:border-[#1D4B34] hover:bg-gray-50"
                  }`}
                  onDragOver={handleDragOverModal}
                  onDragLeave={handleDragLeaveModal}
                  onDrop={handleDropModal}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Drag and drop files here
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    or click to browse your computer
                  </p>

                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(e.target.files);
                      }
                    }}
                  />

                  <Button
                    className="bg-[#123021] hover:bg-[#EDF2F0] hover:border-[#1D4B34] hover:border-2 hover:text-[#1D4B34] border-2 border-[#123021] shadow-sm rounded flex items-center gap-2 min-h-[40px] cursor-pointer text-white px-4 py-2 mx-auto"
                    style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4" />
                    Choose Files
                  </Button>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <p>• Maximum file size: 100MB per file</p>
                  <p>
                    • Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX,
                    TXT, CSV
                  </p>
                  <p>
                    • Folders will be uploaded with their structure preserved
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                <Button
                  className="bg-white border border-[#1D4B34] hover:bg-[#EDF2F0] hover:border-2 hover:border-[#1D4B34] shadow-sm rounded flex items-center justify-center text-[#1D4B34] cursor-pointer px-4 py-2 min-h-[40px]"
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.16)" }}
                  onClick={() => setImportModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {uploadWindowVisible && uploadNotifications.length > 0 && (
          <div
            className={`fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl transition-all duration-300 ${
              uploadWindowMinimized ? "w-80 h-12" : "w-80 max-h-96"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">
                {uploadNotifications.filter((n) => n.status === "complete")
                  .length === uploadNotifications.length
                  ? `${uploadNotifications.length} upload${
                      uploadNotifications.length > 1 ? "s" : ""
                    } complete`
                  : `Uploading ${uploadNotifications.length} file${
                      uploadNotifications.length > 1 ? "s" : ""
                    }...`}
              </h4>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 hover:bg-gray-100 rounded-full"
                  onClick={toggleUploadWindow}
                >
                  <ChevronUp
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      uploadWindowMinimized ? "rotate-180" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 hover:bg-gray-100"
                  onClick={closeUploadWindow}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* File List - Only show when not minimized */}
            {!uploadWindowMinimized && (
              <div className="max-h-80 overflow-y-auto">
                {uploadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0"
                  >
                    {getFileTypeIcon(notification.fileName)}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">
                        {notification.fileName}
                      </p>
                      {notification.status === "uploading" && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-[#1D4B34] h-1 rounded-full transition-all duration-300"
                              style={{ width: `${notification.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(notification.progress)}%
                          </p>
                        </div>
                      )}
                    </div>

                    {notification.status === "complete" && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#387C2B" }}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
