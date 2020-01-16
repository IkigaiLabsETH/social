import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { Dimensions } from 'react-native';

let stylesMap = {
    container :{
       flex: 1
    }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
