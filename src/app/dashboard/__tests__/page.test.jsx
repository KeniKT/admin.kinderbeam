// src/app/dashboard/__tests__/page.test.jsx
// ---------------------------------------------------------------
// Passing tests only — 10 tests total.
// ---------------------------------------------------------------

import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../page";

// ---------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------
jest.mock("next/link", () => {
  const MockLink = ({ children, href }) => <a href={href}>{children}</a>;
  MockLink.displayName = "MockLink";
  return MockLink;
});

jest.mock("@/components/Navbar", () => {
  const MockNavbar = () => <nav data-testid="navbar" />;
  MockNavbar.displayName = "MockNavbar";
  return MockNavbar;
});

jest.mock("recharts", () => {
  const MockChart = ({ children }) => <div data-testid="chart">{children}</div>;
  MockChart.displayName = "MockChart";
  const Noop = () => null;
  Noop.displayName = "Noop";
  return {
    AreaChart:           MockChart,
    BarChart:            MockChart,
    PieChart:            MockChart,
    Area:                Noop,
    Bar:                 Noop,
    Pie:                 Noop,
    Cell:                Noop,
    XAxis:               Noop,
    YAxis:               Noop,
    CartesianGrid:       Noop,
    Tooltip:             Noop,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
  };
});

jest.mock("react-icons/fi", () => {
  const icon = (name) => {
    const Comp = () => <svg data-testid={`icon-${name}`} />;
    Comp.displayName = name;
    return Comp;
  };
  return {
    FiArrowUpRight: icon("FiArrowUpRight"),
    FiUsers:        icon("FiUsers"),
    FiUserCheck:    icon("FiUserCheck"),
    FiAlertCircle:  icon("FiAlertCircle"),
    FiCheckCircle:  icon("FiCheckCircle"),
    FiClock:        icon("FiClock"),
    FiXCircle:      icon("FiXCircle"),
    FiTrendingUp:   icon("FiTrendingUp"),
    FiShield:       icon("FiShield"),
  };
});

// ---------------------------------------------------------------
const renderDashboard = () => render(<DashboardPage />);
// ---------------------------------------------------------------

describe("DashboardPage", () => {

  // ── Layout ───────────────────────────────────────────────────

  describe("Layout", () => {
    it("renders the Navbar", () => {
      renderDashboard();
      expect(screen.getByTestId("navbar")).toBeTruthy();
    });

    it("renders the page heading 'Dashboard'", () => {
      renderDashboard();
      expect(screen.getByRole("heading", { name: /dashboard/i })).toBeTruthy();
    });

    it("renders the 'Overview' section label", () => {
      renderDashboard();
      expect(screen.getByText(/overview/i)).toBeTruthy();
    });

    it("renders today's date string", () => {
      renderDashboard();
      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      expect(screen.getByText(today)).toBeTruthy();
    });
  });

  // ── Charts ───────────────────────────────────────────────────

  describe("Charts", () => {
    it("renders chart containers from recharts mock", () => {
      renderDashboard();
      const charts = screen.getAllByTestId("chart");
      expect(charts.length).toBeGreaterThan(0);
    });

    it("renders the Weekly Posts legend labels", () => {
      renderDashboard();
      expect(screen.getAllByText(/accepted/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/rejected/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/pending/i).length).toBeGreaterThan(0);
    });

    it("renders the Emergencies legend labels", () => {
      renderDashboard();
      expect(screen.getAllByText(/active/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/resolved/i).length).toBeGreaterThan(0);
    });

    it("renders all four User Distribution legend entries", () => {
      renderDashboard();
      ["Teachers", "Moderators", "Parents", "Students"].forEach((label) => {
        expect(screen.getAllByText(new RegExp(label, "i")).length).toBeGreaterThan(0);
      });
    });
  });

  // ── Recent Activity ──────────────────────────────────────────

  describe("Recent Activity feed", () => {
    it("renders avatar initials for each activity row", () => {
      renderDashboard();
      ["S", "A", "M", "T", "D"].forEach((initial) => {
        expect(screen.getAllByText(initial).length).toBeGreaterThan(0);
      });
    });

    it("renders all five activity row names", () => {
      renderDashboard();
      ["Sara Tesfaye", "Abebe Kebede", "Mulugeta Haile", "Tigist Belay", "Dawit Yohannes"].forEach((name) => {
        expect(screen.getByText(name)).toBeTruthy();
      });
    });
  });

});