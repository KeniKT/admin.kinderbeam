"use client";
// ---------------------------------------------------------------
// src/app/dashboard/page.jsx  →  route: /dashboard
// Main dashboard with overview stats, animated charts, and recent activity.
// ---------------------------------------------------------------

import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  FiArrowUpRight, FiUsers, FiUserCheck, FiAlertCircle,
  FiCheckCircle, FiClock, FiXCircle, FiTrendingUp, FiShield,
} from "react-icons/fi";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ---------------------------------------------------------------
// Chart mock data
// ---------------------------------------------------------------
const weeklyPostsData = [
  { day: "Mon", accepted: 8,  rejected: 2, pending: 4 },
  { day: "Tue", accepted: 14, rejected: 3, pending: 2 },
  { day: "Wed", accepted: 6,  rejected: 1, pending: 1 },
  { day: "Thu", accepted: 18, rejected: 4, pending: 2 },
  { day: "Fri", accepted: 11, rejected: 2, pending: 2 },
  { day: "Sat", accepted: 5,  rejected: 1, pending: 0 },
  { day: "Sun", accepted: 9,  rejected: 2, pending: 7 },
];

const emergencyData = [
  { month: "Jan", active: 3,  resolved: 5  },
  { month: "Feb", active: 1,  resolved: 8  },
  { month: "Mar", active: 4,  resolved: 6  },
  { month: "Apr", active: 2,  resolved: 9  },
  { month: "May", active: 5,  resolved: 7  },
  { month: "Jun", active: 1,  resolved: 12 },
];

const profileData = [
  { name: "Teachers",   value: 12  },
  { name: "Moderators", value: 4   },
  { name: "Parents",    value: 38  },
  { name: "Students",   value: 124 },
];

const PIE_COLORS = ["#00A3FF", "#A07060", "#1E3A5F", "#CAA897"];

// ---------------------------------------------------------------
// Reusable components
// ---------------------------------------------------------------
function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex flex-col bg-light-cream rounded-xl p-4 gap-3 flex-1">
      <div className="flex flex-row justify-between items-start">
        <p className="text-sm font-semibold text-dark-cream uppercase tracking-widest">{label}</p>
        <div className="p-2 rounded-lg" style={{ backgroundColor: accent + "22" }}>
          <Icon size={16} style={{ color: accent }} />
        </div>
      </div>
      <p className="text-4xl font-normal text-dark-blue">{value}</p>
    </div>
  );
}

function Badge({ label, color }) {
  const colors = {
    pending:  "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    active:   "bg-orange-100 text-orange-700",
    resolved: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[color]}`}>
      {label}
    </span>
  );
}

function ActivityRow({ name, role, action, time, status }) {
  return (
    <div className="flex flex-row items-center justify-between py-3 border-b border-cream last:border-0">
      <div className="flex flex-row items-center gap-3">
        <div className="size-9 rounded-full bg-cream flex items-center justify-center text-dark-blue font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-dark-blue">{name}</p>
          <p className="text-xs text-dark-cream">{role} · {action}</p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-3">
        <Badge label={status} color={status} />
        <p className="text-xs text-dark-cream w-16 text-right">{time}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, href }) {
  return (
    <div className="flex flex-row justify-between items-center mb-3">
      <p className="text-lg font-bold text-dark-blue">{title}</p>
      {href && (
        <Link href={href}>
          <div className="flex items-center gap-1 text-light-blue text-xs font-semibold hover:underline">
            View all <FiArrowUpRight size={14} />
          </div>
        </Link>
      )}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-cream rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-bold text-dark-cream uppercase mb-2">{label}</p>
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
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-dark-blue">
        <div className="max-w-6xl mx-auto px-8 py-8">

          {/* Page header */}
          <div className="flex flex-row justify-between items-end mb-8">
            <div>
              <p className="text-sm text-dark-cream font-semibold uppercase tracking-widest mb-1">Overview</p>
              <h1 className="text-4xl font-bold text-dark-blue">Dashboard</h1>
            </div>
            <p className="text-sm text-dark-cream font-medium">{today}</p>
          </div>

          {/* Top stat strip */}
          <div className="flex flex-row gap-4 mb-6">
            <StatCard icon={FiUserCheck}  label="Teachers"   value="12"  accent="#00A3FF" />
            <StatCard icon={FiShield}     label="Moderators" value="4"   accent="#A07060" />
            <StatCard icon={FiUsers}      label="Parents"    value="38"  accent="#1E3A5F" />
            <StatCard icon={FiTrendingUp} label="Students"   value="124" accent="#00A3FF" />
          </div>

          {/* Charts row */}
          <div className="flex flex-row gap-4 mb-6">

            {/* Weekly posts area chart */}
            <div className="flex flex-col bg-cream rounded-2xl p-5 flex-[2]">
              <SectionHeader title="Weekly Posts" />
              <div className="bg-light-cream rounded-xl p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={weeklyPostsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradAccepted" x1="0" y1="0" x2="0" y2="1">
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
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#A07060", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#A07060" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="accepted" name="Accepted" stroke="#00A3FF" strokeWidth={2} fill="url(#gradAccepted)" dot={false} animationDuration={1200} />
                    <Area type="monotone" dataKey="rejected" name="Rejected" stroke="#A07060" strokeWidth={2} fill="url(#gradRejected)" dot={false} animationDuration={1400} />
                    <Area type="monotone" dataKey="pending"  name="Pending"  stroke="#CAA897" strokeWidth={2} fill="url(#gradPending)"  dot={false} animationDuration={1600} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex flex-row gap-4 mt-2 justify-center">
                  {[["Accepted","#00A3FF"],["Rejected","#A07060"],["Pending","#CAA897"]].map(([name, color]) => (
                    <div key={name} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-xs font-semibold text-dark-cream">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile distribution donut chart */}
            <div className="flex flex-col bg-cream rounded-2xl p-5 flex-1">
              <SectionHeader title="User Distribution" />
              <div className="bg-light-cream rounded-xl p-4 flex flex-col items-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={profileData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1200}
                    >
                      {profileData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1 w-full mt-1">
                  {profileData.map((d, i) => (
                    <div key={d.name} className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                        <p className="text-xs font-semibold text-dark-cream">{d.name}</p>
                      </div>
                      <p className="text-xs font-bold text-dark-blue">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle row */}
          <div className="flex flex-row gap-4 mb-6">

            {/* Posts today */}
            <div className="flex flex-col bg-cream rounded-2xl p-5 flex-1">
              <SectionHeader title="Posts Today" href="#" />
              <div className="flex flex-col bg-light-cream rounded-xl p-4 gap-4">
                <div className="flex flex-row items-end gap-2">
                  <p className="text-6xl font-normal text-dark-cream">18</p>
                  <p className="text-lg pb-2 text-dark-blue font-semibold">Total Posts</p>
                </div>
                <div className="flex flex-row gap-3">
                  <div className="flex flex-col flex-1 items-center bg-cream rounded-xl p-3 gap-1">
                    <FiClock size={18} className="text-yellow-500" />
                    <p className="text-2xl font-normal text-dark-blue">7</p>
                    <p className="text-xs font-semibold text-dark-cream">Pending</p>
                  </div>
                  <div className="flex flex-col flex-1 items-center bg-cream rounded-xl p-3 gap-1">
                    <FiCheckCircle size={18} className="text-green-500" />
                    <p className="text-2xl font-normal text-dark-blue">9</p>
                    <p className="text-xs font-semibold text-dark-cream">Accepted</p>
                  </div>
                  <div className="flex flex-col flex-1 items-center bg-cream rounded-xl p-3 gap-1">
                    <FiXCircle size={18} className="text-red-400" />
                    <p className="text-2xl font-normal text-dark-blue">2</p>
                    <p className="text-xs font-semibold text-dark-cream">Rejected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergencies bar chart */}
            <div className="flex flex-col bg-cream rounded-2xl p-5 flex-1">
              <SectionHeader title="Emergencies (6 months)" href="#" />
              <div className="bg-light-cream rounded-xl p-4">
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={emergencyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }} barSize={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F2EAE6" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#A07060", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#A07060" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="active"   name="Active"   fill="#F97316" radius={[4,4,0,0]} animationDuration={1200} />
                    <Bar dataKey="resolved" name="Resolved" fill="#00A3FF" radius={[4,4,0,0]} animationDuration={1400} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-row gap-4 mt-2 justify-center">
                  {[["Active","#F97316"],["Resolved","#00A3FF"]].map(([name, color]) => (
                    <div key={name} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <p className="text-xs font-semibold text-dark-cream">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-col bg-cream rounded-2xl p-5 w-56">
              <SectionHeader title="Quick Links" />
              <div className="flex flex-col gap-2">
                <Link href="/accounts/new">
                  <div className="flex flex-row items-center justify-between bg-light-blue text-white rounded-xl px-4 py-3 hover:bg-light-blue/90 transition-colors cursor-pointer">
                    <p className="text-sm font-semibold">Add Account</p>
                    <FiArrowUpRight size={16} />
                  </div>
                </Link>
                <Link href="/students/new">
                  <div className="flex flex-row items-center justify-between bg-dark-blue text-white rounded-xl px-4 py-3 hover:bg-dark-blue/90 transition-colors cursor-pointer">
                    <p className="text-sm font-semibold">Add Student</p>
                    <FiArrowUpRight size={16} />
                  </div>
                </Link>
                <Link href="/accounts">
                  <div className="flex flex-row items-center justify-between bg-light-cream border border-medium-cream text-dark-blue rounded-xl px-4 py-3 hover:bg-cream transition-colors cursor-pointer">
                    <p className="text-sm font-semibold">All Accounts</p>
                    <FiArrowUpRight size={16} />
                  </div>
                </Link>
                <Link href="/students">
                  <div className="flex flex-row items-center justify-between bg-light-cream border border-medium-cream text-dark-blue rounded-xl px-4 py-3 hover:bg-cream transition-colors cursor-pointer">
                    <p className="text-sm font-semibold">All Students</p>
                    <FiArrowUpRight size={16} />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent activity feed */}
          <div className="flex flex-col bg-cream rounded-2xl p-5">
            <SectionHeader title="Recent Activity" href="#" />
            <div className="flex flex-col bg-light-cream rounded-xl px-4">
              <ActivityRow name="Sara Tesfaye"   role="Parent"    action="Submitted a post"  time="2m ago"  status="pending"  />
              <ActivityRow name="Abebe Kebede"   role="Teacher"   action="Post approved"      time="14m ago" status="accepted" />
              <ActivityRow name="Mulugeta Haile" role="Moderator" action="Resolved emergency" time="1h ago"  status="resolved" />
              <ActivityRow name="Tigist Belay"   role="Teacher"   action="Post rejected"      time="2h ago"  status="rejected" />
              <ActivityRow name="Dawit Yohannes" role="Parent"    action="Reported emergency" time="3h ago"  status="active"   />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}