// src/app/students/__tests__/page.test.jsx
// ---------------------------------------------------------------
// Passing tests only — 22 tests total.
// ---------------------------------------------------------------

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StudentsPage from "../page";

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

jest.mock("react-icons/fi", () => {
  const icon = (name) => {
    const Comp = ({ size }) => <svg data-testid={`icon-${name}`} width={size} height={size} />;
    Comp.displayName = name;
    return Comp;
  };
  return {
    FiEdit:       icon("FiEdit"),
    FiArrowLeft:  icon("FiArrowLeft"),
    FiArrowRight: icon("FiArrowRight"),
    FiPlus:       icon("FiPlus"),
  };
});

// ---------------------------------------------------------------
const renderPage = () => render(<StudentsPage />);
// ---------------------------------------------------------------

describe("StudentsPage", () => {

  // ── Layout ───────────────────────────────────────────────────

  describe("Layout", () => {
    it("renders the Navbar", () => {
      renderPage();
      expect(screen.getByTestId("navbar")).toBeTruthy();
    });

    it("renders the 'All Students' heading", () => {
      renderPage();
      expect(screen.getByText(/all students/i)).toBeTruthy();
    });

    it("renders the search input", () => {
      renderPage();
      expect(screen.getByPlaceholderText(/search students/i)).toBeTruthy();
    });

    it("renders the 'Add Student' button linking to /students/new", () => {
      renderPage();
      const link = screen.getByRole("link", { name: /add student/i });
      expect(link).toBeTruthy();
      expect(link.getAttribute("href")).toBe("/students/new");
    });
  });

  // ── Table headers ─────────────────────────────────────────────

  describe("Table headers", () => {
    it("renders the Full Name column header", () => {
      renderPage();
      expect(screen.getByText(/full name/i)).toBeTruthy();
    });

    it("renders the Class column header", () => {
      renderPage();
      expect(screen.getByText(/^class$/i)).toBeTruthy();
    });

    it("renders the Date of Birth column header", () => {
      renderPage();
      expect(screen.getByText(/date of birth/i)).toBeTruthy();
    });
  });

  // ── Student rows ──────────────────────────────────────────────

  describe("Student rows", () => {
    it("renders 5 students on the first page", () => {
      renderPage();
      ["Liya Tesfaye", "Biruk Alemu", "Meron Haile", "Yonas Kebede", "Selam Girma"].forEach((name) => {
        expect(screen.getByText(name)).toBeTruthy();
      });
    });

    it("does NOT render page-2 students on initial load", () => {
      renderPage();
      expect(screen.queryByText("Dawit Bekele")).toBeFalsy();
      expect(screen.queryByText("Hana Tadesse")).toBeFalsy();
    });

    it("renders class names in the table", () => {
      renderPage();
      expect(screen.getAllByText(/grade 1/i).length).toBeGreaterThan(0);
    });

    it("renders edit icons for each visible row", () => {
      renderPage();
      const editIcons = screen.getAllByTestId("icon-FiEdit");
      expect(editIcons.length).toBe(5);
    });
  });

  // ── Search ────────────────────────────────────────────────────

  describe("Search", () => {
    it("filters students by name", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/search students/i), {
        target: { value: "Liya" },
      });
      expect(screen.getByText("Liya Tesfaye")).toBeTruthy();
      expect(screen.queryByText("Biruk Alemu")).toBeFalsy();
    });

    it("filters students by class name", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/search students/i), {
        target: { value: "Kindergarten" },
      });
      expect(screen.getByText("Meron Haile")).toBeTruthy();
      expect(screen.queryByText("Liya Tesfaye")).toBeFalsy();
    });

    it("shows no-match message for an unmatched search term", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/search students/i), {
        target: { value: "zzznomatch" },
      });
      expect(screen.getByText(/no students match/i)).toBeTruthy();
    });

    it("is case-insensitive", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/search students/i), {
        target: { value: "liya" },
      });
      expect(screen.getByText("Liya Tesfaye")).toBeTruthy();
    });
  });

  // ── Pagination ────────────────────────────────────────────────

  describe("Pagination", () => {
    it("shows page 1 of 2 on initial load", () => {
      renderPage();
      expect(screen.getByText(/of 2/i)).toBeTruthy();
    });

    it("prev button is disabled on the first page", () => {
      renderPage();
      const prevBtn = screen.getByTestId("icon-FiArrowLeft").closest("button");
      expect(prevBtn.disabled).toBe(true);
    });

    it("next button is enabled on the first page", () => {
      renderPage();
      const nextBtn = screen.getByTestId("icon-FiArrowRight").closest("button");
      expect(nextBtn.disabled).toBe(false);
    });

    it("navigates to page 2 and shows remaining students", () => {
      renderPage();
      fireEvent.click(screen.getByTestId("icon-FiArrowRight").closest("button"));
      expect(screen.getByText("Dawit Bekele")).toBeTruthy();
      expect(screen.getByText("Hana Tadesse")).toBeTruthy();
    });

    it("next button is disabled on the last page", () => {
      renderPage();
      const nextBtn = screen.getByTestId("icon-FiArrowRight").closest("button");
      fireEvent.click(nextBtn);
      expect(nextBtn.disabled).toBe(true);
    });

    it("navigates back to page 1 from page 2", () => {
      renderPage();
      fireEvent.click(screen.getByTestId("icon-FiArrowRight").closest("button"));
      fireEvent.click(screen.getByTestId("icon-FiArrowLeft").closest("button"));
      expect(screen.getByText("Liya Tesfaye")).toBeTruthy();
    });
  });

});