// lib/countries.ts
import countriesData from "./countries.json";

// Define the Country interface based on your JSON structure
export interface Country {
  name: {
    common: string;
    official: string;
    native?: Record<string, { common: string; official: string }>;
  };
  demonym: string;
  capital: string;
  iso_3166_1_alpha2: string;
  iso_3166_1_alpha3: string;
  iso_3166_1_numeric: string;
  currency: Record<
    string,
    {
      iso_4217_code: string;
      iso_4217_numeric: number;
      iso_4217_name: string;
      iso_4217_minor_unit: number;
    }
  >;
  tld: string[];
  alt_spellings: string[];
  languages: Record<string, string>;
  geo: {
    continent: Record<string, string>;
    postal_code: boolean;
    latitude: string;
    latitude_desc: string;
    longitude: string;
    longitude_desc: string;
    max_latitude: string;
    max_longitude: string;
    min_latitude: string;
    min_longitude: string;
    area: number;
    region: string;
    subregion: string;
    world_region: string;
    region_code: string;
    subregion_code: string;
    landlocked: boolean;
    borders: string[];
    independent: string;
  };
  dialling: {
    calling_code: string[];
    national_prefix: string | null;
    national_number_lengths: number[];
    national_destination_code_lengths: number[];
    international_prefix: string;
  };
  extra: {
    geonameid: number;
    edgar: string;
    itu: string;
    marc: string;
    wmo: string | null;
    ds: string | null;
    fifa: string;
    fips: string;
    gaul: number;
    ioc: string;
    cowc: string;
    cown: number;
    fao: number;
    imf: number;
    ar5: string;
    address_format: string | null;
    eu_member: string | null;
    data_protection: string;
    vat_rates: string | null;
    emoji: string;
  };
}
// Type the countries data
const countries: Record<string, Country> = countriesData as unknown as Record<
  string,
  Country
>;

// Cache for performance
let cachedCountries: Country[] | null = null;

// Get all countries as an array
export const getAllCountries = (): Country[] => {
  if (cachedCountries) return cachedCountries;
  cachedCountries = Object.values(countries);
  return cachedCountries;
};

// Get a country by ISO 3166-1 alpha-2 code (e.g., "AD")
export const getCountryByCode = (code: string): Country | undefined => {
  return countries[code.toLowerCase()];
};

// Get countries by region (e.g., "Africa")
export const getCountriesByRegion = (region: string): Country[] => {
  return getAllCountries().filter(
    (country) => country.geo.region.toLowerCase() === region.toLowerCase()
  );
};

// Get minimal country data for lightweight usage (e.g., for dropdowns)
export interface MinimalCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

export const getMinimalCountries = (): MinimalCountry[] => {
  return getAllCountries().map((country) => ({
    code: country.iso_3166_1_alpha2,
    name: country.name.common,
    flag: country.extra.emoji,
    currency: Object.values(country.currency)[0]?.iso_4217_code || "",
  }));
};
