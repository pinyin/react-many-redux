import {PropsOf} from '@pinyin/react'
import {Action} from '@pinyin/redux'
import * as React from 'react'
import {Dispatch, Store, Unsubscribe} from 'redux'
import {AspectStore, ConsumerChildren, ConsumerProps, ProviderProps} from './AspectStore'

export function createAspectStore<State extends object, Actions extends object>(
    defaultStore: Store<State, Action<Actions>>
): AspectStore<State, Actions> {
    const AspectContext = React.createContext<Store<State, Action<Actions>>>(defaultStore)

    class Provider extends React.Component<ProviderProps<State, Actions>> {
        render() {
            return <AspectContext.Provider value={this.props.store}>
                {this.props.children}
            </AspectContext.Provider>
        }
    }

    class Consumer extends React.Component<ConsumerProps<State, Actions>> {
        render() {
            return <AspectContext.Consumer>
                {(store: Store<State, Action<Actions>>) =>
                    <StoreObserver store={store}>
                        {this.props.children}
                    </StoreObserver>
                }
            </AspectContext.Consumer>
        }
    }

    class StoreObserver extends React.Component<{
        store: Store<State, Action<Actions>>,
        children: ConsumerChildren<State, Actions>
    }, {
        state: State,
        dispatch: Dispatch<Action<Actions>>
    }> {
        constructor(props: PropsOf<StoreObserver>) {
            super(props)
            this.unsubscribe = props.store.subscribe(() => this.updateState())
            this.state = {
                state: props.store.getState(),
                dispatch: props.store.dispatch
            }
        }

        render() {
            return this.props.children(this.state.state, this.state.dispatch)
        }

        componentDidUpdate(prevProps: { store: Store<State, Action<Actions>> }) {
            if (this.props.store !== prevProps.store) {
                this.unsubscribe()
                this.setState({dispatch: this.props.store.dispatch})
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

