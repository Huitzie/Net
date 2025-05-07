
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
  "Alabama": [
    { state: "Alabama", city: "Birmingham" },
    { state: "Alabama", city: "Montgomery" },
    { state: "Alabama", city: "Mobile" },
    { state: "Alabama", city: "Huntsville" },
    { state: "Alabama", city: "Tuscaloosa" },
  ],
  "Alaska": [
    { state: "Alaska", city: "Anchorage" },
    { state: "Alaska", city: "Fairbanks" },
    { state: "Alaska", city: "Juneau" },
  ],
  "Arizona": [
    { state: "Arizona", city: "Phoenix" },
    { state: "Arizona", city: "Tucson" },
    { state: "Arizona", city: "Mesa" },
    { state: "Arizona", city: "Chandler" },
    { state: "Arizona", city: "Scottsdale" },
  ],
  "Arkansas": [
    { state: "Arkansas", city: "Little Rock" },
    { state: "Arkansas", city: "Fort Smith" },
    { state: "Arkansas", city: "Fayetteville" },
  ],
  "California": [
    { state: "California", city: "Los Angeles" },
    { state: "California", city: "San Diego" },
    { state: "California", city: "San Francisco" },
    { state: "California", city: "Sacramento" },
    { state: "California", city: "San Jose" },
    { state: "California", city: "Fresno" },
    { state: "California", city: "Long Beach" },
    { state: "California", city: "Oakland" },
    { state: "California", city: "Bakersfield" },
    { state: "California", city: "Anaheim" },
  ],
  "Colorado": [
    { state: "Colorado", city: "Denver" },
    { state: "Colorado", city: "Colorado Springs" },
    { state: "Colorado", city: "Aurora" },
    { state: "Colorado", city: "Fort Collins" },
    { state: "Colorado", city: "Lakewood" },
  ],
  "Connecticut": [
    { state: "Connecticut", city: "Bridgeport" },
    { state: "Connecticut", city: "New Haven" },
    { state: "Connecticut", city: "Hartford" },
    { state: "Connecticut", city: "Stamford" },
  ],
  "Delaware": [
    { state: "Delaware", city: "Wilmington" },
    { state: "Delaware", city: "Dover" },
  ],
  "Florida": [
    { state: "Florida", city: "Jacksonville" },
    { state: "Florida", city: "Miami" },
    { state: "Florida", city: "Tampa" },
    { state: "Florida", city: "Orlando" },
    { state: "Florida", city: "St. Petersburg" },
    { state: "Florida", city: "Hialeah" },
    { state: "Florida", city: "Fort Lauderdale" },
    { state: "Florida", city: "Tallahassee" },
  ],
  "Georgia": [
    { state: "Georgia", city: "Atlanta" },
    { state: "Georgia", city: "Augusta" },
    { state: "Georgia", city: "Columbus" },
    { state: "Georgia", city: "Macon" },
    { state: "Georgia", city: "Savannah" },
  ],
   "Hawaii": [
    { state: "Hawaii", city: "Honolulu" },
    { state: "Hawaii", city: "Pearl City" },
    { state: "Hawaii", city: "Hilo" },
  ],
  "Idaho": [
    { state: "Idaho", city: "Boise" },
    { state: "Idaho", city: "Meridian" },
    { state: "Idaho", city: "Nampa" },
  ],
  "Illinois": [
    { state: "Illinois", city: "Chicago" },
    { state: "Illinois", city: "Aurora" },
    { state: "Illinois", city: "Naperville" },
    { state: "Illinois", city: "Joliet" },
    { state: "Illinois", city: "Rockford" },
    { state: "Illinois", city: "Springfield" },
  ],
  "Indiana": [
    { state: "Indiana", city: "Indianapolis" },
    { state: "Indiana", city: "Fort Wayne" },
    { state: "Indiana", city: "Evansville" },
    { state: "Indiana", city: "South Bend" },
  ],
  "Iowa": [
    { state: "Iowa", city: "Des Moines" },
    { state: "Iowa", city: "Cedar Rapids" },
    { state: "Iowa", city: "Davenport" },
  ],
  "Kansas": [
    { state: "Kansas", city: "Wichita" },
    { state: "Kansas", city: "Overland Park" },
    { state: "Kansas", city: "Kansas City" },
  ],
  "Kentucky": [
    { state: "Kentucky", city: "Louisville" },
    { state: "Kentucky", city: "Lexington" },
    { state: "Kentucky", city: "Bowling Green" },
  ],
  "Louisiana": [
    { state: "Louisiana", city: "New Orleans" },
    { state: "Louisiana", city: "Baton Rouge" },
    { state: "Louisiana", city: "Shreveport" },
  ],
  "Maine": [
    { state: "Maine", city: "Portland" },
    { state: "Maine", city: "Lewiston" },
  ],
  "Maryland": [
    { state: "Maryland", city: "Baltimore" },
    { state: "Maryland", city: "Frederick" },
    { state: "Maryland", city: "Rockville" },
  ],
  "Massachusetts": [
    { state: "Massachusetts", city: "Boston" },
    { state: "Massachusetts", city: "Worcester" },
    { state: "Massachusetts", city: "Springfield" },
    { state: "Massachusetts", city: "Cambridge" },
  ],
  "Michigan": [
    { state: "Michigan", city: "Detroit" },
    { state: "Michigan", city: "Grand Rapids" },
    { state: "Michigan", city: "Warren" },
    { state: "Michigan", city: "Sterling Heights" },
  ],
  "Minnesota": [
    { state: "Minnesota", city: "Minneapolis" },
    { state: "Minnesota", city: "Saint Paul" },
    { state: "Minnesota", city: "Rochester" },
  ],
  "Mississippi": [
    { state: "Mississippi", city: "Jackson" },
    { state: "Mississippi", city: "Gulfport" },
  ],
  "Missouri": [
    { state: "Missouri", city: "Kansas City" },
    { state: "Missouri", city: "Saint Louis" },
    { state: "Missouri", city: "Springfield" },
    { state: "Missouri", city: "Independence" },
  ],
  "Montana": [
    { state: "Montana", city: "Billings" },
    { state: "Montana", city: "Missoula" },
  ],
  "Nebraska": [
    { state: "Nebraska", city: "Omaha" },
    { state: "Nebraska", city: "Lincoln" },
  ],
  "Nevada": [
    { state: "Nevada", city: "Las Vegas" },
    { state: "Nevada", city: "Henderson" },
    { state: "Nevada", city: "Reno" },
    { state: "Nevada", city: "North Las Vegas" },
  ],
  "New Hampshire": [
    { state: "New Hampshire", city: "Manchester" },
    { state: "New Hampshire", city: "Nashua" },
  ],
  "New Jersey": [
    { state: "New Jersey", city: "Newark" },
    { state: "New Jersey", city: "Jersey City" },
    { state: "New Jersey", city: "Paterson" },
    { state: "New Jersey", city: "Elizabeth" },
  ],
  "New Mexico": [
    { state: "New Mexico", city: "Albuquerque" },
    { state: "New Mexico", city: "Las Cruces" },
  ],
  "New York": [
    { state: "New York", city: "New York City" },
    { state: "New York", city: "Buffalo" },
    { state: "New York", city: "Rochester" },
    { state: "New York", city: "Yonkers" },
    { state: "New York", city: "Syracuse" },
    { state: "New York", city: "Albany" },
  ],
  "North Carolina": [
    { state: "North Carolina", city: "Charlotte" },
    { state: "North Carolina", city: "Raleigh" },
    { state: "North Carolina", city: "Greensboro" },
    { state: "North Carolina", city: "Durham" },
    { state: "North Carolina", city: "Winston-Salem" },
  ],
  "North Dakota": [
    { state: "North Dakota", city: "Fargo" },
    { state: "North Dakota", city: "Bismarck" },
  ],
  "Ohio": [
    { state: "Ohio", city: "Columbus" },
    { state: "Ohio", city: "Cleveland" },
    { state: "Ohio", city: "Cincinnati" },
    { state: "Ohio", city: "Toledo" },
    { state: "Ohio", city: "Akron" },
  ],
  "Oklahoma": [
    { state: "Oklahoma", city: "Oklahoma City" },
    { state: "Oklahoma", city: "Tulsa" },
    { state: "Oklahoma", city: "Norman" },
  ],
  "Oregon": [
    { state: "Oregon", city: "Portland" },
    { state: "Oregon", city: "Salem" },
    { state: "Oregon", city: "Eugene" },
  ],
  "Pennsylvania": [
    { state: "Pennsylvania", city: "Philadelphia" },
    { state: "Pennsylvania", city: "Pittsburgh" },
    { state: "Pennsylvania", city: "Allentown" },
    { state: "Pennsylvania", city: "Erie" },
  ],
  "Rhode Island": [
    { state: "Rhode Island", city: "Providence" },
    { state: "Rhode Island", city: "Warwick" },
  ],
  "South Carolina": [
    { state: "South Carolina", city: "Columbia" },
    { state: "South Carolina", city: "Charleston" },
    { state: "South Carolina", city: "North Charleston" },
  ],
  "South Dakota": [
    { state: "South Dakota", city: "Sioux Falls" },
    { state: "South Dakota", city: "Rapid City" },
  ],
  "Tennessee": [
    { state: "Tennessee", city: "Nashville" },
    { state: "Tennessee", city: "Memphis" },
    { state: "Tennessee", city: "Knoxville" },
    { state: "Tennessee", city: "Chattanooga" },
  ],
  "Texas": [
    { state: "Texas", city: "Houston" },
    { state: "Texas", city: "San Antonio" },
    { state: "Texas", city: "Dallas" },
    { state: "Texas", city: "Austin" },
    { state: "Texas", city: "Fort Worth" },
    { state: "Texas", city: "El Paso" },
    { state: "Texas", city: "Arlington" },
    { state: "Texas", city: "Corpus Christi" },
  ],
  "Utah": [
    { state: "Utah", city: "Salt Lake City" },
    { state: "Utah", city: "West Valley City" },
    { state: "Utah", city: "Provo" },
  ],
  "Vermont": [
    { state: "Vermont", city: "Burlington" },
    { state: "Vermont", city: "Essex" },
  ],
  "Virginia": [
    { state: "Virginia", city: "Virginia Beach" },
    { state: "Virginia", city: "Norfolk" },
    { state: "Virginia", city: "Chesapeake" },
    { state: "Virginia", city: "Richmond" },
    { state: "Virginia", city: "Newport News" },
  ],
  "Washington": [
    { state: "Washington", city: "Seattle" },
    { state: "Washington", city: "Spokane" },
    { state: "Washington", city: "Tacoma" },
    { state: "Washington", city: "Vancouver" },
    { state: "Washington", city: "Bellevue" },
  ],
  "West Virginia": [
    { state: "West Virginia", city: "Charleston" },
    { state: "West Virginia", city: "Huntington" },
  ],
  "Wisconsin": [
    { state: "Wisconsin", city: "Milwaukee" },
    { state: "Wisconsin", city: "Madison" },
    { state: "Wisconsin", city: "Green Bay" },
  ],
  "Wyoming": [
    { state: "Wyoming", city: "Cheyenne" },
    { state: "Wyoming", city: "Casper" },
  ],
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

