import Link from 'next/link'

export default function Home() {
  const features = [
    {
      title: 'Teams Management',
      description: 'View and manage football teams',
      link: '/teams',
      color: 'bg-blue-500'
    },
    {
      title: 'Players Management',
      description: 'Add, view, and manage players',
      link: '/players',
      color: 'bg-green-500'
    },
    {
      title: 'Matches',
      description: 'Schedule and track matches',
      link: '/matches',
      color: 'bg-yellow-500'
    },
    {
      title: 'Goal Statistics',
      description: 'View player goal statistics',
      link: '/goals',
      color: 'bg-red-500'
    },
    {
      title: 'Operation Logs',
      description: 'View system operation logs',
      link: '/logs',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Football Management System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Link 
            key={index} 
            href={feature.link}
            className={`${feature.color} p-6 rounded-lg text-white hover:opacity-90 transition-opacity`}
          >
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="opacity-90">{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
