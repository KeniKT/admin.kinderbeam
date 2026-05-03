"use client";
// ---------------------------------------------------------------
// src/app/dashboard/page.jsx  →  route: /dashboard
// Fully responsive dashboard with real API data for all sections.
// ---------------------------------------------------------------

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  FiArrowUpRight, FiUsers, FiUserCheck,
  FiCheckCircle, FiClock, FiXCircle, FiTrendingUp, FiShield, FiAlertCircle,
} from "react-icons/fi";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const PIE_COLORS = ["#00A3FF", "#A07060", "#1E3A5F", "#CAA897"];

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

// Returns "Mon", "Tue", etc. for a date
function getDayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}

// Returns "Jan", "Feb", etc. for a date
function getMonthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short" });
}

// Check if a date string is today
function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
}

// Check if a date string is within the last N days
function isWithinDays(dateStr, days) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now - d) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff < days;
}

// Check if a date string is within the current month
function isThisMonth(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

// Build weekly posts chart data (last 7 days, grouped by day)
function buildWeeklyPostsData(posts) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const map = {};
  days.forEach(d => { map[d] = { day: d, approved: 0, rejected: 0, pending: 0 }; });

  posts
    .filter(p => isWithinDays(p.created_at, 7))
    .forEach(p => {
      const day = getDayLabel(p.created_at);
      if (map[day]) {
        if (p.status === "approved") map[day].approved++;
        else if (p.status === "rejected") map[day].rejected++;
        else map[day].pending++;
      }
    });

  // Return in order starting from today going back 7 days
  const today = new Date().getDay();
  const ordered = [];
  for (let i = 6; i >= 0; i--) {
    const idx = (today - i + 7) % 7;
    ordered.push(map[days[idx]]);
  }
  return ordered;
}

// Build monthly emergencies chart data (this month, grouped by day of week)
function buildEmergencyData(emergencies) {
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const map = {
    "Week 1": { month: "Week 1", reported: 0, resolved: 0 },
    "Week 2": { month: "Week 2", reported: 0, resolved: 0 },
    "Week 3": { month: "Week 3", reported: 0, resolved: 0 },
    "Week 4": { month: "Week 4", reported: 0, resolved: 0 },
  };

  emergencies
    .filter(e => isThisMonth(e.reported_at))
    .forEach(e => {
      const day = new Date(e.reported_at).getDate();
      const week = day <= 7 ? "Week 1" : day <= 14 ? "Week 2" : day <= 21 ? "Week 3" : "Week 4";
      if (e.status === "resolved") map[week].resolved++;
      else map[week].reported++;
    });

  return weeks.map(w => map[w]);
}

// ---------------------------------------------------------------
// Reusable components
// ---------------------------------------------------------------
function StatCard({ icon: Icon, label, value, accent, loading }) {
  return (
    <div className="flex flex-col bg-light-cream rounded-xl p-4 gap-2 flex-1 min-w-0">
      <div className="flex flex-row justify-between items-start">
        <p className="text-xs font-semibold text-dark-cream uppercase tracking-widest">{label}</p>
        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: accent + "22" }}>
          <Icon size={14} style={{ color: accent }} />
        </div>
      </div>
      {loading ? (
        <div className="h-8 w-12 bg-cream rounded-lg animate-pulse" />
      ) : (
        <p className="text-3xl sm:text-4xl font-normal text-dark-blue">{value}</p>
      )}
    </div>
  );
}

function Badge({ label, color }) {
  const colors = {
    pending:  "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    reported: "bg-orange-100 text-orange-700",
    resolved: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${colors[color] || "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
}

function ActivityRow({ name, role, action, time, status }) {
  return (
    <div className="flex flex-row items-center justify-between py-3 border-b border-cream last:border-0 gap-2">
      <div className="flex flex-row items-center gap-2 min-w-0">
        <div className="size-8 rounded-full bg-cream flex items-center justify-center text-dark-blue font-bold text-xs shrink-0">
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-dark-blue truncate">{name}</p>
          <p className="text-xs text-dark-cream truncate">{role} · {action}</p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 shrink-0">
        <Badge label={status} color={status} />
        <p className="text-xs text-dark-cream hidden sm:block">{time}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, href }) {
  return (
    <div className="flex flex-row justify-between items-center mb-3">
      <p className="text-base sm:text-lg font-bold text-dark-blue">{title}</p>
      {href && (
        <Link href={href}>
          <div className="flex items-center gap-1 text-light-blue text-xs font-semibold hover:underline">
            View all <FiArrowUpRight size={13} />
          </div>
        </Link>
      )}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-cream rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs font-bold text-dark-cream uppercase mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------
// Page
// ---------------------------------------------------------------
export default function DashboardPage() {
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // User/student counts
  const [teachers,   setTeachers]   = useState(0);
  const [moderators, setModerators] = useState(0);
  const [parents,    setParents]    = useState(0);
  const [students,   setStudents]   = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(true);

  // Posts data
  const [posts,        setPosts]        = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Emergencies data
  const [emergencies,        setEmergencies]        = useState([]);
  const [loadingEmergencies, setLoadingEmergencies] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.push("/"); return; }
    fetchCounts(token);
    fetchPosts(token);
    fetchEmergencies(token);
  }, []);

  const fetchCounts = async (token) => {
    try {
      const [usersRes, studentsRes] = await Promise.all([
        fetch("/api/users",    { headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" } }),
        fetch("/api/students", { headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" } }),
      ]);
      if (usersRes.status === 401 || studentsRes.status === 401) {
        localStorage.clear(); router.push("/"); return;
      }
      if (usersRes.ok) {
        const users = await usersRes.json();
        setTeachers(users.filter(u => u.role_id === 1).length);
        setModerators(users.filter(u => u.role_id === 3).length);
        setParents(users.filter(u => u.role_id === 4).length);
      }
      if (studentsRes.ok) {
        const s = await studentsRes.json();
        setStudents(s.length);
      }
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    } finally {
      setLoadingCounts(false);
    }
  };

  const fetchPosts = async (token) => {
    try {
      const response = await fetch("/api/posts", {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      });
      if (response.ok) setPosts(await response.json());
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchEmergencies = async (token) => {
    try {
      const response = await fetch("/api/emergencies", {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      });
      if (response.ok) setEmergencies(await response.json());
    } catch (err) {
      console.error("Failed to fetch emergencies:", err);
    } finally {
      setLoadingEmergencies(false);
    }
  };

  // Computed values from real data
  const todayPosts     = posts.filter(p => isToday(p.created_at));
  const todayPending   = todayPosts.filter(p => p.status === "pending").length;
  const todayApproved  = todayPosts.filter(p => p.status === "approved").length;
  const todayRejected  = todayPosts.filter(p => p.status === "rejected").length;

  const thisMonthEmergencies = emergencies.filter(e => isThisMonth(e.reported_at));
  const reportedCount        = thisMonthEmergencies.filter(e => e.status === "reported").length;
  const resolvedCount        = thisMonthEmergencies.filter(e => e.status === "resolved").length;

  const weeklyPostsData  = buildWeeklyPostsData(posts);
  const emergencyData    = buildEmergencyData(emergencies);

  const profileData = [
    { name: "Teachers",   value: teachers   },
    { name: "Moderators", value: moderators },
    { name: "Parents",    value: parents    },
    { name: "Students",   value: students   },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-dark-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <p className="text-xs text-dark-cream font-semibold uppercase tracking-widest mb-1">Overview</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark-blue">Dashboard</h1>
            </div>
            <p className="text-xs sm:text-sm text-dark-cream font-medium">{today}</p>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard icon={FiUserCheck}  label="Teachers"   value={teachers}   accent="#00A3FF" loading={loadingCounts} />
            <StatCard icon={FiShield}     label="Moderators" value={moderators} accent="#A07060" loading={loadingCounts} />
            <StatCard icon={FiUsers}      label="Parents"    value={parents}    accent="#1E3A5F" loading={loadingCounts} />
            <StatCard icon={FiTrendingUp} label="Students"   value={students}   accent="#00A3FF" loading={loadingCounts} />
          </div>

          {/* Charts row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">

            {/* Weekly posts area chart — real data */}
            <div className="flex flex-col bg-cream rounded-2xl p-4 sm:p-5 flex-[2]">
              <SectionHeader title="Weekly Posts" />
              <div className="bg-light-cream rounded-xl p-3 sm:p-4">
                {loadingPosts ? (
                  <div className="h-[180px] flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-cream border-t-light-blue animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={weeklyPostsData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#00A3FF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00A3FF" stopOpacity={0}   />
                        </linearGradient>
                        <linearGradient id="gradRejected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#A07060" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#A07060" stopOpacity={0}   />
                        </linearGradient>
                        <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#CAA897" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#CAA897" stopOpacity={0}   />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F2EAE6" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#A07060", fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#A07060" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="approved" name="Approved" stroke="#00A3FF" strokeWidth={2} fill="url(#gradApproved)" dot={false} animationDuration={1200} />
                      <Area type="monotone" dataKey="rejected" name="Rejected" stroke="#A07060" strokeWidth={2} fill="url(#gradRejected)" dot={false} animationDuration={1400} />
                      <Area type="monotone" dataKey="pending"  name="Pending"  stroke="#CAA897" strokeWidth={2} fill="url(#gradPending)"  dot={false} animationDuration={1600} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                <div className="flex flex-row gap-4 mt-2 justify-center flex-wrap">
                  {[["Approved","#00A3FF"],["Rejected","#A07060"],["Pending","#CAA897"]].map(([name, color]) => (
                    <div key={name} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-xs font-semibold text-dark-cream">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Donut chart */}
            <div className="flex flex-col bg-cream rounded-2xl p-4 sm:p-5 flex-1">
              <SectionHeader title="User Distribution" />
              <div className="bg-light-cream rounded-xl p-3 sm:p-4 flex flex-col items-center">
                {loadingCounts ? (
                  <div className="w-full h-[140px] flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-cream border-t-light-blue animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={profileData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={1200}>
                        {profileData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="flex flex-col gap-1 w-full mt-1">
                  {profileData.map((d, i) => (
                    <div key={d.name} className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                        <p className="text-xs font-semibold text-dark-cream">{d.name}</p>
                      </div>
                      <p className="text-xs font-bold text-dark-blue">{loadingCounts ? "—" : d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">

            {/* Posts today — real data */}
            <div className="flex flex-col bg-cream rounded-2xl p-4 sm:p-5 flex-1">
              <SectionHeader title="Posts Today" href="#" />
              <div className="flex flex-col bg-light-cream rounded-xl p-4 gap-3">
                {loadingPosts ? (
                  <div className="h-24 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-4 border-cream border-t-light-blue animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-row items-end gap-2">
                      <p className="text-5xl sm:text-6xl font-normal text-dark-cream">{todayPosts.length}</p>
                      <p className="text-base sm:text-lg pb-2 text-dark-blue font-semibold">Total</p>
                    </div>
                    <div className="flex flex-row gap-2">
                      <div className="flex flex-col flex-1 items-center bg-cream rounded-xl p-3 gap-1">
                        <FiClock size={16} className="text-yellow-500" />
                        <p className="text-xl font-normal text-dark-blue">{todayPending}</p>
                        <p className="text-xs font-semibold text-dark-cream">Pending</p>
                      </div>
                      <div className="flex flex-col flex-1 items-center bg-cream rounded-xl p-3 gap-1">
                        <FiCheckCircle size={16} className="text-green-500" />
                        <p className="text-xl font-normal text-dark-blue">{todayApproved}</p>
                        <p className="text-xs font-semibold text-dark-cream">Approved</p>
                      </div>
                      <div className="flex flex-col flex-1 items-center bg-cream rounded-xl p-3 gap-1">
                        <FiXCircle size={16} className="text-red-400" />
                        <p className="text-xl font-normal text-dark-blue">{todayRejected}</p>
                        <p className="text-xs font-semibold text-dark-cream">Rejected</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Emergencies this month — real data */}
            <div className="flex flex-col bg-cream rounded-2xl p-4 sm:p-5 flex-1">
              <SectionHeader title="Emergencies (This Month)" href="#" />
              <div className="bg-light-cream rounded-xl p-3 sm:p-4">
                {loadingEmergencies ? (
                  <div className="h-[130px] flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-4 border-cream border-t-light-blue animate-spin" />
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={130}>
                      <BarChart data={emergencyData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }} barSize={9}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F2EAE6" />
                        <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#A07060", fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: "#A07060" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="reported" name="Reported" fill="#F97316" radius={[4,4,0,0]} animationDuration={1200} />
                        <Bar dataKey="resolved" name="Resolved" fill="#00A3FF" radius={[4,4,0,0]} animationDuration={1400} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex flex-row gap-4 mt-2 justify-center">
                      {[["Reported","#F97316"],["Resolved","#00A3FF"]].map(([name, color]) => (
                        <div key={name} className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                          <p className="text-xs font-semibold text-dark-cream">{name}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* Summary counts */}
              {!loadingEmergencies && (
                <div className="flex flex-row gap-3 mt-3">
                  <div className="flex flex-col flex-1 items-center bg-light-cream rounded-xl p-3 gap-1">
                    <FiAlertCircle size={16} className="text-orange-500" />
                    <p className="text-xl font-normal text-dark-blue">{reportedCount}</p>
                    <p className="text-xs font-semibold text-dark-cream">Reported</p>
                  </div>
                  <div className="flex flex-col flex-1 items-center bg-light-cream rounded-xl p-3 gap-1">
                    <FiCheckCircle size={16} className="text-blue-400" />
                    <p className="text-xl font-normal text-dark-blue">{resolvedCount}</p>
                    <p className="text-xs font-semibold text-dark-cream">Resolved</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="flex flex-col bg-cream rounded-2xl p-4 sm:p-5 lg:w-52">
              <SectionHeader title="Quick Links" />
              <div className="flex flex-col gap-2">
                <Link href="/accounts/new">
                  <div className="flex flex-row items-center justify-between bg-light-blue text-white rounded-xl px-4 py-3 hover:bg-light-blue/90 transition-colors cursor-pointer">
                    <p className="text-sm font-semibold">Add Account</p>
                    <FiArrowUpRight size={15} />
                  </div>
                </Link>
                <Link href="/students/new">
                  <div className="flex flex-row items-center justify-between bg-dark-blue text-white rounded-xl px-4 py-3 hover:bg-dark-blue/90 transition-colors cursor-pointer">
                    <p className="text-sm font-semibold">Add Student</p>
                    <FiArrowUpRight size={15} />
                  </div>
                </Link>
                <Link href="/accounts">
                  <div className="flex flex-row items-center justify-between bg-light-cream border border-medium-cream text-dark-blue rounded-xl px-4 py-3 hover:bg-cream transition-colors cursor-pointer">
                    <p className="text-sm font-semibold">All Accounts</p>
                    <FiArrowUpRight size={15} />
                  </div>
                </Link>
                <Link href="/students">
                  <div className="flex flex-row items-center justify-between bg-light-cream border border-medium-cream text-dark-blue rounded-xl px-4 py-3 hover:bg-cream transition-colors cursor-pointer">
                    <p className="text-sm font-semibold">All Students</p>
                    <FiArrowUpRight size={15} />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent posts activity */}
          <div className="flex flex-col bg-cream rounded-2xl p-4 sm:p-5">
            <SectionHeader title="Recent Posts" href="#" />
            <div className="flex flex-col bg-light-cream rounded-xl px-4">
              {loadingPosts ? (
                <div className="py-8 text-center text-dark-cream text-sm">Loading...</div>
              ) : posts.length === 0 ? (
                <div className="py-8 text-center text-dark-cream text-sm italic">No posts yet</div>
              ) : (
                posts
                  .slice()
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .slice(0, 5)
                  .map((post) => (
                    <ActivityRow
                      key={post.post_id}
                      name={`Teacher #${post.teacher_id}`}
                      role="Teacher"
                      action={post.caption_text?.slice(0, 40) || "Posted an activity"}
                      time={new Date(post.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      status={post.status}
                    />
                  ))
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}