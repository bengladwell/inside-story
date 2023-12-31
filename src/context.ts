import { createContext } from 'react'
import { type User } from './@types/models'

export const userContext = createContext<User | null>(null)
