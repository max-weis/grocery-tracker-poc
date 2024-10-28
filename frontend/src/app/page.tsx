import Layout from './components/layout'
import ClientSideContent from './components/client-side-content'
import { AppProvider } from './components/app-context'

export default function Home() {
  return (
    <AppProvider>
      <Layout>
        <ClientSideContent />
      </Layout>
    </AppProvider>
  )
}