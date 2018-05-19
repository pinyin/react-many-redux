import {Action} from '@pinyin/redux'
import * as React from 'react'
import {createStore, Store, Unsubscribe} from 'redux'
import {ConsumerChildren} from './ConsumerChildren'
import {ConsumerProps} from './ConsumerProps'
import {ProviderProps} from './ProviderProps'
import {StoreContext} from './StoreContext'

export function createStoreContext<Actions extends object, State extends object = object>(
    defaultState: State
): StoreContext<State, Actions> {
    const defaultStore: Store<State, Action<Actions>> = createStore(() => defaultState)
    const InternalContext = React.createContext<Store<State, Action<Actions>>>(defaultStore)

    class Provider extends React.Component<ProviderProps<State, Actions>> {
        render() {
            return <InternalContext.Provider value={this.props.store}>
                {this.props.children}
            </InternalContext.Provider>
        }
    }

    class Consumer extends React.Component<ConsumerProps<State, Actions>> {
        render() {
            return <InternalContext.Consumer>
                {(store: Store<State, Action<Actions>>) =>
                    <StoreObserver store={store} distinct={this.props.distinct || ((prev, curr) => prev === curr)}>
                        {this.props.children}
                    </StoreObserver>
                }
            </InternalContext.Consumer>
        }
    }

    class StoreObserver extends React.Component<StoreObserverProps<State, Actions>, StoreObserverState<State, Actions>> {
        constructor(props: StoreObserverProps<State, Actions>) {
            super(props)
            this.unsubscribe = props.store.subscribe(() => this.updateState())
            this.state = {state: props.store.getState()}
        }

        shouldComponentUpdate(nextProps: StoreObserverProps<State, Actions>, nextState: StoreObserverState<State, Actions>): boolean {
            if (nextProps !== this.props) {
                return true
            }
            return nextProps.distinct(this.state.state, nextState.state)
        }

        render() {
            return this.props.children({state: this.state.state, dispatch: this.props.store.dispatch})
        }

        componentDidUpdate(prevProps: { store: Store<State, Action<Actions>> }) {
            if (this.props.store !== prevProps.store) {
                this.unsubscribe()
                this.setState({state: this.props.store.getState()})
                this.unsubscribe = this.props.store.subscribe(() => this.updateState())
            }
        }

        componentWillUnmount() {
            this.unsubscribe()
        }

        private updateState() {
            this.setState({state: this.props.store.getState()})
        }

        private unsubscribe: Unsubscribe
    }

    return {Provider, Consumer}
}

type StoreObserverProps<State extends object, Actions extends object> = {
    store: Store<State, Action<Actions>>,
    distinct: (prev: State, curr: State) => boolean
    children: ConsumerChildren<State, Actions>
}
type StoreObserverState<State extends object, Actions extends object> = {
    state: State
}
