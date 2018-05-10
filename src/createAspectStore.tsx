import {PropsOf} from '@pinyin/react'
import {Action} from '@pinyin/redux'
import * as React from 'react'
import {Store, Unsubscribe} from 'redux'
import {AspectStore, ConsumerChildren, ConsumerProps, ProviderProps} from './AspectStore'

export function createAspectStore<State extends object, Actions extends object>(
    defaultStore: Store<State, Action<Actions>>
): AspectStore<State, Actions> {
    const AspectContext = React.createContext<Store<State, Action<Actions>>>(defaultStore)

    class Provider extends React.PureComponent<ProviderProps<State, Actions>> {
        render() {
            return <AspectContext.Provider value={this.props.store}>
                {this.props.children}
            </AspectContext.Provider>
        }
    }

    class Consumer extends React.PureComponent<ConsumerProps<State, Actions>> {
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
        storeState: State
    }> {
        constructor(props: PropsOf<StoreObserver>) {
            super(props)
            this.unsubscribe = props.store.subscribe(() => this.updateState())
        }

        shouldComponentUpdate(nextProps: { store: Store<State, Action<Actions>> },
                              nextState: any): boolean {
            if (nextState !== this.state) {
                return true
            }
            if (nextProps.store !== this.props.store) {
                return true
            }
            return false
        }

        render() {
            return this.props.children(this.state.storeState, this.props.store.dispatch)
        }

        componentWillUnmount() {
            this.unsubscribe()
        }

        private updateState() {
            this.setState({storeState: this.props.store.getState()})
        }

        private unsubscribe: Unsubscribe
    }

    return {Provider, Consumer}
}

