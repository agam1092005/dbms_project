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
      title: 'Stadiums',
      description: 'Manage stadiums and venues',
      link: '/stadiums',
      color: 'bg-indigo-500'
    },
    {
      title: 'Operation Logs',
      description: 'View system operation logs',
      link: '/logs',
      color: 'bg-purple-500'
    },
    {
      title: 'Managers',
      description: 'Assign and manage team managers',
      link: '/managers',
      color: 'bg-pink-500'
    }
  ]

  return (
    <>
    <div className='flex items-center justify-center m-10'>
      <img className="h-64 flex items-center justify-center" src="football.svg" alt="Football Logo" />
    </div>
    <div className="h-full">
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
      <h2 className='mt-20 justify-center items-center flex font-bold'>Made by</h2>
      <h2 className='justify-center items-center flex'>Agampreet Singh, Aryan Gupta, Ishant Madaan, Puneet Garg</h2>
    </div>
    </>
  )
}
