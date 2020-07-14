import Alert from '../components/alert'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import Meta from '../components/meta'

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <div className='min-h-screen'>
        <Alert />
        <Navigation />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
