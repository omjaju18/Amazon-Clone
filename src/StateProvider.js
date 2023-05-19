// setup data layer
// we need this to track the basket
import React from "react";
import { createContext, useContext, useReducer } from "react";

// This is DATA LAYER
export const StateContext = createContext();

// Build a PROVIDER
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

// THis is how we use it inside of a component
export const useStateValue = () => useContext(StateContext);
