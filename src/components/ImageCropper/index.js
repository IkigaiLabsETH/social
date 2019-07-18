import React, { PureComponent } from 'react';
import { Image, ImageEditor, Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

const window = Dimensions.get('window');
const w = window.width;
const h = window.height;

const getPercentFromNumber = (percent, numberFrom) => (numberFrom / 100) * percent;

const getPercentDiffNumberFromNumber = (number, numberFrom) => (number / numberFrom) * 100;

export { getPercentFromNumber, getPercentDiffNumberFromNumber };

class ImageCropper extends PureComponent {
    constructor() {
        super();
        this.imageZoom = React.createRef();
    }

    state = {
        positionX: 0,
        positionY: 0,
        width: 0,
        height: 0,
        minScale: 1.01,
        adjustedHeight: 0,
        loading: true,
    };

    static crop = params => {
        const {
            imageUri,
            cropSize,
            positionX,
            positionY,
            screenSize,
            srcSize,
            fittedSize,
            scale,
        } = params;

        const offset = {
            x: 0,
            y: 0,
        };

        const wScale = screenSize.w / scale;
        const percentCropperAreaW = getPercentDiffNumberFromNumber(wScale, fittedSize.w);
        const percentRestW = 100 - percentCropperAreaW;
        const hiddenAreaW = getPercentFromNumber(percentRestW, fittedSize.w);

        const percentCropperAreaH = getPercentDiffNumberFromNumber(wScale, fittedSize.h);
        const percentRestH = 100 - percentCropperAreaH;
        const hiddenAreaH = getPercentFromNumber(percentRestH, fittedSize.h);

        const x = hiddenAreaW / 2 - positionX;
        const y = hiddenAreaH / 2 - positionY;

        offset.x = x <= 0 ? 0 : x;
        offset.y = y <= 0 ? 0 : y;

        const srcPercentCropperAreaW = getPercentDiffNumberFromNumber(offset.x, fittedSize.w);
        const srcPercentCropperAreaH = getPercentDiffNumberFromNumber(offset.y, fittedSize.h);

        const offsetW = getPercentFromNumber(srcPercentCropperAreaW, srcSize.w);
        const offsetH = getPercentFromNumber(srcPercentCropperAreaH, srcSize.h);

        const sizeW = getPercentFromNumber(percentCropperAreaW, srcSize.w);
        const sizeH = getPercentFromNumber(percentCropperAreaH, srcSize.h);

        offset.x = offsetW;
        offset.y = offsetH;

        const cropData = {
            offset,
            size: {
                width: sizeW,
                height: sizeH,
            },
            displaySize: {
                width: cropSize.width,
                height: cropSize.height,
            },
        };

        return new Promise((resolve, reject) =>
            ImageEditor.cropImage(imageUri, cropData, resolve, reject),
        );
    };

    componentDidMount() {
        const { imageUri } = this.props;

        Image.getSize(imageUri, (width, height) => {
            const { setCropperParams } = this.props;

            const srcSize = { w: width, h: height };
            const fittedSize = { w: 0, h: 0 };
            let scale = 1.01;

            const screenSize = {
                w,
                h,
            };

            if (width > height) {
                const ratio = w / height;
                fittedSize.w = width * ratio;
                fittedSize.h = w;
            } else if (width < height) {
                const ratio = w / width;
                fittedSize.w = w;
                fittedSize.h = height * ratio;
            } else if (width === height) {
                scale = 1;
                fittedSize.w = w;
                fittedSize.h = w;
            }

            this.setState(
                prevState => ({
                    ...prevState,
                    screenSize,
                    srcSize,
                    fittedSize,
                    minScale: scale,
                    loading: false,
                }),
                () => {
                    this.imageZoom.current.centerOn({
                        x: 0,
                        y: 0,
                        scale,
                        duration: 0,
                    });
                    setCropperParams(this.state);
                },
            );
        });
    }

    handleMove = ({ positionX, positionY, scale }) => {
        const { setCropperParams } = this.props;

        this.setState(
            prevState => ({
                ...prevState,
                positionX,
                positionY,
                scale,
            }),
            () => setCropperParams(this.state),
        );
    };

    render() {
        const { loading, fittedSize, minScale } = this.state;
        const { imageUri, ...restProps } = this.props;
        const imageSrc = { uri: imageUri };

        return !loading ? (
            <View>
                <ImageZoom
                    ref={this.imageZoom}
                    {...restProps}
                    cropWidth={w}
                    cropHeight={w}
                    imageWidth={fittedSize.w}
                    imageHeight={fittedSize.h}
                    minScale={minScale}
                    onMove={this.handleMove}
                >
                    <Image style={{ width: fittedSize.w, height: fittedSize.h }} source={imageSrc} />
                </ImageZoom>
                <Button
                    title="confirm"
                    onPress={async () => {
                        this.crop(this.props.imageUri);
                    }}
                />
            </View>
        ) : null;
    }
}

export default ImageCropper;
