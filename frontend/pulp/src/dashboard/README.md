# Dashboard

## Code Map

`actions` Directory for redux actions. Other parts of the code can import these
and dispatch redux actions.

`components` Directory for react components.

`reducers` Directory for redux reducers. These handle the dispatched redux
actions and alters the redux state for the app. All of the reducers are combined
together in `reducer.js`.

`index.jsx` The dashboard is rendered here and the redux store is created here.
Also the initialize state action is dispatched here...

`websockets.js` Websockets needed their own file because they didn't really fit
into any of the other categories. This file creates a websockets and connects it
to the event handlers needed to handle the messages properly. Websockets are
actually created as part of the initialization actions.