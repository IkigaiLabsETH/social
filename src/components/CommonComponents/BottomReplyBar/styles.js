import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';
import { CUSTOM_TAB_Height } from "../../../theme/constants";

let stylesMap = {
    wrapper : {
        flex: 1, 
        height: CUSTOM_TAB_Height, 
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 10,
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: 'rgba(151, 151, 151, 0.6)',
        marginTop: 5
    },
    text: {
        color: Colors.white,
        marginLeft: 10,
        fontFamily: 'AvenirNext-Medium'
    },
    replyIcon : {
        height:10,
        width:15
    }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
