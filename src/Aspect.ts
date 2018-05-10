import {Action} from '@pinyin/redux'
import {ComponentType, ReactNode} from 'react'
import {Dispatch, Store} from 'redux'

export type Aspect<State extends object, Actions extends object> = {
    Provider: Provider<State, Actions>
    Consumer: Consumer<State, Actions>
}

export type Provider<State extends object, Actions extends object> =
    ComponentType<ProviderProps<State, Actions>>
export type Consumer<State extends object, Actions extends object> =
    ComponentType<ConsumerProps<State, Actions>>


export type ProviderProps<State extends object, Actions extends object> = {
    store: Store<State, Action<Actions>>
}

export type ConsumerProps<State extends object, Actions extends object> = {
    children: ConsumerChildren<State, Actions>
}

export type ConsumerChildren<State extends object, Actions extends object> =
    (state: State, dispatch: Dispatch<Action<Actions>>) => ReactNode
