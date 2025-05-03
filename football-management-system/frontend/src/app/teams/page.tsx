'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Team {
  teamid: number
  team_name: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [newTeamName, setNewTeamName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      if (!response.ok) throw new Error('Failed to fetch teams')
      const data = await response.json()
      setTeams(data)
    } catch (err) {
      setError('Failed to load teams')
      console.error(err)
    }
  }

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team_name: newTeamName }),
      })

      if (!response.ok) throw new Error('Failed to add team')
      
      setNewTeamName('')
      fetchTeams()
    } catch (err) {
      setError('Failed to add team')
      console.error(err)
    }
  }

  const handleDeleteTeam = async (teamid: number) => {
    if (!confirm('Are you sure you want to delete this team?')) return

    try {
      const response = await fetch(`/api/teams?teamid=${teamid}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete team')
      
      fetchTeams()
    } catch (err) {
      setError('Failed to delete team')
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Teams</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAddTeam} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Enter team name"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Team
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.teamid}
            className="border rounded p-4 flex justify-between items-center"
          >
            <span className="text-lg">{team.team_name}</span>
            <button
              onClick={() => handleDeleteTeam(team.teamid)}
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