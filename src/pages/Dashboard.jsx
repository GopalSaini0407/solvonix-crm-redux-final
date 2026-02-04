"use client"

import { useState } from "react";

import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Calendar,
  Clock,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle,
  X,
  Filter,
  Download,
  RefreshCw,
  Phone,
  Mail,
  User,
  FileText,
  Trash2,
  Paperclip,
} from "lucide-react"

const Dashboard = () => {




  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [quickAddType, setQuickAddType] = useState("lead")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    leadStatus: "all",
    assignee: "all",
    priority: "all",
    dateRange: "all",
  })
  const [refreshing, setRefreshing] = useState(false)

  // Enhanced sample data with more realistic information
  const [allLeads] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      company: "Tech Solutions",
      value: 75000,
      status: "new",
      time: "2 hours ago",
      assignee: "Priya Singh",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Priya Sharma",
      company: "Digital Corp",
      value: 120000,
      status: "contacted",
      time: "4 hours ago",
      assignee: "Amit Kumar",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      name: "Amit Patel",
      company: "StartupXYZ",
      value: 45000,
      status: "qualified",
      time: "6 hours ago",
      assignee: "Neha Agarwal",
      createdAt: "2024-01-13",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      company: "Enterprise Ltd",
      value: 200000,
      status: "proposal",
      time: "1 day ago",
      assignee: "Rohit Verma",
      createdAt: "2024-01-12",
    },
    {
      id: 5,
      name: "Vikash Patel",
      company: "Corporate Inc",
      value: 85000,
      status: "won",
      time: "2 days ago",
      assignee: "Kavya Sharma",
      createdAt: "2024-01-11",
    },
    {
      id: 6,
      name: "Sunita Reddy",
      company: "Business Solutions",
      value: 95000,
      status: "contacted",
      time: "3 days ago",
      assignee: "Priya Singh",
      createdAt: "2024-01-10",
    },
  ])

  // FIXED: Made tasks state mutable so they can be deleted and modified
  const [allTasks, setAllTasks] = useState([
    {
      id: 1,
      task: "Follow up with Rajesh Kumar",
      time: "2:00 PM",
      priority: "high",
      assignee: "Priya Singh",
      type: "call",
      createdAt: "2024-01-15",
      attachments: [],
      completed: false,
    },
    {
      id: 2,
      task: "Demo call with Tech Solutions",
      time: "4:30 PM",
      priority: "medium",
      assignee: "Amit Kumar",
      type: "meeting",
      createdAt: "2024-01-14",
      attachments: [],
      completed: false,
    },
    {
      id: 3,
      task: "Send proposal to Digital Corp",
      time: "Tomorrow 10:00 AM",
      priority: "high",
      assignee: "Neha Agarwal",
      type: "email",
      createdAt: "2024-01-13",
      attachments: [],
      completed: false,
    },
    {
      id: 4,
      task: "Team meeting",
      time: "Tomorrow 2:00 PM",
      priority: "low",
      assignee: "All",
      type: "meeting",
      createdAt: "2024-01-12",
      attachments: [],
      completed: false,
    },
    {
      id: 5,
      task: "Client presentation",
      time: "Friday 3:00 PM",
      priority: "high",
      assignee: "Rohit Verma",
      type: "meeting",
      createdAt: "2024-01-11",
      attachments: [],
      completed: false,
    },
  ])

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: "New lead added", user: "Priya Singh", time: "10 minutes ago", type: "lead" },
    { id: 2, action: "Deal closed", user: "Amit Kumar", time: "1 hour ago", type: "deal" },
    { id: 3, action: "Follow-up call scheduled", user: "Neha Agarwal", time: "2 hours ago", type: "task" },
    { id: 4, action: "Proposal sent", user: "Rohit Verma", time: "3 hours ago", type: "proposal" },
    { id: 5, action: "Meeting completed", user: "Kavya Sharma", time: "5 hours ago", type: "meeting" },
  ])

  const topPerformers = [
    { name: "Priya Singh", deals: 12, revenue: 450000, avatar: "PS" },
    { name: "Amit Kumar", deals: 10, revenue: 380000, avatar: "AK" },
    { name: "Neha Agarwal", deals: 8, revenue: 320000, avatar: "NA" },
    { name: "Rohit Verma", deals: 7, revenue: 280000, avatar: "RV" },
  ]

  // Team members for assignment
  const teamMembers = ["Priya Singh", "Amit Kumar", "Neha Agarwal", "Rohit Verma", "Kavya Sharma"]

  // Quick Add form state
  const [quickAddForm, setQuickAddForm] = useState({
    // Lead fields
    leadName: "",
    leadEmail: "",
    leadPhone: "",
    leadCompany: "",
    leadValue: "",
    leadSource: "website",
    leadStatus: "new",
    // Task fields
    taskTitle: "",
    taskDescription: "",
    taskDueDate: "",
    taskPriority: "medium",
    taskAssignee: "",
    taskType: "call",
    // Deal fields
    dealTitle: "",
    dealValue: "",
    dealStage: "new",
    dealCloseDate: "",
    dealContact: "",
    // Activity fields
    activityType: "call",
    activityDescription: "",
    activityContact: "",
    activityDate: "",
  })

  // Filter data based on current filters - NOW PROPERLY IMPLEMENTED
  const getFilteredData = () => {
    let filteredLeads = allLeads
    let filteredTasks = allTasks.filter((task) => !task.completed) // Only show incomplete tasks

    // Apply lead status filter
    if (filters.leadStatus !== "all") {
      filteredLeads = filteredLeads.filter((lead) => lead.status === filters.leadStatus)
    }

    // Apply assignee filter
    if (filters.assignee !== "all") {
      filteredLeads = filteredLeads.filter((lead) => lead.assignee === filters.assignee)
      filteredTasks = filteredTasks.filter((task) => task.assignee === filters.assignee || task.assignee === "All")
    }

    // Apply priority filter
    if (filters.priority !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.priority === filters.priority)
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      const filterDate = (dateStr) => {
        const itemDate = new Date(dateStr)
        const daysDiff = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24))

        switch (filters.dateRange) {
          case "today":
            return daysDiff === 0
          case "week":
            return daysDiff <= 7
          case "month":
            return daysDiff <= 30
          default:
            return true
        }
      }

      filteredLeads = filteredLeads.filter((lead) => filterDate(lead.createdAt))
      filteredTasks = filteredTasks.filter((task) => filterDate(task.createdAt))
    }

    return { filteredLeads, filteredTasks }
  }

  const { filteredLeads, filteredTasks } = getFilteredData()

  // Calculate metrics based on filtered data
  const calculateMetrics = () => {
    const totalLeads = filteredLeads.length
    const totalRevenue = filteredLeads.reduce((sum, lead) => sum + lead.value, 0)
    const wonLeads = filteredLeads.filter((lead) => lead.status === "won").length
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0
    const activeDeals = filteredLeads.filter((lead) =>
      ["contacted", "qualified", "proposal"].includes(lead.status),
    ).length

    return {
      totalLeads,
      totalRevenue,
      conversionRate: Number.parseFloat(conversionRate),
      activeDeals,
      leadsGrowth: 12.5,
      revenueGrowth: 8.3,
      conversionGrowth: -2.1,
      dealsGrowth: 15.2,
    }
  }

  const metrics = calculateMetrics()

  // Calculate pipeline data based on filtered leads
  const calculatePipelineData = () => {
    const stages = ["new", "contacted", "qualified", "proposal", "won"]
    const colors = ["bg-blue-500", "bg-yellow-500", "bg-orange-500", "bg-purple-500", "bg-green-500"]

    return stages.map((stage, index) => {
      const stageLeads = filteredLeads.filter((lead) => lead.status === stage)
      return {
        stage: stage.charAt(0).toUpperCase() + stage.slice(1),
        count: stageLeads.length,
        value: stageLeads.reduce((sum, lead) => sum + lead.value, 0),
        color: colors[index],
      }
    })
  }

  const pipelineData = calculatePipelineData()

  // Handle period change and refresh data
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period)
    setRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  // Quick Add functionality
  const handleQuickAdd = () => {
    const timestamp = new Date().toISOString()
    const timeAgo = "Just now"

    switch (quickAddType) {
      case "lead":
        if (quickAddForm.leadName && quickAddForm.leadEmail) {
          const newActivity = {
            id: Date.now(),
            action: `New lead added: ${quickAddForm.leadName}`,
            user: "You",
            time: timeAgo,
            type: "lead",
          }
          setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)])
        }
        break

      case "task":
        if (quickAddForm.taskTitle) {
          // FIXED: Actually add the task to the tasks list
          const newTask = {
            id: Date.now(),
            task: quickAddForm.taskTitle,
            time: quickAddForm.taskDueDate ? new Date(quickAddForm.taskDueDate).toLocaleString() : "No due date",
            priority: quickAddForm.taskPriority,
            assignee: quickAddForm.taskAssignee || "Unassigned",
            type: quickAddForm.taskType,
            createdAt: new Date().toISOString().split("T")[0],
            attachments: [],
            completed: false,
          }
          setAllTasks((prev) => [newTask, ...prev])

          const newActivity = {
            id: Date.now(),
            action: `Task created: ${quickAddForm.taskTitle}`,
            user: "You",
            time: timeAgo,
            type: "task",
          }
          setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)])
        }
        break

      case "deal":
        if (quickAddForm.dealTitle) {
          const newActivity = {
            id: Date.now(),
            action: `Deal created: ${quickAddForm.dealTitle}`,
            user: "You",
            time: timeAgo,
            type: "deal",
          }
          setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)])
        }
        break

      case "activity":
        if (quickAddForm.activityDescription) {
          const newActivity = {
            id: Date.now(),
            action: quickAddForm.activityDescription,
            user: "You",
            time: timeAgo,
            type: quickAddForm.activityType,
          }
          setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)])
        }
        break
    }

    // Reset form and close modal
    setQuickAddForm({
      leadName: "",
      leadEmail: "",
      leadPhone: "",
      leadCompany: "",
      leadValue: "",
      leadSource: "website",
      leadStatus: "new",
      taskTitle: "",
      taskDescription: "",
      taskDueDate: "",
      taskPriority: "medium",
      taskAssignee: "",
      taskType: "call",
      dealTitle: "",
      dealValue: "",
      dealStage: "new",
      dealCloseDate: "",
      dealContact: "",
      activityType: "call",
      activityDescription: "",
      activityContact: "",
      activityDate: "",
    })
    setIsQuickAddOpen(false)
  }

  // Export dashboard data as CSV - FIXED TO EXPORT USEFUL DATA IN CSV FORMAT
  const handleExport = () => {
    // Prepare leads data for CSV
    const leadsCSV = [
      ["Name", "Company", "Email", "Value", "Status", "Assignee", "Created Date"],
      ...filteredLeads.map((lead) => [
        lead.name,
        lead.company,
        `${lead.name.toLowerCase().replace(" ", ".")}@${lead.company.toLowerCase().replace(" ", "")}.com`,
        lead.value,
        lead.status,
        lead.assignee,
        lead.createdAt,
      ]),
    ]

    // Prepare tasks data for CSV
    const tasksCSV = [
      ["Task", "Priority", "Assignee", "Type", "Time", "Created Date"],
      ...filteredTasks.map((task) => [task.task, task.priority, task.assignee, task.type, task.time, task.createdAt]),
    ]

    // Convert to CSV format
    const convertToCSV = (data) => {
      return data.map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")
    }

    const leadsCSVContent = convertToCSV(leadsCSV)
    const tasksCSVContent = convertToCSV(tasksCSV)

    // Create and download leads CSV
    const leadsBlob = new Blob([leadsCSVContent], { type: "text/csv" })
    const leadsUrl = URL.createObjectURL(leadsBlob)
    const leadsLink = document.createElement("a")
    leadsLink.href = leadsUrl
    leadsLink.download = `leads-data-${new Date().toISOString().split("T")[0]}.csv`
    leadsLink.click()
    URL.revokeObjectURL(leadsUrl)

    // Create and download tasks CSV
    const tasksBlob = new Blob([tasksCSVContent], { type: "text/csv" })
    const tasksUrl = URL.createObjectURL(tasksBlob)
    const tasksLink = document.createElement("a")
    tasksLink.href = tasksUrl
    tasksLink.download = `tasks-data-${new Date().toISOString().split("T")[0]}.csv`
    tasksLink.click()
    URL.revokeObjectURL(tasksUrl)
  }

  // FIXED: Handle task completion - now actually updates the task state
  const handleCompleteTask = (taskId) => {
    setAllTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))

    const newActivity = {
      id: Date.now(),
      action: "Task completed",
      user: "You",
      time: "Just now",
      type: "task",
    }
    setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)])
  }

  // FIXED: Handle task deletion - now actually removes the task
  const handleDeleteTask = (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setAllTasks((prev) => prev.filter((task) => task.id !== taskId))

      const newActivity = {
        id: Date.now(),
        action: "Task deleted",
        user: "You",
        time: "Just now",
        type: "task",
      }
      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)])
    }
  }

  // NEW: Handle file attachment to tasks
  const handleAddAttachment = (taskId) => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = ".pdf,.doc,.docx,.txt,.jpg,.png,.xlsx,.csv"

    input.onchange = (e) => {
      const files = Array.from(e.target.files)
      if (files.length > 0) {
        setAllTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  attachments: [
                    ...task.attachments,
                    ...files.map((file) => ({
                      id: Date.now() + Math.random(),
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      uploadedAt: new Date().toISOString(),
                    })),
                  ],
                }
              : task,
          ),
        )

        const newActivity = {
          id: Date.now(),
          action: `${files.length} file(s) attached to task`,
          user: "You",
          time: "Just now",
          type: "task",
        }
        setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)])
      }
    }

    input.click()
  }

  // Quick actions for leads
  const handleCallLead = (lead) => {
    window.open(`tel:${lead.phone || "+91-9876543210"}`)

    const newActivity = {
      id: Date.now(),
      action: `Called ${lead.name}`,
      user: "You",
      time: "Just now",
      type: "call",
    }
    setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)])
  }

  const handleEmailLead = (lead) => {
    window.open(`mailto:${lead.email || "contact@example.com"}`)

    const newActivity = {
      id: Date.now(),
      action: `Emailed ${lead.name}`,
      user: "You",
      time: "Just now",
      type: "email",
    }
    setRecentActivities((prev) => [newActivity, ...prev.slice(0, 4)])
  }

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      qualified: "bg-orange-100 text-orange-800",
      proposal: "bg-purple-100 text-purple-800",
      won: "bg-green-100 text-green-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: "border-l-red-500 bg-red-50",
      medium: "border-l-yellow-500 bg-yellow-50",
      low: "border-l-green-500 bg-green-50",
    }
    return colors[priority] || "border-l-gray-500 bg-gray-50"
  }

  const getActivityIcon = (type) => {
    const icons = {
      lead: <User className="w-4 h-4" />,
      deal: <DollarSign className="w-4 h-4" />,
      task: <CheckCircle className="w-4 h-4" />,
      call: <Phone className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      meeting: <Calendar className="w-4 h-4" />,
      proposal: <FileText className="w-4 h-4" />,
    }
    return icons[type] || <Activity className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your sales.</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
                  showFilters ? "bg-blue-100 border-blue-300 text-blue-700" : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {Object.values(filters).some((value) => value !== "all") && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-2 h-2"></span>
                )}
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="bg-(--color-primary) text-(--color-bg) px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Quick Add
              </button>
            </div>
          </div>

          {/* Advanced Filters - NOW PROPERLY FUNCTIONAL */}
          {showFilters && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lead Status</label>
                  <select
                    value={filters.leadStatus}
                    onChange={(e) => setFilters({ ...filters, leadStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="won">Won</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <select
                    value={filters.assignee}
                    onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Assignees</option>
                    {teamMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filteredLeads.length} leads and {filteredTasks.length} tasks
                </div>
                <button
                  onClick={() => setFilters({ leadStatus: "all", assignee: "all", priority: "all", dateRange: "all" })}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Key Metrics - NOW UPDATES BASED ON FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">
                  {refreshing ? <RefreshCw className="w-8 h-8 animate-spin" /> : metrics.totalLeads}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{metrics.leadsGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {refreshing ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : (
                    `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`
                  )}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{metrics.revenueGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.conversionRate}%</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">{metrics.conversionGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Deals</p>
                <p className="text-3xl font-bold text-gray-900">
                  {refreshing ? <RefreshCw className="w-8 h-8 animate-spin" /> : metrics.activeDeals}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{metrics.dealsGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Pipeline - NOW UPDATES BASED ON FILTERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Pipeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Pipeline</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {pipelineData.map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{stage.count} leads</span>
                    <span className="text-sm font-semibold text-gray-900">₹{(stage.value / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Pipeline Value</span>
                <span className="font-semibold text-gray-900">
                  ₹{(pipelineData.reduce((sum, stage) => sum + stage.value, 0) / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {[65, 45, 78, 52, 89, 67, 94, 76, 85, 72, 91, 88].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Recent Activities and Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Leads - NOW SHOWS FILTERED DATA */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {filteredLeads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {lead.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">₹{(lead.value / 1000).toFixed(0)}K</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleCallLead(lead)}
                        className="p-1 text-green-600 hover:text-green-700"
                        title="Call"
                      >
                        <Phone className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEmailLead(lead)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                        title="Email"
                      >
                        <Mail className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="text-blue-600 mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
              <Star className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {performer.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                      <p className="text-xs text-gray-500">{performer.deals} deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹{(performer.revenue / 100000).toFixed(1)}L</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks - NOW SHOWS FILTERED DATA WITH WORKING DELETE AND ATTACHMENT FUNCTIONALITY */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Calendar</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border-l-4 ${getPriorityColor(task.priority)} relative group`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 pr-2">{task.task}</h4>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="p-1 text-green-600 hover:text-green-700"
                      title="Complete"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </button>
                 
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3" />
                  {task.time}
                </p>
                <p className="text-xs text-gray-500">Assigned to: {task.assignee}</p>

                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                  {task.priority === "high" && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {task.priority === "medium" && <Clock className="w-4 h-4 text-yellow-500" />}
                  {task.priority === "low" && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Add Modal */}
        {isQuickAddOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Quick Add</h2>
                <button onClick={() => setIsQuickAddOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Type Selector */}
              <div className="mb-6">
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {["lead", "task", "deal", "activity"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setQuickAddType(type)}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        quickAddType === type ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Form Based on Type */}
              <div className="space-y-4">
                {quickAddType === "lead" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          value={quickAddForm.leadName}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, leadName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter lead name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          value={quickAddForm.leadEmail}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, leadEmail: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          value={quickAddForm.leadPhone}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, leadPhone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          value={quickAddForm.leadCompany}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, leadCompany: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
                        <input
                          type="number"
                          value={quickAddForm.leadValue}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, leadValue: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter value in ₹"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={quickAddForm.leadStatus}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, leadStatus: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal">Proposal</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {quickAddType === "task" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                      <input
                        type="text"
                        value={quickAddForm.taskTitle}
                        onChange={(e) => setQuickAddForm({ ...quickAddForm, taskTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={quickAddForm.taskDescription}
                        onChange={(e) => setQuickAddForm({ ...quickAddForm, taskDescription: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Enter task description"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                          type="datetime-local"
                          value={quickAddForm.taskDueDate}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, taskDueDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          value={quickAddForm.taskPriority}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, taskPriority: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                        <select
                          value={quickAddForm.taskAssignee}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, taskAssignee: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select assignee</option>
                          {teamMembers.map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {quickAddType === "deal" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title *</label>
                        <input
                          type="text"
                          value={quickAddForm.dealTitle}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, dealTitle: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter deal title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value</label>
                        <input
                          type="number"
                          value={quickAddForm.dealValue}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, dealValue: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter value in ₹"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                        <select
                          value={quickAddForm.dealStage}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, dealStage: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal">Proposal</option>
                          <option value="won">Won</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
                        <input
                          type="date"
                          value={quickAddForm.dealCloseDate}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, dealCloseDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {quickAddType === "activity" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                        <select
                          value={quickAddForm.activityType}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, activityType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="call">Call</option>
                          <option value="email">Email</option>
                          <option value="meeting">Meeting</option>
                          <option value="proposal">Proposal</option>
                          <option value="follow-up">Follow-up</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                        <input
                          type="datetime-local"
                          value={quickAddForm.activityDate}
                          onChange={(e) => setQuickAddForm({ ...quickAddForm, activityDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        value={quickAddForm.activityDescription}
                        onChange={(e) => setQuickAddForm({ ...quickAddForm, activityDescription: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Describe the activity"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuickAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add {quickAddType.charAt(0).toUpperCase() + quickAddType.slice(1)}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard