import Container from './container'

export default function Footer() {
  return (
    <footer className='bg-black'>
      <Container>
        <div className='py-28 flex flex-col lg:flex-row items-center'>
          <h3 className='text-4xl lg:text-5xl text-white font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2'>
            Footer
          </h3>
          <div className='flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2 text-white'>
            Needs Work
          </div>
        </div>
      </Container>
    </footer>
  )
}
