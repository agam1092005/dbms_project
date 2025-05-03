'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Team {
  teamid: number
  team_name: string
}

interface Stadium {
  stadiumid: number
  stadium_name: string
  city: string
}

interface Match {
  matchid: number
  match_date: string
  team1id: number
  team2id: number
  stadiumid: number
  team1_name: string
  team2_name: string
  stadium_name: string
  city: string
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [newMatch, setNewMatch] = useState({
    match_date: '',
    team1id: '',
    team2id: '',
    stadiumid: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchMatches()
    fetchTeams()
    fetchStadiums()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch matches')
      }
      const data = await response.json()
      setMatches(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matches')
      console.error(err)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch teams')
      }
      const data = await response.json()
      setTeams(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teams')
      console.error(err)
    }
  }

  const fetchStadiums = async () => {
    try {
      const response = await fetch('/api/stadiums')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch stadiums')
      }
      const data = await response.json()
      setStadiums(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stadiums')
      console.error(err)
    }
  }

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          match_date: newMatch.match_date,
          team1id: parseInt(newMatch.team1id),
          team2id: parseInt(newMatch.team2id),
          stadiumid: parseInt(newMatch.stadiumid),
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add match')
      }

      setSuccess('Match added successfully')
      setNewMatch({
        match_date: '',
        team1id: '',
        team2id: '',
        stadiumid: '',
      })
      fetchMatches()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add match')
      console.error(err)
    }
  }

  const handleDeleteMatch = async (matchid: number) => {
    if (!confirm('Are you sure you want to delete this match?')) return

    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/matches?matchid=${matchid}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete match')
      }

      setSuccess('Match deleted successfully')
      fetchMatches()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete match')
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Matches</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleAddMatch} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="date"
            value={newMatch.match_date}
            onChange={(e) => setNewMatch({ ...newMatch, match_date: e.target.value })}
            className="p-2 border rounded"
            required
          />

          <select
            value={newMatch.team1id}
            onChange={(e) => setNewMatch({ ...newMatch, team1id: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Home Team</option>
            {teams.map((team) => (
              <option key={team.teamid} value={team.teamid}>
                {team.team_name}
              </option>
            ))}
          </select>

          <select
            value={newMatch.team2id}
            onChange={(e) => setNewMatch({ ...newMatch, team2id: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Away Team</option>
            {teams.map((team) => (
              <option key={team.teamid} value={team.teamid}>
                {team.team_name}
              </option>
            ))}
          </select>

          <select
            value={newMatch.stadiumid}
            onChange={(e) => setNewMatch({ ...newMatch, stadiumid: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Stadium</option>
            {stadiums.map((stadium) => (
              <option key={stadium.stadiumid} value={stadium.stadiumid}>
                {stadium.stadium_name} ({stadium.city})
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Match
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {matches.map((match) => (
          <div
            key={match.matchid}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-lg">
                {match.team1_name} vs {match.team2_name}
              </p>
              <p className="text-gray-600">
                Date: {new Date(match.match_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Stadium: {match.stadium_name} ({match.city})
              </p>
            </div>
            <button
              onClick={() => handleDeleteMatch(match.matchid)}
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