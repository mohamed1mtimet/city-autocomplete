import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import "@testing-library/jest-dom";
import Autocomplete from ".";

jest.mock("axios");

const queryClient = new QueryClient();

describe("Autocomplete Component", () => {
  const mockOnSelect = jest.fn();

  const mockGetQueryFn = (query: string) => async () => {
    if (!query) return [];
    const mockData = [
      { id: "id-paris-75000", name: "Paris" },
      { id: "id-lyon-69000", name: "Lyon" },
    ];
    return mockData
      .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
      .map((e) => ({ key: e.id, label: e.name }));
  };

  it("renders the input and handles user input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Autocomplete
          onSelect={mockOnSelect}
          getQueryFn={mockGetQueryFn}
          getQueryKey={(query) => ["cities", query]}
        />
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Par" } });

    await waitFor(() => {
      expect(screen.getByText("Paris")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Paris"));

    expect(mockOnSelect).toHaveBeenCalledWith("id-paris-75000");
    expect(input).toHaveValue("Paris");
  });

  it("displays a loader when loading", async () => {
    (axios.get as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 1000))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Autocomplete
          onSelect={jest.fn()}
          getQueryFn={mockGetQueryFn}
          getQueryKey={(query) => ["cities", query]}
        />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "Lo" },
    });

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("handles ArrowDown and Enter keys to select the first suggestion", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Autocomplete
          onSelect={mockOnSelect}
          getQueryFn={mockGetQueryFn}
          getQueryKey={(query) => ["cities", query]}
        />
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "Par" } });
    fireEvent.keyDown(input, { key: "ArrowDown", code: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockOnSelect).toHaveBeenCalledWith("id-paris-75000");
    expect(input).toHaveValue("Paris");
  });

  it("clears the input and resets suggestions when the clear button is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Autocomplete
          onSelect={mockOnSelect}
          getQueryFn={mockGetQueryFn}
          getQueryKey={(query) => ["cities", query]}
        />
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "Ly" } });

    await waitFor(() => {
      expect(screen.getByText("Lyon")).toBeInTheDocument();
    });

    const clearButton = screen.getByRole("button", { name: /clear input/i });
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    expect(input).toHaveValue("");

    await waitFor(() => {
      expect(screen.queryByText("Lyon")).not.toBeInTheDocument();
    });
    expect(mockOnSelect).toHaveBeenCalledWith("");
  });
});
