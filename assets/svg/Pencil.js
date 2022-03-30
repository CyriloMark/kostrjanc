import Svg, { Rect, Polygon } from "react-native-svg"

export default function Pencil(props) {

    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            <Rect x="69.52" y="109.22" width="449.75" height="192.75" rx="52.05" ry="52.05" transform="translate(-59.15 268.39) rotate(-45)" fill={props.fill}/>
            <Polygon points="59.06 304.64 29.53 402.32 0 500 97.68 470.47 195.36 440.94 127.21 372.79 59.06 304.64" fill={props.fill}/>
        </Svg>
    )
}
