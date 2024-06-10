import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    toastAction: false,
    toastInfo: {
        title: '',
        subtitle: '',
        type: 1,
        confirm: false,
    }
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setToastAction: (state, action) => {state.toastAction = action.payload},
        setToastInfo: (state, action) => {state.toastInfo = action.payload},
    }
})

export const {setToastAction, setToastInfo} = navSlice.actions

export const selectToastAction = (state) => state.navToast.toastAction;
export const selectToastInfo = (state) => state.navToast.toastInfo;

export default navSlice.reducer