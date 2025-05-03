'use client'

import { useState, useEffect } from 'react'

interface Player {
  playerid: number
  fullname: string
  nationality: string
  teamid: number
}

interface Team {
  teamid: number
  team_name: string
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPlayer, setNewPlayer] = useState({
    fullname: '',
    nationality: '',
    teamid: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, teamsRes] = await Promise.all([
          fetch('/api/players'),
          fetch('/api/teams')
        ])

        if (!playersRes.ok || !teamsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [playersData, teamsData] = await Promise.all([
          playersRes.json(),
          teamsRes.json()
        ])

        setPlayers(playersData)
        setTeams(teamsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      })

      if (!response.ok) {
        throw new Error('Failed to add player')
      }

      // Refresh the players list
      const updatedPlayers = await fetch('/api/players').then(res => res.json())
      setPlayers(updatedPlayers)

      // Reset form
      setNewPlayer({
        fullname: '',
        nationality: '',
        teamid: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add player')
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Players Management</h1>
      </div>

      {/* Add Player Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
        <form onSubmit={handleAddPlayer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={newPlayer.fullname}
              onChange={(e) => setNewPlayer({ ...newPlayer, fullname: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nationality</label>
            <input
              type="text"
              value={newPlayer.nationality}
              onChange={(e) => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Team</label>
            <select
              value={newPlayer.teamid}
              onChange={(e) => setNewPlayer({ ...newPlayer, teamid: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.teamid} value={team.teamid}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Player
          </button>
        </form>
      </div>

      {/* Players List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {players.map((player) => (
              <tr key={player.playerid} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {player.fullname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.nationality}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {teams.find(t => t.teamid === player.teamid)?.team_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 