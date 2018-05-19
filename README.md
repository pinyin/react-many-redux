# react-many-redux

Redux stores with the new Context API.

# Install

`npm install @pinyin/react-many-redux`

TypeScript should be supported out of the box.

# Usage

```typescript jsx
import {createStoreContext} from '@pinyin/react-many-redux'
import {createStore} from 'redux'

const {Provider, Consumer} = createStoreContext({counter: 0})
const store = createStore()  // create a redux store

<Provider store={store}>
{/*...use store in descendants */}
    <Consumer distinct={(prev, curr)=> /* Optional. Receives two states, returns a boolean which indicates whether children should be updated */}>
    {
        ({state, dispatch})=> {
            // state: store state
            // dispatch: store.dispatch, dispatch action to store
        }
    }
    </Consumer>
</Provider>
```

see [test](./src/createStoreContext.test.tsx) for a more complete example.

# Notice

This project is in early development.

# License 
MIT
