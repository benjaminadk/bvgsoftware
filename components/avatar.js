export default function Avatar({ name, picture }) {
  return (
    <div className='flex items-center'>
      <img src={picture} className='w-6 h-6 rounded-full mr-4' alt={name} />
      {/* <div className='text-xl font-bold'>{name}</div> */}
    </div>
  )
}
