import { action, createStore, persist } from "easy-peasy";

// Import the events into the store

export const store = createStore(persist({
  authId: "guest",
  setAuthId: action((state, payload) => {
    state.authId = payload.authId;
  }),
  setUserName: action((state, payload) => {
    console.log("HERE")
    console.log(payload)
    state.userName = payload.userName
  }),
  setPhotoURL: action((state, payload) => {
    state.photoURL = payload.photoURL
  })
}
));
