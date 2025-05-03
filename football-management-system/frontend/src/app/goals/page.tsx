'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Player {
  playerid: number
  fullname: string
  teamid: number
}

interface Team {
  teamid: number
  team_name: string
}

interface Match {
  matchid: number
  match_date: string
  team1id: number
  team2id: number
}

interface Goal {
  goalid: number
  playerid: number
  matchid: number
  time_minute: number
  player_name: string
  team_name: string
  match_date: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [newGoal, setNewGoal] = useState({
    playerid: '',
    matchid: '',
    time_minute: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchGoals()
    fetchPlayers()
    fetchTeams()
    fetchMatches()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals')
      if (!response.ok) throw new Error('Failed to fetch goals')
      const data = await response.json()
      setGoals(data)
    } catch (err) {
      setError('Failed to load goals')
      console.error(err)
    }
  }

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players')
      if (!response.ok) throw new Error('Failed to fetch players')
      const data = await response.json()
      setPlayers(data)
    } catch (err) {
      setError('Failed to load players')
      console.error(err)
    }
  }

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

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches')
      if (!response.ok) throw new Error('Failed to fetch matches')
      const data = await response.json()
      setMatches(data)
    } catch (err) {
      setError('Failed to load matches')
      console.error(err)
    }
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerid: parseInt(newGoal.playerid),
          matchid: parseInt(newGoal.matchid),
          time_minute: parseInt(newGoal.time_minute),
        }),
      })

      if (!response.ok) throw new Error('Failed to add goal')
      
      setNewGoal({
        playerid: '',
        matchid: '',
        time_minute: '',
      })
      fetchGoals()
    } catch (err) {
      setError('Failed to add goal')
      console.error(err)
    }
  }

  const handleDeleteGoal = async (goalid: number) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      const response = await fetch(`/api/goals?goalid=${goalid}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete goal')
      
      fetchGoals()
    } catch (err) {
      setError('Failed to delete goal')
      console.error(err)
    }
  }

  const getTeamName = (match: Match) => {
    const team1 = teams.find(t => t.teamid === match.team1id)
    const team2 = teams.find(t => t.teamid === match.team2id)
    return `${team1?.team_name} vs ${team2?.team_name}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Goals</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAddGoal} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            value={newGoal.playerid}
            onChange={(e) => setNewGoal({ ...newGoal, playerid: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Player</option>
            {players.map((player) => (
              <option key={player.playerid} value={player.playerid}>
                {player.fullname}
              </option>
            ))}
          </select>

          <select
            value={newGoal.matchid}
            onChange={(e) => setNewGoal({ ...newGoal, matchid: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Match</option>
            {matches.map((match) => (
              <option key={match.matchid} value={match.matchid}>
                {getTeamName(match)} ({new Date(match.match_date).toLocaleDateString()})
              </option>
            ))}
          </select>

          <input
            type="number"
            value={newGoal.time_minute}
            onChange={(e) => setNewGoal({ ...newGoal, time_minute: e.target.value })}
            placeholder="Goal Time (minutes)"
            className="p-2 border rounded"
            required
            min="0"
            max="120"
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Goal
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {goals.map((goal) => (
          <div
            key={goal.goalid}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-lg">
                {goal.player_name} ({goal.team_name})
              </p>
              <p className="text-gray-600">
                Match: {new Date(goal.match_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Time: {goal.time_minute}'</p>
            </div>
            <button
              onClick={() => handleDeleteGoal(goal.goalid)}
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