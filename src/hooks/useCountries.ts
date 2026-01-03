import { useState, useEffect } from 'react'

interface Country {
  name: {
    common: string
    official: string
  }
  flags: {
    svg: string
    png: string
  }
  cca2: string
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all')
        if (!response.ok) throw new Error('Failed to fetch countries')
        
        const data = await response.json()
        
        // Sort by common name
        const sorted = data.sort((a: Country, b: Country) => 
          a.name.common.localeCompare(b.name.common)
        )
        
        setCountries(sorted)
        setError(null)
      } catch (err) {
        console.error('Error fetching countries:', err)
        setError(err instanceof Error ? err.message : 'Failed to load countries')
        
        // Fallback to basic country list if API fails
        setCountries([
          { name: { common: 'United States', official: 'United States of America' }, flags: { svg: '', png: '' }, cca2: 'US' },
          { name: { common: 'United Kingdom', official: 'United Kingdom' }, flags: { svg: '', png: '' }, cca2: 'GB' },
          { name: { common: 'Kenya', official: 'Kenya' }, flags: { svg: '', png: '' }, cca2: 'KE' },
          { name: { common: 'Canada', official: 'Canada' }, flags: { svg: '', png: '' }, cca2: 'CA' },
          { name: { common: 'Australia', official: 'Australia' }, flags: { svg: '', png: '' }, cca2: 'AU' },
          { name: { common: 'India', official: 'India' }, flags: { svg: '', png: '' }, cca2: 'IN' },
          { name: { common: 'Germany', official: 'Germany' }, flags: { svg: '', png: '' }, cca2: 'DE' },
          { name: { common: 'France', official: 'France' }, flags: { svg: '', png: '' }, cca2: 'FR' },
        ] as Country[])
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  return { countries, loading, error }
}