import {ComponentType} from 'react'
import {ConsumerProps} from './ConsumerProps'

export type Consumer<State extends object, Actions extends object> =
    ComponentType<ConsumerProps<State, Actions>>


