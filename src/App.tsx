import { useState } from 'react'
import './index.css'
import type { View, User, RegisterData } from './types'
import LoginScreen from './components/auth/LoginScreen'
import RegisterStep1 from './components/auth/RegisterStep1'
import RegisterStep2 from './components/auth/RegisterStep2'
import RegisterStep3 from './components/auth/RegisterStep3'
import MainLayout from './components/MainLayout'

const defaultRegisterData: RegisterData = {
  email: '',
  password: '',
  birthday: '',
  phone: '',
  avatarUrl: '',
  name: '',
  height: '',
  weight: '',
  sexuality: '',
  position: '',
  lookingFor: [],
}

export default function App() {
  const [view, setView] = useState<View>('login')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [registerData, setRegisterData] = useState<RegisterData>(defaultRegisterData)

  function updateRegisterData(partial: Partial<RegisterData>) {
    setRegisterData(prev => ({ ...prev, ...partial }))
  }

  function handleRegistrationComplete(user: User) {
    setCurrentUser(user)
    setView('main')
  }

  function renderScreen() {
    if (view === 'login') {
      return (
        <LoginScreen
          onLogin={() => setView('main')}
          onGoRegister={() => setView('register-1')}
        />
      )
    }
    if (view === 'register-1') {
      return (
        <RegisterStep1
          data={registerData}
          onChange={updateRegisterData}
          onNext={() => setView('register-2')}
          onBack={() => setView('login')}
        />
      )
    }
    if (view === 'register-2') {
      return (
        <RegisterStep2
          data={registerData}
          onChange={updateRegisterData}
          onNext={() => setView('register-3')}
          onBack={() => setView('register-1')}
        />
      )
    }
    if (view === 'register-3') {
      return (
        <RegisterStep3
          data={registerData}
          onComplete={handleRegistrationComplete}
          onBack={() => setView('register-2')}
        />
      )
    }
    return <MainLayout currentUser={currentUser} />
  }

  return (
    <div
      className="w-full bg-gray-950 flex flex-col overflow-hidden"
      style={{ maxWidth: 430, height: '100dvh' }}
    >
      {renderScreen()}
    </div>
  )
}
