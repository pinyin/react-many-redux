import {Action} from '@pinyin/redux'
import {ReactNode} from 'react'
import {Dispatch} from 'redux'

export type ConsumerChildren<State extends object, Actions extends object> =
    (params: { state: State, dispatch: Dispatch<Action<Actions>> }) => ReactNode
