import { render, screen } from "@testing-library/react";
import Loader from ".";
import "@testing-library/jest-dom";

describe("Loader component", () => {
  it("renders the loader item", () => {
    render(<Loader />);
    const loaderItem = screen.getByTestId("loader");
    expect(loaderItem).toBeInTheDocument();
  });
});
