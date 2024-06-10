import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    values: {}
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        /* Esta función es para agregar una propiedad a la vez */
        setValue: (state, action) => {
            state.values = {
                ...state.values,
                [action.payload.property]: action.payload.value,
            }
        },
        /* Esta función es para agregar más de 1 propiedad a la vez */
        setRestValues: (state, action) => {
            state.values = {
                ...state.values,
                ...action.payload,
            }
        },
    }
})

export const {setValue, setRestValues} = navSlice.actions

export const selectValues = (state) => state.navReduxForm.values;

export default navSlice.reducer