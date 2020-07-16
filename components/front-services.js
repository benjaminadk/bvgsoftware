import { SERVICES } from '../lib/constants'

export default function FrontServices() {
  return (
    <section>
      <h2 className='mt-20 mb-8 text-6xl md:text-7xl text-center font-bold tracking-tighter leading-tight'>
        Technology Services
      </h2>
      <div className='grid grid-cols-3 my-20'>
        {SERVICES.map((el) => (
          <div key={el.title} className='flex flex-col items-center'>
            <img
              className='w-6/12'
              src={`/assets/front/${el.src}`}
              alt={el.title}
            />
            <h3 className='text-2xl font-bold'>{el.title}</h3>
            <p className='w-8/12 text-lg text-center mt-5'>{el.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
