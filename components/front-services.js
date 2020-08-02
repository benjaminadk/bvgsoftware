import { SERVICES } from '../lib/constants'

export default function FrontServices() {
  return (
    <section>
      <h2 className='lg:mt-20 mt-10 mb-8 lg:text-8xl text-7xl text-center font-bold tracking-tighter leading-tight'>
        Technology Services
      </h2>
      <div className='grid lg:grid-cols-3 grid-cols-1 lg:my-20 my-10'>
        {SERVICES.map((el) => (
          <div
            key={el.title}
            className='flex flex-col items-center lg:mb-0 mb-5'
          >
            <img
              className='lg:w-6/12 w-8/12'
              src={`/assets/front/${el.src}`}
              alt={el.title}
            />
            <h3 className='text-2xl font-bold'>{el.title}</h3>
            <p className='lg:w-8/12 w-10/12 text-lg lg:text-center text-justify mt-5'>
              {el.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
