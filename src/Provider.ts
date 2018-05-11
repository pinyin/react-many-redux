import {ComponentType} from 'react'
import {ProviderProps} from './ProviderProps'

export type Provider<State extends object, Actions extends object> =
    ComponentType<ProviderProps<State, Actions>>
