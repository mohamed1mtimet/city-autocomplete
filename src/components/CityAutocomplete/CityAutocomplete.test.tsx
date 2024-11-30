import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CityAutocomplete from ".";
import { useFetchCities } from "../../api";
import "@testing-library/jest-dom";

jest.mock("../../api", () => ({
  useFetchCities: jest.fn(),
}));

describe("CityAutocomplete Component", () => {
  it("renders the input and handles user input", async () => {
    const mockOnSelect = jest.fn();
    const mockData = [
      {
        id: "96924951-4abe-42a5-be21-39c1c64fdbb6",
        name: "Zagreb",
        country: "Croatia",
      },
      {
        id: "id-paris-75000",
        name: "Paris",
        country: "France",
      },
      {
        id: "96924951-4abe-42a5-be21-39c2c64fdbb6",
        name: "Zarzis",
        country: "Tunisie",
      },
    ];

    (useFetchCities as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    render(<CityAutocomplete onSelect={mockOnSelect} />);

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

  it("displays a loader when loading", () => {
    (useFetchCities as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
    });

    render(<CityAutocomplete onSelect={jest.fn()} />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
  it("handles ArrowDown and Enter keys to select the first suggestion", async () => {
    const mockOnSelect = jest.fn();
    const mockData = [
      {
        id: "id-paris-75000",
        name: "Paris",
        country: "France",
      },
      {
        id: "id-lyon-69000",
        name: "Lyon",
        country: "France",
      },
    ];

    (useFetchCities as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    render(<CityAutocomplete onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search...");

    // Simulate typing a query
    fireEvent.change(input, { target: { value: "Par" } });

    await waitFor(() => {
      expect(screen.getByText("Paris")).toBeInTheDocument();
      expect(screen.getByText("Lyon")).toBeInTheDocument();
    });

    // Simulate pressing ArrowDown to navigate to the first suggestion
    fireEvent.keyDown(input, { key: "ArrowDown", code: "ArrowDown" });

    // Simulate pressing Enter to select the active suggestion
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockOnSelect).toHaveBeenCalledWith("id-paris-75000");
    expect(input).toHaveValue("Paris");
  });
});
