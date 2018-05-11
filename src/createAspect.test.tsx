import {Action} from '@pinyin/redux'
import * as React from 'react'
import {create} from 'react-test-renderer'
import {createStore} from 'redux'
import {createAspect} from './createAspect'

type Actions = { increase: null }
type State = { count: number }

const increase = {type: 'increase'}

const store = createStore((state: { count: number } | undefined, action: Action<Actions>) =>
    state ? {count: state.count + 1} : {count: 0}
)
const Aspect = createAspect<Actions, State>({count: 0})

namespace ID {
    export const Out = "out"
    export const In = "in"
    export const InKeep = "in_keep"
    export const Increase = "increase"
}

class Root extends React.Component {
    render() {
        return <div>
            <Aspect.Provider store={store}>
                <ChildA/>
            </Aspect.Provider>
            <Aspect.Consumer>
                {(state) =>
                    <p id={ID.Out}>{state.count}</p>
                }
            </Aspect.Consumer>
        </div>
    }
}

class ChildA extends React.Component {
    render() {
        return <div>
            <ChildB/>
        </div>
    }
}

// TODO use better way of representing redux action types
class ChildB extends React.Component {
    render() {
        return <div>
            <Aspect.Consumer>
                {(state, dispatch) => <>
                    <p id={ID.In}>{state.count}</p>
                    <button id={ID.Increase} onClick={() => dispatch({type: 'increase', payload: null})}/>
                </>}
            </Aspect.Consumer>
            <Aspect.Consumer distinct={(prev, curr) => curr.count === 1}>
                {(state, dispatch) => <>
                    <p id={ID.InKeep}>{state.count}</p>
                </>}
            </Aspect.Consumer>
        </div>
    }
}

describe(`${createAspect.name}`, () => {
    const testRenderer = create(<Root/>)
    const root = testRenderer.root
    test('default counter should be 0', () => {
        const inText = root.findByProps({id: ID.In}).children
        expect(inText).toEqual(["0"])
        const outText = root.findByProps({id: ID.Out}).children
        expect(outText).toEqual(["0"])
    })
    test('counter should increase after increase button was clicked', async () => {
        const increaseBtn = root.findByProps({id: ID.Increase})
        const click = increaseBtn.props.onClick
        click()
        click()
        await new Promise(then => setTimeout(then, 200))
        const inText = root.findByProps({id: ID.In}).children
        expect(inText).toEqual(["2"])
        const outText = root.findByProps({id: ID.Out}).children
        expect(outText).toEqual(["0"])
        const inKeepText = root.findByProps({id: ID.InKeep}).children
        expect(inKeepText).toEqual(["1"])
    })
})
