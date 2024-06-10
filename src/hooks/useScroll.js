import {Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';

export default () => {
    
    const translationY = useSharedValue(55);
    const scrollDirection = useSharedValue('up');
    const isScrolling = useSharedValue(false)

    const scrollHandler = useAnimatedScrollHandler({

        onBeginDrag: () => {
            isScrolling.value = true
        },
        onEndDrag: (event) => {
            const velocity = event.velocity.y;

            isScrolling.value = false
    
            if(velocity > 0 && scrollDirection.value === 'down') isScrolling.value = true
        },
        onScroll: (event) => {
            const offsetY = event.contentOffset.y;
            const previousY = translationY.value;
        
            if (offsetY > previousY) scrollDirection.value = 'down';
            else scrollDirection.value = 'up'
        
            translationY.value = offsetY;
        }

    });

    const headerStyleIOS = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: 
                    (scrollDirection.value !== 'down' && !isScrolling.value) 
                    ? 
                        withSpring(
                            interpolate(
                                translationY.value,
                                [0, -55],
                                [0, 55],
                                Extrapolation.CLAMP
                            ),
                            {
                                damping: scrollDirection.value === 'down' ? 5 : 20,
                                stiffness: 80,
                            }
                        )
                    :
                        withTiming(-55, {
                          duration: 600,
                        })
            },
        ],
      }));
    
      const headerStyleAndroid = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withTiming(
                    interpolate(
                        translationY.value,
                        [0, scrollDirection.value === 'down' ? translationY.value : -translationY.value],
                        [0, scrollDirection.value === 'down' ? -55 : 55],
                        Extrapolation.CLAMP
                    )
                ),
            },
        ],
      }));

    return {
        scrollHandler,
        headerStyleIOS,
        headerStyleAndroid
    }
}