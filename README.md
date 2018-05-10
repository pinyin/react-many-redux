# react-many-redux

Redux stores with the new Context API.

# Usage

```typescript jsx
import {createAspect} from './index.ts'
import {createStore} from 'redux'

const {Provider, Consumer} = createAspect({counter: 0})
const store = createStore()  // create a redux store

<Provider store={store}>
{/*...use store in descendants */}
    <Consumer>
    {
        (state, dispatch)=> {
            // state: store state
            // dispatch: store.dispatch, dispatch action to store
        }
    }
    </Consumer>
</Provider>
```

see [test](./src/createAspect.test.tsx) for a running example.

# Notice

This project is in early development.

# License 
MIT
