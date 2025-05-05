"use client"

import { useState, useEffect } from "react";

interface Team {
  teamid: number;
  team_name: string;
  manager_name: string | null;
  managerid: number | null;
}

export default function ManagersPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newManager, setNewManager] = useState({
    fullname: "",
    teamid: ""
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      setError("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const handleAddManager = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/managers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: newManager.fullname,
          teamid: parseInt(newManager.teamid)
        })
      });
      if (!response.ok) throw new Error("Failed to add manager");
      setShowAddForm(false);
      setNewManager({ fullname: "", teamid: "" });
      fetchTeams();
    } catch (err) {
      setError("Failed to add manager");
    }
  };

  const handleDeleteManager = async (managerid: number) => {
    if (!confirm("Are you sure you want to delete this manager?")) return;
    try {
      const response = await fetch(`/api/managers?managerid=${managerid}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete manager");
      fetchTeams();
    } catch (err) {
      setError("Failed to delete manager");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Managers</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showAddForm ? "Cancel" : "Assign Manager"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddManager} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Manager Name</label>
            <input
              type="text"
              value={newManager.fullname}
              onChange={e => setNewManager({ ...newManager, fullname: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Team</label>
            <select
              value={newManager.teamid}
              onChange={e => setNewManager({ ...newManager, teamid: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a team</option>
              {teams.filter(t => !t.managerid).map(team => (
                <option key={team.teamid} value={team.teamid}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Assign Manager
          </button>
        </form>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map(team => (
              <tr key={team.teamid} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.team_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {team.manager_name || <span className="italic text-gray-400">No manager</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {team.managerid ? (
                    <button
                      onClick={() => handleDeleteManager(team.managerid!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Unassign
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">No manager</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 