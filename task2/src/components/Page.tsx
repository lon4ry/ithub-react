import { LoginForm } from './LoginForm'
import { Profile } from './Profile'

// Промежуточный компонент: не получает и не передаёт данные авторизации
export function Page() {
  return (
    <main className="page">
      <section className="card">
        <LoginForm />
      </section>
      <section className="card">
        <Profile />
      </section>
    </main>
  )
}
