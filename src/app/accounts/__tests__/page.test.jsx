// src/app/accounts/__tests__/page.test.jsx
// ---------------------------------------------------------------
// Tests for the /accounts page (list + search + pagination).
// ---------------------------------------------------------------

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountsPage from "../page";

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
const renderPage = () => render(<AccountsPage />);
// ---------------------------------------------------------------

describe("AccountsPage", () => {

  // ── Layout ───────────────────────────────────────────────────

  describe("Layout", () => {
    it("renders the Navbar", () => {
      renderPage();
      expect(screen.getByTestId("navbar")).toBeTruthy();
    });

    it("renders the 'All Accounts' heading", () => {
      renderPage();
      expect(screen.getByText(/all accounts/i)).toBeTruthy();
    });

    it("renders the search input", () => {
      renderPage();
      expect(screen.getByPlaceholderText(/search accounts/i)).toBeTruthy();
    });

    it("renders the 'Add Account' button linking to /accounts/new", () => {
      renderPage();
      const link = screen.getByRole("link", { name: /add account/i });
      expect(link).toBeTruthy();
      expect(link.getAttribute("href")).toBe("/accounts/new");
    });
  });

  // ── Table headers ─────────────────────────────────────────────

  describe("Table headers", () => {
    it("renders the Full Name column header", () => {
      renderPage();
      expect(screen.getByText(/full name/i)).toBeTruthy();
    });

    it("renders the Username column header", () => {
      renderPage();
      expect(screen.getByText(/username/i)).toBeTruthy();
    });

    it("renders the Phone Number column header", () => {
      renderPage();
      expect(screen.getByText(/phone number/i)).toBeTruthy();
    });

    it("renders the Email column header", () => {
      renderPage();
      expect(screen.getByText(/^email$/i)).toBeTruthy();
    });

    it("renders the Role column header", () => {
      renderPage();
      expect(screen.getByText(/^role$/i)).toBeTruthy();
    });
  });

  // ── Account rows ──────────────────────────────────────────────

  describe("Account rows", () => {
    it("renders the first 5 accounts on page 1", () => {
      renderPage();
      ["Abebe Kebede", "Sara Tesfaye", "Mulugeta Haile", "Tigist Belay", "Dawit Yohannes"].forEach((name) => {
        expect(screen.getByText(name)).toBeTruthy();
      });
    });

    it("does NOT render page-2 accounts on initial load", () => {
      renderPage();
      expect(screen.queryByText("Etenesh Walelign")).toBeFalsy();
      expect(screen.queryByText("Samuel Getachew")).toBeFalsy();
      expect(screen.queryByText("Hiwot Alemu")).toBeFalsy();
    });

    it("renders usernames in the table", () => {
      renderPage();
      expect(screen.getByText("akebede")).toBeTruthy();
    });

    it("renders email addresses in the table", () => {
      renderPage();
      expect(screen.getByText("abebe.k@mail.com")).toBeTruthy();
    });

    it("renders role values in the table", () => {
      renderPage();
      expect(screen.getAllByText(/teacher/i).length).toBeGreaterThan(0);
    });

    it("renders edit icons for each visible row", () => {
      renderPage();
      const editIcons = screen.getAllByTestId("icon-FiEdit");
      expect(editIcons.length).toBe(5);
    });
  });

  // ── Search ────────────────────────────────────────────────────

  describe("Search", () => {
    it("filters accounts by full name", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/search accounts/i), {
        target: { value: "Abebe" },
      });
      expect(screen.getByText("Abebe Kebede")).toBeTruthy();
      expect(screen.queryByText("Sara Tesfaye")).toBeFalsy();
    });

    it("shows no-match message for an unmatched search term", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/search accounts/i), {
        target: { value: "zzznomatch" },
      });
      expect(screen.getByText(/no accounts match/i)).toBeTruthy();
    });

    it("is case-insensitive", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/search accounts/i), {
        target: { value: "abebe" },
      });
      expect(screen.getByText("Abebe Kebede")).toBeTruthy();
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

    it("navigates to page 2 and shows remaining accounts", () => {
      renderPage();
      fireEvent.click(screen.getByTestId("icon-FiArrowRight").closest("button"));
      expect(screen.getByText("Etenesh Walelign")).toBeTruthy();
      expect(screen.getByText("Samuel Getachew")).toBeTruthy();
      expect(screen.getByText("Hiwot Alemu")).toBeTruthy();
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
      expect(screen.getByText("Abebe Kebede")).toBeTruthy();
    });
  });

});