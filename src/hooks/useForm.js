import {useDispatch} from "react-redux"
import {setRestValues, setValue} from "../slices/formSlice"

export default () => {
    const dispatch = useDispatch()

    const handleInputChange = (property, value) => dispatch(setValue({property, value}))
    const handleRestValues = (values) => dispatch(setRestValues(values))

    return {
        handleInputChange,
        handleRestValues
    }
}