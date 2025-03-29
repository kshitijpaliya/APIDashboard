// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Activity,
//   AlertCircle,
//   BarChart3,
//   Calendar,
//   CheckCircle,
//   Download,
//   LineChart as LineChartIcon,
//   LogOut,
//   Settings,
//   User,
//   XCircle,
// } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
// } from "recharts";
// import { format } from "date-fns";

// export default function DashboardPage({ user }) {
//   const router = useRouter();
//   const [usage, setUsage] = useState([]);
//   const [timeFilter, setTimeFilter] = useState("week");
//   const [isLoading, setIsLoading] = useState(true);

//   // Process usage data and calculate stats
//   const processedUsage = usage.map((item) => ({
//     ...item,
//     date: item.date instanceof Date ? item.date : new Date(item.date),
//   }));

//   const stats = {
//     totalRequests: processedUsage.reduce(
//       (sum, item) => sum + item.totalRequests,
//       0
//     ),
//     successfulRequests: processedUsage.reduce(
//       (sum, item) => sum + item.successfulRequests,
//       0
//     ),
//     failedRequests: processedUsage.reduce(
//       (sum, item) => sum + item.failedRequests,
//       0
//     ),
//   };

//   const errorRate =
//     stats.totalRequests > 0
//       ? (stats.failedRequests / stats.totalRequests) * 100
//       : 0;
//   const showWarning = errorRate > 10;

//   useEffect(() => {
//     const fetchUsageData = async () => {
//       try {
//         const token = sessionStorage.getItem("authToken");
//         const response = await fetch(`/api/usage/${user.brandId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch usage data");
//         }

//         const data = await response.json();
//         console.log("Fetched usage data:", data);
//         // Transform data to ensure proper date objects
//         const transformedData = data.map((item) => ({
//           ...item,
//           date: item.date ? new Date(item.date) : new Date(), // Fallback to current date if missing
//         }));
//         console.log("Transformed usage data:", transformedData);
//         setUsage(transformedData);
//       } catch (error) {
//         console.error("Error fetching usage data:", error);
//         router.push("/login");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUsageData();
//   }, [user.brandId, router, timeFilter]);

//   const handleLogout = () => {
//     sessionStorage.removeItem("authToken");
//     sessionStorage.removeItem("currentUser");
//     router.push("/login");
//   };

//   const handleTimeFilterChange = (value) => {
//     setTimeFilter(value);
//   };

//   const exportToCSV = () => {
//     const csvRows = [
//       [
//         "Date",
//         "Total Requests",
//         "Successful Requests",
//         "Failed Requests",
//         "Error Rate",
//       ],
//       ...processedUsage.map((item) => [
//         format(item.date, "yyyy-MM-dd"),
//         item.total_requests,
//         item.successful_requests,
//         item.failed_requests,
//         `${item.errorRate?.toFixed(2) || 0}%`,
//       ]),
//     ];
//     const csvContent = csvRows.map((row) => row.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `api_usage_${user.brand}_${format(
//       new Date(),
//       "yyyyMMdd"
//     )}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold">Loading dashboard...</h2>
//           <p className="text-muted-foreground">
//             Please wait while we fetch your data!
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen flex-col">
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-14 items-center justify-between">
//           <div className="flex items-center gap-2">
//             <BarChart3 className="h-6 w-6" />
//             <span className="font-bold">API Dashboard</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div>
//               <h1>Welcome! {user.name}</h1>
//             </div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="rounded-full">
//                   <User className="h-5 w-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>User {user.name}</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <Settings className="mr-2 h-4 w-4" />
//                   Settings
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={handleLogout}>
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Logout
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>
//       <main className="flex-1 space-y-4 p-4 md:p-8">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">API Usage Dashboard</h1>
//           <Button variant="outline" size="sm" onClick={exportToCSV}>
//             <Download className="mr-2 h-4 w-4" />
//             Export Report
//           </Button>
//         </div>

//         {showWarning && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Warning</AlertTitle>
//             <AlertDescription>
//               Your API error rate is {errorRate.toFixed(1)}%, which exceeds the
//               recommended threshold of 10%.
//             </AlertDescription>
//           </Alert>
//         )}

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-bold">
//                 Total API Calls
//               </CardTitle>
//               <Activity className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {stats.totalRequests.toLocaleString()}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 +{Math.floor(Math.random() * 20)}% from last month
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Successful Calls
//               </CardTitle>
//               <CheckCircle className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {stats.successfulRequests.toLocaleString()}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {stats.totalRequests > 0
//                   ? (
//                       (stats.successfulRequests / stats.totalRequests) *
//                       100
//                     ).toFixed(1)
//                   : 0}
//                 % success rate
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Failed Calls
//               </CardTitle>
//               <XCircle className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {stats.failedRequests.toLocaleString()}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {errorRate.toFixed(1)}% error rate
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Average Daily Calls
//               </CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {processedUsage.length > 0
//                   ? Math.round(
//                       stats.totalRequests / processedUsage.length
//                     ).toLocaleString()
//                   : 0}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Over the past {timeFilter}
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//           <Card className="col-span-4">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>API Usage Trends</CardTitle>
//                 <Tabs
//                   defaultValue="week"
//                   onValueChange={handleTimeFilterChange}
//                 >
//                   <TabsList>
//                     <TabsTrigger value="week">Week</TabsTrigger>
//                     <TabsTrigger value="month">Month</TabsTrigger>
//                     <TabsTrigger value="year">Year</TabsTrigger>
//                   </TabsList>
//                 </Tabs>
//               </div>
//               <CardDescription>Daily API requests over time</CardDescription>
//             </CardHeader>
//             <CardContent className="pl-2">
//               <div className="h-[300px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={processedUsage}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis
//                       dataKey="date"
//                       tickFormatter={(date) => format(date, "MMM d")}
//                     />
//                     <YAxis />
//                     <Tooltip
//                       labelFormatter={(date) => format(date, "MMM d, yyyy")}
//                       formatter={(value) => [
//                         value,
//                         value === value ? "Count" : "",
//                       ]}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="successful_requests"
//                       stroke="#4ade80"
//                       name="Successful"
//                       strokeWidth={2}
//                       dot={false}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="failed_requests"
//                       stroke="#ef4444"
//                       name="Failed"
//                       strokeWidth={2}
//                       dot={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="col-span-3">
//             <CardHeader>
//               <CardTitle>Success vs. Failure</CardTitle>
//               <CardDescription>
//                 Distribution of API call outcomes
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[300px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={[
//                         { name: "Successful", value: stats.successfulRequests },
//                         { name: "Failed", value: stats.failedRequests },
//                       ]}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={100}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) =>
//                         `${name} ${(percent * 100).toFixed(0)}%`
//                       }
//                     >
//                       <Cell key="cell-success" fill="#4ade80" />
//                       <Cell key="cell-failed" fill="#ef4444" />
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>API Requests by Day</CardTitle>
//             <CardDescription>Breakdown of daily API usage</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={processedUsage}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="date"
//                     tickFormatter={(date) => format(date, "MMM d")}
//                   />
//                   <YAxis />
//                   <Tooltip
//                     labelFormatter={(date) => format(date, "MMM d, yyyy")}
//                     formatter={(value) => [value, "Requests"]}
//                   />
//                   <Bar
//                     dataKey="total_requests"
//                     name="Total Requests"
//                     fill="#8884d8"
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Download,
  LogOut,
  Settings,
  User,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { format } from "date-fns";

export default function DashboardPage({ user }) {
  const router = useRouter();
  const [usage, setUsage] = useState([]);
  const [timeFilter, setTimeFilter] = useState("week");
  const [isLoading, setIsLoading] = useState(true);

  // Process and filter data based on timeFilter
  const processData = (data) => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeFilter) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setDate(now.getDate() - 7);
    }

    return data
      .map((item) => ({
        ...item,
        date: new Date(item.date),
      }))
      .filter((item) => item.date >= cutoffDate)
      .sort((a, b) => a.date - b.date);
  };

  const processedUsage = processData(usage);

  // Calculate statistics
  const stats = {
    totalRequests: processedUsage.reduce(
      (sum, item) => sum + item.totalRequests,
      0
    ),
    successfulRequests: processedUsage.reduce(
      (sum, item) => sum + item.successfulRequests,
      0
    ),
    failedRequests: processedUsage.reduce(
      (sum, item) => sum + item.failedRequests,
      0
    ),
  };

  const errorRate =
    stats.totalRequests > 0
      ? (stats.failedRequests / stats.totalRequests) * 100
      : 0;
  const showWarning = errorRate > 10;

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(`/api/usage/${user.brandId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch usage data");
        }

        const data = await response.json();
        setUsage(data);
      } catch (error) {
        console.error("Error fetching usage data:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageData();
  }, [user.brandId, router]);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("currentUser");
    router.push("/login");
  };

  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
  };

  const exportToCSV = () => {
    const csvRows = [
      [
        "Date",
        "Total Requests",
        "Successful Requests",
        "Failed Requests",
        "Error Rate",
      ],
      ...processedUsage.map((item) => [
        format(item.date, "yyyy-MM-dd"),
        item.totalRequests,
        item.successfulRequests,
        item.failedRequests,
        `${item.errorRate?.toFixed(2) || 0}%`,
      ]),
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `api_usage_${user.brand}_${format(
      new Date(),
      "yyyyMMdd"
    )}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading dashboard...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your data!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="font-bold">API Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <h1>Welcome! {user.name}</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>User {user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">API Usage Dashboard</h1>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {showWarning && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Your API error rate is {errorRate.toFixed(1)}%, which exceeds the
              recommended threshold of 10%.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold">
                Total API Calls
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalRequests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 20)}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Successful Calls
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.successfulRequests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalRequests > 0
                  ? (
                      (stats.successfulRequests / stats.totalRequests) *
                      100
                    ).toFixed(1)
                  : 0}
                % success rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Calls
              </CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.failedRequests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {errorRate.toFixed(1)}% error rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Daily Calls
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {processedUsage.length > 0
                  ? Math.round(
                      stats.totalRequests / processedUsage.length
                    ).toLocaleString()
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Over the past {timeFilter}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Usage Trends</CardTitle>
                <Tabs
                  defaultValue="week"
                  onValueChange={handleTimeFilterChange}
                >
                  <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>Daily API requests over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processedUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(date, "MMM d")}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => format(date, "MMM d, yyyy")}
                      formatter={(value, name) => [
                        value,
                        name === "successfulRequests" ? "Successful" : "Failed",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="successfulRequests"
                      stroke="#4ade80"
                      name="Successful"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="failedRequests"
                      stroke="#ef4444"
                      name="Failed"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Success vs. Failure</CardTitle>
              <CardDescription>
                Distribution of API call outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart data={processedUsage}>
                    <Pie
                      data={[
                        { name: "Successful", value: stats.successfulRequests },
                        { name: "Failed", value: stats.failedRequests },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell key="cell-success" fill="#4ade80" />
                      <Cell key="cell-failed" fill="#ef4444" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Requests by Day</CardTitle>
            <CardDescription>Breakdown of daily API usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(date, "MMM d")}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => format(date, "MMM d, yyyy")}
                    formatter={(value) => [value, "Requests"]}
                  />
                  <Bar
                    dataKey="totalRequests"
                    name="Total Requests"
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
