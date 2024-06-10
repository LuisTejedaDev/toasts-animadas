import { createSlice } from "@reduxjs/toolkit";
import Orientation from 'react-native-orientation'

const initialState = {
    hasConnection: true,
    orientation: Orientation.getInitialOrientation(),
    keyboard: false
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setHasConnection: (state, action) => {state.hasConnection = action.payload},
        setOrientation: (state, action) => {state.orientation = action.payload},
        setKeyboard: (state, action) => {state.keyboard = action.payload},
    }
})

export const {setHasConnection, setOrientation, setKeyboard} = navSlice.actions

export const selectHasConnection = (state) => state.navApp.hasConnection;
export const selectOrientation = (state) => state.navApp.orientation;
export const selectKeyboard = (state) => state.navApp.keyboard;

export default navSlice.reducer