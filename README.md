# City Autocomplete App

## Description

This is a React application that allows users to search for cities and select one from an autocomplete dropdown. When a city is selected, the application displays the UUID of the selected city.

## Features

- **City Autocomplete**: The app includes a city search input field that dynamically shows city suggestions based on the user's query.
- **City UUID Display**: Once a city is selected from the list, the UUID of the city is displayed on the screen.
- **Reusable Components**: The app uses a modular approach with reusable components like `CityAutocomplete` and `Loader`.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/city-autocomplete-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd city-autocomplete-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To run the application locally:

1. Start the development server:
   ```bash
   npm start
   ```

## Technologies

- **React**: JavaScript library for building user interfaces.
- **Styled-components**: A CSS-in-JS library for styling the components.
- **Axios (or any API client)**: For fetching city data from an API (assumed for this project).
- **React Hooks**: Used for state management and side effects.
- **Vite**: A fast build tool and development server for modern web applications.
- **React-query**: A library for fetching, caching, and syncing server data in React applications.

## Dependencies

- react
- react-dom
- react-scripts
- styled-components
- react-query

## Components :

# - Autocomplete Component

## Description

`Autocomplete` is a React component that provides an autocomplete input field for searching and selecting cities. It fetches cities based on a query and displays a list of suggestions. The user can either type in the input field or select from the dropdown list.

## Props

### `onSelect` (required)

- Type: `(id: string) => void`
- Description: A function that is called when a city is selected. It receives the `id` of the selected city as an argument.

### `className` (optional)

- Type: `string`
- Description: Additional class names for the input element.

### `onChange` (optional)

- Type: `(e: React.ChangeEvent<HTMLInputElement>) => void`
- Description: Callback triggered on input value change..

### `onKeyDown` (optional)

- Type: `(e: KeyboardEvent<HTMLInputElement>) => void`
- Description: Callback triggered on key down events.

### `placeholder` (optional)

- Type: `string`
- Default: `Search...`
- Description: Placeholder text for the input field.

### `getQueryFn` (required)

- Type: `(text: string) => QueryFunction<Option[], QueryKey, never>`
- Description: Function to fetch suggestions based on input query.

### `placeholder` (optional)

- Type: `(text: string) => QueryKey`
- Description: Function to generate a unique query key for react-query.

# - Loader Component

## Description

The `Loader` component is a simple, reusable loading spinner used to indicate that content is being loaded. It is typically used in situations where data is being fetched or processed and the user needs to wait.

## Usage

```tsx
import Loader from "./components/Loader";

<Loader />;
```

#

```

```
