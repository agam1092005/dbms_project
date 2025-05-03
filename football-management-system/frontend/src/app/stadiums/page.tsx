'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Stadium {
  stadiumid: number
  stadium_name: string
  location: string
  capacity: number
}

export default function StadiumsPage() {
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [newStadium, setNewStadium] = useState({
    stadium_name: '',
    location: '',
    capacity: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchStadiums()
  }, [])

  const fetchStadiums = async () => {
    try {
      const response = await fetch('/api/stadiums')
      if (!response.ok) throw new Error('Failed to fetch stadiums')
      const data = await response.json()
      setStadiums(data)
    } catch (err) {
      setError('Failed to load stadiums')
      console.error(err)
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
        body: JSON.stringify({
          stadium_name: newStadium.stadium_name,
          location: newStadium.location,
          capacity: parseInt(newStadium.capacity),
        }),
      })

      if (!response.ok) throw new Error('Failed to add stadium')
      
      setNewStadium({
        stadium_name: '',
        location: '',
        capacity: '',
      })
      fetchStadiums()
    } catch (err) {
      setError('Failed to add stadium')
      console.error(err)
    }
  }

  const handleDeleteStadium = async (stadiumid: number) => {
    if (!confirm('Are you sure you want to delete this stadium?')) return

    try {
      const response = await fetch(`/api/stadiums?stadiumid=${stadiumid}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete stadium')
      
      fetchStadiums()
    } catch (err) {
      setError('Failed to delete stadium')
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Stadiums</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAddStadium} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={newStadium.stadium_name}
            onChange={(e) => setNewStadium({ ...newStadium, stadium_name: e.target.value })}
            placeholder="Stadium Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={newStadium.location}
            onChange={(e) => setNewStadium({ ...newStadium, location: e.target.value })}
            placeholder="Location"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            value={newStadium.capacity}
            onChange={(e) => setNewStadium({ ...newStadium, capacity: e.target.value })}
            placeholder="Capacity"
            className="p-2 border rounded"
            required
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Stadium
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stadiums.map((stadium) => (
          <div
            key={stadium.stadiumid}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold">{stadium.stadium_name}</p>
              <p className="text-gray-600">{stadium.location}</p>
              <p className="text-gray-600">Capacity: {stadium.capacity.toLocaleString()}</p>
            </div>
            <button
              onClick={() => handleDeleteStadium(stadium.stadiumid)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 