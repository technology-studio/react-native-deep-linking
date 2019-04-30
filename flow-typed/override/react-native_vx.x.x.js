/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-08-18T15:37:07+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

declare module 'ReactNativePropRegistry' {
  declare module.exports: any;
}

declare module 'react-native' {
  declare type Styles = {[key: string]: Object};
  declare type StyleSheetType<S: Styles> = {[key: $Keys<S>]: number};
  declare type StyleId = number;
  // TODO: use StyleProp type instead of simplified Style type
  // declare type StyleProp<T, V> = false | null | void | T | V | Array<StyleProp<T, V>>;
  declare type Style = false | null | void | Object | StyleId | Array<Style>;
  declare type StyleSheetModule = {
    create<S: Styles>(obj: S): StyleSheetType<S>;
    flatten: (style: Style) => Object, // TODO: specify more propery https://gist.github.com/lelandrichardson/c037f46885af67ceb447091c908d1471#file-react-native-js-L599
    hairlineWidth: number,
  }

  declare type ImageURISource = $ReadOnly<{|
    uri?: string,
    bundle?: string,
    method?: string,
    headers?: Object,
    body?: string,
    cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached',
    width?: number,
    height?: number,
    scale?: number,
  |}>;

  declare type ImageSource = ImageURISource | number | Array<ImageURISource>;

  declare type ViewLayout = {
    x: number,
    y: number,
    width: number,
    height: number,
  }

  declare type ViewLayoutEvent = {
    nativeEvent: {
      layout: ViewLayout,
    }
  }

  declare type KeyboardEventName =
    | 'keyboardWillShow'
    | 'keyboardDidShow'
    | 'keyboardWillHide'
    | 'keyboardDidHide'
    | 'keyboardWillChangeFrame'
    | 'keyboardDidChangeFrame';

  declare type ScreenRect = $ReadOnly<{|
    screenX: number,
    screenY: number,
    width: number,
    height: number,
  |}>;

  declare type KeyboardEvent = $ReadOnly<{|
    duration?: number,
    easing?: string,
    endCoordinates: ScreenRect,
    startCoordinates?: ScreenRect,
  |}>;

  declare type KeyPressEvent = {
      nativeEvent: {
          key: 'Enter' | 'Backspace' | ' ' | string,
      }
  }

  declare type ChangeEvent = {
    nativeEvent: {
      text: string,
    }
  }

  declare type ScrollViewContentOffsetEvent = {
    nativeEvent: {
      contentOffset: {
        x: number,
        y: number,
      },
      contentSize: {
        width: number,
        height: number,
      },
    }
  }

  declare var ActivityIndicator: any;
  declare var StyleSheet: StyleSheetModule;
  declare var Animated: any;
  declare var FlatList: any;
  declare var SectionList: any;
  declare var View: any;
  declare var ViewPropTypes: any;
  declare var Text: any;
  declare var TextStylePropTypes: any;
  declare var Image: any;
  declare var ImageEditor: any;
  declare var Platform: any;
  declare var ScrollView: any;
  declare var TouchableOpacity: any;
  declare var LayoutAnimation: any;
  declare var Alert: any;
  declare var ViewPagerAndroid: any;
  declare var Linking: any;
  declare var DatePickerIOS: any;
  declare var DatePickerAndroid: any;
  declare var TimePickerAndroid: any;
  declare var BackHandler: any;
  declare var RefreshControl: any;
  declare var PanResponder: any;

  declare type DimensionsType = {
    width: number,
    height: number,
    scale: number,
    fontScale: number,
  };

  declare type DimensionName = 'window' | 'screen';

  declare class Dimensions {
    static set(dims: { [key: DimensionName]: DimensionsType }): void,
    static get(dim: DimensionName): DimensionsType,
    static addEventListener(
      type: string,
      handler: Function
    ): void,
    static removeEventListener(
      type: string,
      handler: Function
    ): void,
  }

  declare var PixelRatio: any;
  declare var AppRegistry: any;
  declare var AsyncStorage: any;
  declare var I18nManager: any;
  declare var TouchableWithoutFeedback: any;
  declare var Picker: any;
  declare var SafeAreaView: any;
  declare var Slider: any;
  declare var Switch: any;
  declare var TextInput: any;
  declare var Modal: any;
  declare var WebView: any;
  declare var NativeModules: any;
  declare var StatusBar: any;
  declare var Keyboard: any;
  declare var KeyboardAvoidingView: any;
  declare var DeviceEventEmitter: any;
  declare var PickerIOS: any;
  declare var requireNativeComponent: any;

  declare type SyntheticEvent<T> = $ReadOnly<{|
    bubbles: ?boolean,
    cancelable: ?boolean,
    currentTarget: number,
    defaultPrevented: ?boolean,
    dispatchConfig: $ReadOnly<{|
      registrationName: string,
    |}>,
    eventPhase: ?number,
    preventDefault: () => void,
    isDefaultPrevented: () => boolean,
    stopPropagation: () => void,
    isPropagationStopped: () => boolean,
    isTrusted: ?boolean,
    nativeEvent: T,
    persist: () => void,
    target: ?number,
    timeStamp: number,
    type: ?string,
  |}>;

  declare type ResponderSyntheticEvent<T> = $ReadOnly<{|
    ...SyntheticEvent<T>,
    touchHistory: $ReadOnly<{|
      indexOfSingleActiveTouch: number,
      mostRecentTimeStamp: number,
      numberActiveTouches: number,
      touchBank: $ReadOnlyArray<
        $ReadOnly<{|
          touchActive: boolean,
          startPageX: number,
          startPageY: number,
          startTimeStamp: number,
          currentPageX: number,
          currentPageY: number,
          currentTimeStamp: number,
          previousPageX: number,
          previousPageY: number,
          previousTimeStamp: number,
        |}>,
      >,
    |}>,
|}>;

  declare type TargetEvent = SyntheticEvent<
    $ReadOnly<{|
      target: number,
    |}>,
  >;

  declare type BlurEvent = TargetEvent;
  declare type FocusEvent = TargetEvent;

  declare type Layout = $ReadOnly<{|
    x: number,
    y: number,
    width: number,
    height: number,
  |}>;

  declare type TextLayout = $ReadOnly<{|
    ...Layout,
    ascender: number,
    capHeight: number,
    descender: number,
    text: string,
    xHeight: number,
  |}>;

  declare type LayoutEvent = SyntheticEvent<
    $ReadOnly<{|
      layout: Layout,
    |}>,
  >;

  declare type TextLayoutEvent = SyntheticEvent<
    $ReadOnly<{|
      lines: Array<TextLayout>,
    |}>,
  >;

  declare type PressEvent = ResponderSyntheticEvent<
    $ReadOnly<{|
      changedTouches: $ReadOnlyArray<$PropertyType<PressEvent, 'nativeEvent'>>,
      force: number,
      identifier: number,
      locationX: number,
      locationY: number,
      pageX: number,
      pageY: number,
      target: ?number,
      timestamp: number,
      touches: $ReadOnlyArray<$PropertyType<PressEvent, 'nativeEvent'>>,
    |}>,
  >;

  declare type ScrollEvent = SyntheticEvent<
    $ReadOnly<{|
      contentInset: $ReadOnly<{|
        bottom: number,
        left: number,
        right: number,
        top: number,
      |}>,
      contentOffset: $ReadOnly<{|
        y: number,
        x: number,
      |}>,
      contentSize: $ReadOnly<{|
        height: number,
        width: number,
      |}>,
      layoutMeasurement: $ReadOnly<{|
        height: number,
        width: number,
      |}>,
      targetContentOffset?: $ReadOnly<{|
        y: number,
        x: number,
      |}>,
      velocity?: $ReadOnly<{|
        y: number,
        x: number,
      |}>,
      zoomScale: number,
    |}>,
  >;

  declare type SwitchChangeEvent = SyntheticEvent<
    $ReadOnly<{|
      value: boolean,
    |}>,
>;
}
