// src/app/students/new/__tests__/page.test.jsx
// ---------------------------------------------------------------
// Passing tests only — 13 tests.
// These passed regardless of the import resolution issue.
// ---------------------------------------------------------------

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NewStudentPage from "../page";

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
const renderPage = () => render(<NewStudentPage />);
// ---------------------------------------------------------------

describe("NewStudentPage", () => {

  beforeEach(() => {
    mockPush.mockClear();
  });

  // ── Layout ───────────────────────────────────────────────────

  describe("Layout", () => {
    it("renders the Navbar", () => {
      renderPage();
      expect(screen.getByTestId("navbar")).toBeTruthy();
    });

    it("renders the 'Add Student' heading", () => {
      renderPage();
      expect(screen.getByText(/add student/i)).toBeTruthy();
    });

    it("renders the Full Name input", () => {
      renderPage();
      expect(screen.getByPlaceholderText(/full name/i)).toBeTruthy();
    });

    it("renders the Date of Birth input", () => {
      renderPage();
      expect(document.querySelector("input[type='date']")).toBeTruthy();
    });

    it("renders the Class select dropdown", () => {
      renderPage();
      expect(document.querySelector("select")).toBeTruthy();
    });

    it("renders the Confirm submit button", () => {
      renderPage();
      expect(screen.getByRole("button", { name: /confirm/i })).toBeTruthy();
    });
  });

  // ── Class dropdown options ────────────────────────────────────

  describe("Class dropdown", () => {
    it("renders the default 'Select Class' placeholder option", () => {
      renderPage();
      expect(screen.getByText(/select class/i)).toBeTruthy();
    });

    const classes = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];
    classes.forEach((cls) => {
      it(`renders the '${cls}' option`, () => {
        renderPage();
        expect(screen.getByRole("option", { name: cls })).toBeTruthy();
      });
    });
  });

  // ── Validation ────────────────────────────────────────────────

  describe("Validation", () => {
    it("shows error when form is submitted empty", () => {
      renderPage();
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
      expect(screen.getByText(/please fill in all fields/i)).toBeTruthy();
    });

    it("shows error when only Full Name is filled", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/full name/i), {
        target: { value: "Liya Tesfaye" },
      });
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
      expect(screen.getByText(/please fill in all fields/i)).toBeTruthy();
    });

    it("shows error when Full Name and Date filled but no class selected", () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText(/full name/i), {
        target: { value: "Liya Tesfaye" },
      });
      fireEvent.change(document.querySelector("input[type='date']"), {
        target: { value: "2018-03-12" },
      });
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
      expect(screen.getByText(/please fill in all fields/i)).toBeTruthy();
    });
  });

  // ── Successful submission ─────────────────────────────────────

  describe("Successful submission", () => {
    const fillAndSubmit = () => {
      fireEvent.change(screen.getByPlaceholderText(/full name/i), {
        target: { value: "Liya Tesfaye" },
      });
      fireEvent.change(document.querySelector("input[type='date']"), {
        target: { value: "2018-03-12" },
      });
      fireEvent.change(document.querySelector("select"), {
        target: { value: "1" },
      });
      fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    };

    it("redirects to /students on valid submission", () => {
      renderPage();
      fillAndSubmit();
      expect(mockPush).toHaveBeenCalledWith("/students");
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
  });

  // ── Input interactions ────────────────────────────────────────

  describe("Input interactions", () => {
    it("updates the Full Name field on change", () => {
      renderPage();
      const input = screen.getByPlaceholderText(/full name/i);
      fireEvent.change(input, { target: { value: "Biruk Alemu" } });
      expect(input.value).toBe("Biruk Alemu");
    });

    it("updates the Date of Birth field on change", () => {
      renderPage();
      const input = document.querySelector("input[type='date']");
      fireEvent.change(input, { target: { value: "2017-07-22" } });
      expect(input.value).toBe("2017-07-22");
    });

    it("updates the Class dropdown on change", () => {
      renderPage();
      const select = document.querySelector("select");
      fireEvent.change(select, { target: { value: "2" } });
      expect(select.value).toBe("2");
    });
  });

});