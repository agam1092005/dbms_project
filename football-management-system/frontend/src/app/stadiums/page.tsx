'use client'

import { useState, useEffect } from 'react'

interface Stadium {
  stadiumid: number
  stadium_name: string
  city: string
}

export default function StadiumsPage() {
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStadium, setNewStadium] = useState({
    stadium_name: '',
    city: ''
  })

  useEffect(() => {
    fetchStadiums()
  }, [])

  const fetchStadiums = async () => {
    try {
      const response = await fetch('/api/stadiums')
      if (!response.ok) {
        throw new Error('Failed to fetch stadiums')
      }
      const data = await response.json()
      setStadiums(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStadium = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/stadiums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStadium),
      })

      if (!response.ok) {
        throw new Error('Failed to add stadium')
      }

      setShowAddForm(false)
      setNewStadium({ stadium_name: '', city: '' })
      fetchStadiums()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDeleteStadium = async (stadiumid: number) => {
    if (!confirm('Are you sure you want to delete this stadium?')) {
      return
    }

    try {
      const response = await fetch(`/api/stadiums?stadiumid=${stadiumid}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete stadium')
      }

      fetchStadiums()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stadiums</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showAddForm ? 'Cancel' : 'Add Stadium'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddStadium} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stadium Name</label>
            <input
              type="text"
              value={newStadium.stadium_name}
              onChange={(e) => setNewStadium({ ...newStadium, stadium_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={newStadium.city}
              onChange={(e) => setNewStadium({ ...newStadium, city: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Stadium
          </button>
        </form>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stadium Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stadiums.map((stadium) => (
              <tr key={stadium.stadiumid} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stadium.stadium_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stadium.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleDeleteStadium(stadium.stadiumid)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 