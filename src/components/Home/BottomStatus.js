import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import inlineStyles from './styles';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import reduxGetter from '../../services/ReduxGetters';

import multipleClickHandler from '../../services/MultipleClickHandler';
import InAppBrowser from '../../services/InAppBrowser';

const mapStateToProps = (state, ownProps) => {
  return {
    userName: reduxGetter.getUserName(ownProps.userId, state),
    name: reduxGetter.getName(ownProps.userId, state),
    description: reduxGetter.getVideoDescription(reduxGetter.getVideoDescriptionId(ownProps.videoId, state), state),
    link: reduxGetter.getVideoLink(reduxGetter.getVideoLinkId(ownProps.videoId, state), state),
    supporters: reduxGetter.getVideoSupporters(ownProps.videoId),
    totalBt: reduxGetter.getVideoBt(ownProps.videoId, state)
  };
};

class BottomStatus extends PureComponent {
  constructor(props) {
    super(props);
    this.videoDescriptionId = reduxGetter.getVideoDescriptionId(this.props.videoId);
  }

  onWrapperClick = (e) => {
    this.props.onWrapperClick && this.props.onWrapperClick();
  };

  onLinkClick = () => {
    InAppBrowser.openBrowser(this.props.link);
  };

  onTagPressed = (tag) => {
    let entity = reduxGetter.getTappedIncludesEntity(this.videoDescriptionId, tag);
    this.props.onDescriptionClick && this.props.onDescriptionClick(entity, tag);
  };

  isValidTag(videoId, tappedText) {
    let entity = reduxGetter.getTappedIncludesEntity(videoId, tappedText);
    return !!entity
  }

  render() {
    return (
      <View style={inlineStyles.bottomBg}>

          <View style={{ paddingTop: 8, paddingBottom: 5 }}>
          <TouchableWithoutFeedback onPress={multipleClickHandler(() => this.onWrapperClick())} pointerEvents={'auto'}>
            <Text style={[inlineStyles.handle]} ellipsizeMode={'tail'} numberOfLines={1}>
              {`@${this.props.userName}`}
            </Text>
            </TouchableWithoutFeedback>
            {this.props.description ? (
              <Text
                style={[{ fontSize: 14, flexWrap: 'wrap', fontFamily: 'AvenirNext-Regular', textAlign: 'left' }, inlineStyles.bottomBgTxt]}
                ellipsizeMode={'tail'}
                numberOfLines={3}
              >
                {this.props.description.split(' ').map((item) => {
                  if (item.startsWith('#') && this.isValidTag(this.videoDescriptionId, item)) {
                    let tagText = item.replace("#", "");
                    return(
                      <Text
                        style={[inlineStyles.bottomBgTxt,{
                          fontSize: 14,
                          flexWrap: 'wrap',
                          fontFamily: 'AvenirNext-DemiBold',
                          textAlign: 'left'
                        }]}
                        numberOfLines={1}
                        onPress={()=>{this.onTagPressed(item)}}
                      ><Text style={{fontStyle:'italic'}}>#</Text>{tagText+" "}</Text>
                    );
                  }else {
                    return(<Text>{item+ " "}</Text>);
                  }
                })}
              </Text>
            ) : (
                <React.Fragment />
              )
            }
          </View>

        {this.props.link ? (
          <TouchableWithoutFeedback
            onPress={multipleClickHandler(() => {
             this.onLinkClick();
            })}
            pointerEvents={'auto'}
          >
            <Text
              style={[{ fontSize: 13, paddingBottom: 10, fontFamily: 'AvenirNext-DemiBold', fontWeight: '700'}, inlineStyles.bottomBgTxt]}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {this.props.link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')}
            </Text>
          </TouchableWithoutFeedback>
        ) : (
          <React.Fragment />
        )}
      </View>
    );
  };
}

export default connect(mapStateToProps)(withNavigation(BottomStatus));
