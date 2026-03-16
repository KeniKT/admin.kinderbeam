// src/app/accounts/new/__tests__/page.test.jsx
// ---------------------------------------------------------------
// Tests for the /accounts/new page (add account form).
// IMPORTANT: must live at src/app/accounts/new/__tests__/page.test.jsx
// so that import "../page" resolves to accounts/new/page.jsx
// ---------------------------------------------------------------

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NewAccountPage from "../page";

// ---------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/components/Navbar", () => {
  const MockNavbar = () => <nav data-testid="navbar" />;
  MockNavbar.displayName = "MockNavbar";
  return MockNavbar;
});

// ---------------------------------------------------------------
const renderPage = () => render(<NewAccountPage />);
// ---------------------------------------------------------------

describe("NewAccountPage", () => {

  beforeEach(() => {
    mockPush.mockClear();
  });

  // ── Layout ───────────────────────────────────────────────────

  describe("Layout", () => {
    it("renders the Navbar", () => {
      renderPage();
      expect(screen.getByTestId("navbar")).toBeTruthy();
    });

    it("renders the 'Add Account' heading", () => {
      renderPage();
      expect(screen.getByText(/add account/i)).toBeTruthy();
    });

    it("renders the Username input", () => {
      renderPage();
      expect(screen.getByPlaceholderText(/username/i)).toBeTruthy();
    });

    it("renders the First Name input", () => {
      renderPage();
      expect(screen.getByPlaceholderText(/first name/i)).toBeTruthy();
    });

    it("renders the Last Name input", () => {
      renderPage();
      expect(screen.getByPlaceholderText(/last name/i)).toBeTruthy();
    });

    it("renders the Email input", () => {
      renderPage();
      expect(screen.getByPlaceholderText(/email/i)).toBeTruthy();
    });

    it("renders the Phone Number input", () => {
      renderPage();
      expect(screen.getByPlaceholderText(/phone number/i)).toBeTruthy();
    });

    it("renders the Role select dropdown", () => {
      renderPage();
      expect(document.querySelector("select")).toBeTruthy();
    });

    it("renders the Confirm submit button", () => {
      renderPage();
      expect(screen.getByRole("button", { name: /confirm/i })).toBeTruthy();
    });
  });

  // ── Role dropdown options ─────────────────────────────────────

  describe("Role dropdown", () => {
    it("renders the 'Select Role' placeholder option", () => {
      renderPage();
      expect(screen.getByText(/select role/i)).toBeTruthy();
    });

    it("renders the 'Parent' option", () => {
      renderPage();
      expect(screen.getByRole("option", { name: /parent/i })).toBeTruthy();
    });

    it("renders the 'Teacher' option", () => {
      renderPage();
      expect(screen.getByRole("option", { name: /teacher/i })).toBeTruthy();
    });

    it("renders the 'Moderator' option", () => {
      renderPage();
      expect(screen.getByRole("option", { name: /moderator/i })).toBeTruthy();
    });
  });

  // ── Validation ────────────────────────────────────────────────

  describe("Validation", () => {
    it("shows error when form is submitted empty", () => {
      renderPage();
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
      expect(screen.getByText(/please fill in all fields/i)).toBeTruthy();
    });

    it("shows error when only Username is filled", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: "akebede" },
      });
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
      expect(screen.getByText(/please fill in all fields/i)).toBeTruthy();
    });

    it("shows error when all fields filled except role", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/username/i),    { target: { value: "akebede" } });
      fireEvent.change(screen.getByPlaceholderText(/first name/i),  { target: { value: "Abebe" } });
      fireEvent.change(screen.getByPlaceholderText(/last name/i),   { target: { value: "Kebede" } });
      fireEvent.change(screen.getByPlaceholderText(/email/i),       { target: { value: "a@mail.com" } });
      fireEvent.change(screen.getByPlaceholderText(/phone number/i),{ target: { value: "+251911234567" } });
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
      expect(screen.getByText(/please fill in all fields/i)).toBeTruthy();
    });
  });

  // ── Successful submission ─────────────────────────────────────

  describe("Successful submission", () => {
    const fillAndSubmit = () => {
      fireEvent.change(screen.getByPlaceholderText(/username/i),    { target: { value: "akebede" } });
      fireEvent.change(screen.getByPlaceholderText(/first name/i),  { target: { value: "Abebe" } });
      fireEvent.change(screen.getByPlaceholderText(/last name/i),   { target: { value: "Kebede" } });
      fireEvent.change(screen.getByPlaceholderText(/email/i),       { target: { value: "a@mail.com" } });
      fireEvent.change(screen.getByPlaceholderText(/phone number/i),{ target: { value: "+251911234567" } });
      fireEvent.change(document.querySelector("select"),            { target: { value: "teacher" } });
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    };

    it("redirects to /accounts on valid submission", () => {
      renderPage();
      fillAndSubmit();
      expect(mockPush).toHaveBeenCalledWith("/accounts");
    });

    it("calls router.push exactly once", () => {
      renderPage();
      fillAndSubmit();
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it("does not show an error message on valid submission", () => {
      renderPage();
      fillAndSubmit();
      expect(screen.queryByText(/please fill in all fields/i)).toBeFalsy();
    });

    it("clears error on valid resubmit after a failed attempt", () => {
      renderPage();
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
      expect(screen.getByText(/please fill in all fields/i)).toBeTruthy();
      fillAndSubmit();
      expect(screen.queryByText(/please fill in all fields/i)).toBeFalsy();
    });
  });

  // ── Input interactions ────────────────────────────────────────

  describe("Input interactions", () => {
    it("updates the Username field on change", () => {
      renderPage();
      const input = screen.getByPlaceholderText(/username/i);
      fireEvent.change(input, { target: { value: "newuser" } });
      expect(input.value).toBe("newuser");
    });

    it("updates the First Name field on change", () => {
      renderPage();
      const input = screen.getByPlaceholderText(/first name/i);
      fireEvent.change(input, { target: { value: "Abebe" } });
      expect(input.value).toBe("Abebe");
    });

    it("updates the Last Name field on change", () => {
      renderPage();
      const input = screen.getByPlaceholderText(/last name/i);
      fireEvent.change(input, { target: { value: "Kebede" } });
      expect(input.value).toBe("Kebede");
    });

    it("updates the Email field on change", () => {
      renderPage();
      const input = screen.getByPlaceholderText(/email/i);
      fireEvent.change(input, { target: { value: "test@mail.com" } });
      expect(input.value).toBe("test@mail.com");
    });

    it("updates the Phone Number field on change", () => {
      renderPage();
      const input = screen.getByPlaceholderText(/phone number/i);
      fireEvent.change(input, { target: { value: "+251911234567" } });
      expect(input.value).toBe("+251911234567");
    });

    it("updates the Role dropdown on change", () => {
      renderPage();
      const select = document.querySelector("select");
      fireEvent.change(select, { target: { value: "parent" } });
      expect(select.value).toBe("parent");
    });
  });

});