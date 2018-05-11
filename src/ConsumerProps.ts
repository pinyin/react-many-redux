import {ConsumerChildren} from './ConsumerChildren'

export type ConsumerProps<State extends object, Actions extends object> = {
    distinct?: (prev: State, curr: State) => boolean
    children: ConsumerChildren<State, Actions>
}
