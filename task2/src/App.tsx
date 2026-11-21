import { AuthProvider } from './auth/AuthProvider'
import { Header } from './components/Header'
import { Page } from './components/Page'

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <Page />
    </AuthProvider>
  )
}
