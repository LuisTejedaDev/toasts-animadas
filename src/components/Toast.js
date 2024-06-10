import {useEffect} from 'react'
import {StyleSheet, Text, TouchableOpacity, View, useWindowDimensions} from 'react-native'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import {Info, Success, Warning} from '../colors'
import {useDispatch, useSelector} from 'react-redux'
import {selectToastAction, selectToastInfo, setToastAction} from '../slices/toastSlice'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import Animated, {Extrapolation, interpolate, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming} from 'react-native-reanimated'

const {width} = useWindowDimensions()

const TIME_TO_ACTIVATE_PAN = 100
const TOUCH_SLOP = 5

export default ({handleConfirm = undefined}) => {
    
    const dispatch = useDispatch()
    
    const progress = useSharedValue(0)

    const usedWidth = (width * 80) / 100
    const halfWidth = usedWidth / 2

    const touchStart = useSharedValue({ x: 0, y: 0, time: 0 });

    const direction = useSharedValue('left')
    const swipeTranslateX = useSharedValue(-width)
    const pressed = useSharedValue(false)

    const toastAction = useSelector(selectToastAction)
    const toastInfo = useSelector(selectToastInfo)

    const {title, subtitle, type, confirm} = toastInfo

    /* Esto es lo necesario para la animación automatica */

    const handleResetToast = () => {
        swipeTranslateX.value = withSpring(direction.value === 'left' ? -width : width)
        progress.value = 0
        dispatch(setToastAction(false))
    }

    useDerivedValue(() => {
        if(progress.value === 1) runOnJS(handleResetToast)()
    })

    useDerivedValue(() => {
        if(swipeTranslateX.value === 0) progress.value = withTiming(1, {duration: 3500})
    })
    
    const handleAnimation = () => {
        swipeTranslateX.value = withSpring(toastAction ? 0 : direction.value === 'left' ? -width : width)
    }

    useEffect(() => {
        handleAnimation()
    }, [toastAction])

    const animatedProgress = useAnimatedStyle(() => ({
        width: `${interpolate(
            progress.value,
            [0, 1],
            [0, 100],
            Extrapolation.CLAMP
        )}%`
    }))
    
    /* Todo lo necesario para el gesture handler */

    const pan = Gesture.Pan()

        .manualActivation(true)
        .onTouchesDown((e) => {
            touchStart.value = {
                x: e.changedTouches[0].x,
                y: e.changedTouches[0].y,
                time: Date.now(),
            };
        })
        .onTouchesMove((e, state) => {
            if ((Date.now() - touchStart.value.time) > TIME_TO_ACTIVATE_PAN) state.activate();
            else if (
                Math.abs(touchStart.value.x - e.changedTouches[0].x) > TOUCH_SLOP ||
                Math.abs(touchStart.value.y - e.changedTouches[0].y) > TOUCH_SLOP
            ) state.fail();
        })

        .onBegin(() => {
            pressed.value = true
        })
        .onChange((event) => {
            swipeTranslateX.value = event.translationX
        })
        .onFinalize(() => { 
            pressed.value = false
            if(swipeTranslateX.value > halfWidth){ 
                direction.value = 'right'
                progress.value = 0
                runOnJS(handleResetToast)()
            } else if(swipeTranslateX.value < -halfWidth){
                direction.value = 'left'
                progress.value = 0
                runOnJS(handleResetToast)()
            } else { 
                swipeTranslateX.value = withSpring(0)
            }
        });
 
    const translateStyles = useAnimatedStyle(() => ({
        transform: [
            {translateX: swipeTranslateX.value},
            {scale: withSpring(pressed.value ? 0.96 : 1)}
        ]
    }))

    return(
        <GestureDetector gesture={pan}>
            <Animated.View style={[styles.container, translateStyles]}>

                <View style={[styles.toast, styles.shadow, {shadowColor: type === 1 ? Success : type === 2 ? Info : Warning, borderColor: type === 1 ? Success : type === 2 ? Info : Warning}]}>
                    
                    <View style={{height: 'auto', alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: confirm ? 0 : 10}}>
                        <View style={styles.iconContainer}>
                            <View style={[styles.icon, {backgroundColor: type === 1 ? Success : type === 2 ? Info : Warning}]}>
                                {
                                    type === 1 || type === 2
                                    ?
                                        <FontAwesome name={type === 1 ? 'check' : 'info'} size={12} color={'#fff'}/>
                                    :
                                        <Material name={'exclamation-thick'} size={12} color={'#fff'}/>
                                }
                            </View>
                        </View>
                        <View style={{height: 'auto', flex: 1}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#383838', marginBottom: 5}}>{title}</Text>
                            <Text style={{fontSize: 14, color: '#666666'}}>{subtitle}</Text>
                        </View>
                    </View>
 
                    {
                        confirm
                        &&
                            <View style={{height: 45, flex: 1, flexDirection: 'row', marginBottom: 5}}>
                                <View style={styles.iconContainer}/>

                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                                    <TouchableOpacity 
                                        onPress={handleResetToast}
                                        style={{backgroundColor: Warning, justifyContent: 'center', alignItems: 'center', padding: 5, borderRadius: 2}}>
                                        <Text style={{fontSize: 14, fontWeight: 'bold', color: '#fff'}}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                                    <TouchableOpacity 
                                        onPress={handleConfirm}
                                        style={{justifyContent: 'center', alignItems: 'center', padding: 5}}>
                                        <Text style={{fontSize: 14, fontWeight: 'bold', color: Warning}}>Confirmar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }

                    <View style={styles.progressContainer}>
                        <Animated.View style={[styles.progress, animatedProgress]}/>
                    </View>
                    
                </View>
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 20,
    },
    toast: {
        height: 'auto',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 4,
        borderWidth: 0.4,
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    iconContainer: {
        height: 30,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        paddingLeft: 1,
        borderRadius: 25
    },
    progressContainer: {
        height: 5,
        alignSelf: 'stretch',
        backgroundColor: '#dadada',
        borderRadius: 8,
        overflow: 'hidden'
    },
    progress: {
        height: '100%',
        width: '30%',
        position: 'absolute',
        left: 0,
        backgroundColor: '#ffc107'
    }
})