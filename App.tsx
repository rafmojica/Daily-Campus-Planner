import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './src/firebase/firebaseConfig'
import LoginScreen from './src/screens/LoginScreen'
import MyLayoutsScreen from './src/screens/MyLayoutsScreen'
import CreateLayoutScreen from './src/screens/CreateLayoutScreen'
import FriendsLayoutsScreen from './src/screens/FriendsLayoutsScreen'
import AddFriendScreen from './src/screens/AddFriendScreen'
import PickDayScreen from './src/screens/PickDayScreen'

const Tab = createBottomTabNavigator()

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) return null

  if (!user) return <LoginScreen />

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="My Layouts" component={MyLayoutsScreen} />
        <Tab.Screen name="Create Layout" component={CreateLayoutScreen} />
        <Tab.Screen name="Friends Layouts" component={FriendsLayoutsScreen} />
        <Tab.Screen name="Add Friend" component={AddFriendScreen} />
        <Tab.Screen name="Pick My Day" component={PickDayScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
