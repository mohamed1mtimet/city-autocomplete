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
  it("handles Enter key to select first suggestion", async () => {
    const mockOnSelect = jest.fn();
    const mockData = [
      {
        id: "id-paris-75000",
        name: "Paris",
        country: "France",
      },
    ];

    (useFetchCities as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    render(<CityAutocomplete onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "Par" } });

    await waitFor(() => {
      expect(screen.getByText("Paris")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockOnSelect).toHaveBeenCalledWith("id-paris-75000");
    expect(input).toHaveValue("Paris");
  });
});
