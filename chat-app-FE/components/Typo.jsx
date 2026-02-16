import { Text } from "react-native";
import { colors } from "../constants/theme";
import { verticalScale } from "../utils/styling";

const Typo = ({
    size = 16,
    color = colors.text,
    fontWeight = "400",
    children,
    style,
    textProps = {},
}) => {
    const textStyle = {
        fontSize: verticalScale(size),
        color,
        fontWeight,
    };

    return (
        <Text style={[textStyle, style]} {...textProps}>
            {children}
        </Text>
    );
};

export default Typo;

