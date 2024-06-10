import { useDispatch } from "react-redux"
import { setOrientation } from "../slices/appSlice"
import { useEffect } from "react"
import Orientation from "react-native-orientation"

export default () => {
    const dispatch = useDispatch()

    const handleOrientationDidChange = (orientation) => {
        dispatch(setOrientation(orientation))
    }

    useEffect(() => {
        Orientation.addOrientationListener(handleOrientationDidChange)

        return () => Orientation.removeOrientationListener(handleOrientationDidChange)
    }, [])
}