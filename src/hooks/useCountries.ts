import { useState, useEffect } from 'react'

export interface CountryData {
  iso2: string
  iso3: string
  country: string
  cities: string[]
}

export const useCountries = () => {
  const [countries, setCountries] = useState<CountryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries')
        if (!response.ok) throw new Error('Failed to fetch countries')
        
        const data = await response.json()
        
        // Extract countries array from API response
        const countriesArray = data.data || []
        
        // Sort by country name
        const sorted = countriesArray.sort((a: CountryData, b: CountryData) => 
          a.country.localeCompare(b.country)
        )
        
        setCountries(sorted)
        setError(null)
      } catch (err) {
        console.error('Error fetching countries:', err)
        setError(err instanceof Error ? err.message : 'Failed to load countries')
        
        // Fallback to basic country list if API fails
        setCountries([
          { iso2: 'US', iso3: 'USA', country: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
          { iso2: 'GB', iso3: 'GBR', country: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'] },
          { iso2: 'KE', iso3: 'KEN', country: 'Kenya', cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'] },
          { iso2: 'CA', iso3: 'CAN', country: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'] },
          { iso2: 'AU', iso3: 'AUS', country: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'] },
          { iso2: 'IN', iso3: 'IND', country: 'India', cities: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai'] },
          { iso2: 'DE', iso3: 'DEU', country: 'Germany', cities: ['Berlin', 'Munich', 'Frankfurt', 'Cologne', 'Hamburg'] },
          { iso2: 'FR', iso3: 'FRA', country: 'France', cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'] },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  return { countries, loading, error }
}