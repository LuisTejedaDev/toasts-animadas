import { useEffect } from "react";
import { Keyboard } from "react-native";
import { useDispatch } from "react-redux";
import { setKeyboard } from "../slices/appSlice";

export default () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const showKeyboard = Keyboard.addListener('keyboardDidShow', () => dispatch(setKeyboard(true)))
        const hideKeyboard = Keyboard.addListener('keyboardDidHide', () => dispatch(setKeyboard(false)))

        return () => {
            showKeyboard.remove()
            hideKeyboard.remove()
        }

    }, [])
}