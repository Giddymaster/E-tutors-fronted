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
        setError(err instanceof Error ? err.message : 'Failed to load countries')
        setCountries([])
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  return { countries, loading, error }
}