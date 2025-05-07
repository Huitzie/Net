
/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents a State and City.
 */
export interface City {
  /**
   * The name of the State.
   */
  state: string;
  /**
   * The name of the City.
   */
  city: string;
}

// Mock Data
const mockStates: string[] = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

const mockCitiesByState: Record<string, City[]> = {
  "California": [
    { state: "California", city: "Los Angeles" },
    { state: "California", city: "San Diego" },
    { state: "California", city: "San Francisco" },
    { state: "California", city: "Sacramento" },
    { state: "California", city: "San Jose" },
  ],
  "Texas": [
    { state: "Texas", city: "Houston" },
    { state: "Texas", city: "San Antonio" },
    { state: "Texas", city: "Dallas" },
    { state: "Texas", city: "Austin" },
    { state: "Texas", city: "Fort Worth" },
  ],
  "Florida": [
    { state: "Florida", city: "Jacksonville" },
    { state: "Florida", city: "Miami" },
    { state: "Florida", city: "Tampa" },
    { state: "Florida", city: "Orlando" },
    { state: "Florida", city: "St. Petersburg" },
  ],
  "New York": [
    { state: "New York", city: "New York City" },
    { state: "New York", city: "Buffalo" },
    { state: "New York", city: "Rochester" },
    { state: "New York", city: "Yonkers" },
    { state: "New York", city: "Syracuse" },
  ],
  "Nevada": [
    { state: "Nevada", city: "Las Vegas" },
    { state: "Nevada", city: "Henderson" },
    { state: "Nevada", city: "Reno" },
  ],
  "Illinois": [
    { state: "Illinois", city: "Chicago" },
    { state: "Illinois", city: "Aurora" },
    { state: "Illinois", city: "Naperville" },
  ],
  // Add more states and cities as needed for mock data
};


/**
 * Asynchronously retrieves a list of all US states.
 *
 * @returns A promise that resolves to an array of state names.
 */
export async function getStates(): Promise<string[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...mockStates].sort(); // Return a sorted copy
}

/**
 * Asynchronously retrieves City information for a given state.
 *
 * @param state The state for which to retrieve city data.
 * @returns A promise that resolves to an array of City objects.
 */
export async function getCitiesByState(state: string): Promise<City[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 150));
  const cities = mockCitiesByState[state] || [];
  return [...cities].sort((a,b) => a.city.localeCompare(b.city)); // Return a sorted copy
}

// Old function, can be removed or kept for different purpose
/**
 * Asynchronously retrieves City information for a given state.
 *
 * @param state The state for which to retrieve city data.
 * @returns A promise that resolves to a City object containing state and city.
 */
export async function getCity(state: string): Promise<City[]> {
  // TODO: This function signature might need to be updated if it's fetching one city,
  // or use getCitiesByState if fetching multiple.
  // For now, returning a default based on mock data.
  await new Promise(resolve => setTimeout(resolve, 100));
  const citiesForState = mockCitiesByState[state];
  if (citiesForState && citiesForState.length > 0) {
    return [citiesForState[0]]; // Return the first city as an example
  }
  return [];
}
