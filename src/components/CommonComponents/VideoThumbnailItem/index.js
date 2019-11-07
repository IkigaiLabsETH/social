import {Platform, Dimensions, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import React from 'react';
import FastImage from 'react-native-fast-image';
import Colors from "../../../theme/styles/Colors";
import LinearGradient from "react-native-linear-gradient";
import pepoWhiteIcon from "../../../assets/pepo-white-icon.png";
import inlineStyles from "./style";
import reduxGetters from "../../../services/ReduxGetters";
import AppConfig from "../../../constants/AppConfig";
import multipleClickHandler from '../../../services/MultipleClickHandler'
import Pricer from "../../../services/Pricer";
import deepGet from 'lodash/get';
import ProfilePicture from "../../ProfilePicture";

let getVideoBtAmount = (videoId) => {
    return Pricer.displayAmountWithKFomatter( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ;
}

export default (props) => {
    const isAndroid = "android" === Platform.OS,
        videoId =  deepGet(props, 'payload.video_id'),
        userId = deepGet(props, 'payload.user_id')
        userName = reduxGetters.getUserName(userId),
        imageUrl = reduxGetters.getVideoImgUrl(videoId,null, AppConfig.userVideos.userScreenCoverImageWidth),
        videoDesc =reduxGetters.getVideoDescription(reduxGetters.getVideoDescriptionId(videoId));

    //Begin: Temp Code.

    // Temp thing - change this when using proper component.
    let compRef = null;
    const setCompRef = (ref) => {
        compRef = ref;
        console.log("compRef set");
    };

    //click handler
    const onPressHandler = multipleClickHandler(() => {
        console.log("onPressHandler.compRef", compRef);
        compRef.measure((x,y,width,height,pageX,pageY) => {
            const videoThumbnailMesurements = {
                "x": x,
                "y": y,
                "width": width,
                "height": height,
                "pageX": pageX,
                "pageY": pageY
            };
            triggerOnPressCallback(videoThumbnailMesurements);
        });
        
    });

    const triggerOnPressCallback = (measurements) => {
        console.log("videoThumbnailMesurements",
            "\n--- x", measurements.x,
            "\n--- y", measurements.y,
            "\n--- width", measurements.width,
            "\n--- height", measurements.height,
            "\n--- pageX", measurements.pageX,
            "\n--- pageY", measurements.pageY
        );
        props.onVideoClick && props.onVideoClick(videoId, props.index, measurements);
    };
    
    
    let onLayoutCallback = null;
    // if ( isAndroid ) {
    //     onLayoutCallback = ( syntheticEvent ) => {
    //         const nativeEvent = syntheticEvent.nativeEvent;
    //         const viewLayout = nativeEvent.layout;
    //         console.log("onLayoutCallback viewLayout", viewLayout);
    //         console.log("nativeEvent", nativeEvent);
    //     }
    // }
    


    //End: Temp Code.
    
    return (<View ref={setCompRef} onLayout={onLayoutCallback} collapsable={false} ><TouchableWithoutFeedback onPress={onPressHandler} collapsable={false} >
        <View collapsable={false}>
            <FastImage style={{
                width: (Dimensions.get('window').width - 6) / 2,
                aspectRatio:9/16,
                margin: 1,
                backgroundColor: imageUrl ? Colors.white : Colors.gainsboro
            }}
                       source={{
                           uri: imageUrl,
                           priority: FastImage.priority.high
                       }}/>
            <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.3)']}
                locations={[0,0.4, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{width: (Dimensions.get('window').width - 6) / 2, margin: 1, position: 'absolute', bottom: 0, left: 0}}
            >
                <View style={inlineStyles.videoInfoContainer} collapsable={false}> 
                     <Text style={inlineStyles.videoDescStyle} ellipsizeMode={'tail'} numberOfLines={3}>{videoDesc}</Text>
                     <View style={{flex:1, flexDirection: "row" , marginTop: 5}}>
                        <View style={{flex: 3, flexDirection: "row"}}>
                            <ProfilePicture userId={userId} style={{height: 18, width: 18, borderWidth: 1, borderColor: 'white'}} />
                            <Text style={inlineStyles.videoUserNameStyle} ellipsizeMode={'tail'} numberOfLines={1}>@{userName}</Text>
                        </View>
                        <View style={[inlineStyles.videoStatsContainer]}>
                            <Image style={{height: 12, width: 12, marginTop: 2}} source={pepoWhiteIcon} />
                            <Text style={inlineStyles.videoStatsTxt}>{getVideoBtAmount(videoId)}</Text>
                        </View>
                     </View>        
                </View>
            </LinearGradient>

        </View>
    </TouchableWithoutFeedback></View>);
}