import {Consumer} from './Consumer'
import {Provider} from './Provider'

export type StoreContext<State extends object, Actions extends object> = {
    Provider: Provider<State, Actions>
    Consumer: Consumer<State, Actions>
}
