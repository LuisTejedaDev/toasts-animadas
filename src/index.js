import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import { Toast } from "./components"
import { Info, Success, Warning, primary } from "./colors"
import { useDispatch } from "react-redux"
import { setToastAction, setToastInfo } from "./slices/toastSlice"

export default () => {

    const dispatch = useDispatch()

    const handleSuccess = () => {
        dispatch(setToastAction(true))
        dispatch(setToastInfo({
            title: 'Operación Éxitosa',
            subtitle: '¡Se ha guardado el registro correctamente!',
            type: 1,
            confirm: false
        }))
    }

    const handleInfo = () => {
        dispatch(setToastAction(true))
        dispatch(setToastInfo({
            title: 'Campos Vacios',
            subtitle: 'Para continuar con el registro, necesita llenar todos los campos.',
            type: 2,
            confirm: false
        }))
    }

    const handleWarning = () => {
        dispatch(setToastAction(true))
        dispatch(setToastInfo({
            title: 'Eliminar Registro',
            subtitle: '¿Seguro que desea eliminar el registro?.',
            type: 3,
            confirm: true
        }))
    }

    const handleDelete = () => console.log('eliminamos!')

    return(
        <>
            <SafeAreaView style={{backgroundColor: primary}}/>
            <View style={styles.container}>
               
            </View>
            <SafeAreaView style={{backgroundColor: primary}}/>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    button: {
        height: 50,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 15
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    }
})