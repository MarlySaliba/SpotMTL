const DEFAULT_API_BASE_URL = "/api";
const NO_PREFERENCE_VALUE = "Not Specified";

function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  return (configuredBaseUrl || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

function buildAttractionsUrl(filters) {
  const query = new URLSearchParams();

  for (const [filter, value] of Object.entries(filters)) {
    if (value && value !== NO_PREFERENCE_VALUE) {
      query.set(filter, value);
    }
  }

  const queryString = query.toString();
  return `${getApiBaseUrl()}/attractions${queryString ? `?${queryString}` : ""}`;
}

export async function getAttractions(filters = {}, { signal } = {}) {
  const response = await fetch(buildAttractionsUrl(filters), {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`The attractions request failed with status ${response.status}.`);
  }

  const attractions = await response.json();

  if (!Array.isArray(attractions)) {
    throw new Error("The attractions API returned an invalid response.");
  }

  return attractions;
}
