import {Action} from '@pinyin/redux'
import {Store} from 'redux'

export type ProviderProps<State extends object, Actions extends object> = {
    store: Store<State, Action<Actions>>
}
