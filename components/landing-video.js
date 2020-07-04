export default function LandingVideo() {
  const video = React.useRef()

  React.useEffect(() => {
    try {
      video.current.play()
    } catch (error) {
      if (error) {
        console.log(error)
      }
    }
  }, [])

  return (
    <div className='w-full'>
      <video
        ref={video}
        src={require('../public/assets/front/landing-video.mp4')}
        autoPlay={true}
        loop={true}
      />
    </div>
  )
}
