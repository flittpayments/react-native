#import <React/RCTViewManager.h>
#import <React/RCTUtils.h>
#import <React/RCTConvert.h>
#import "ApplePayButtonView.h"

@interface RCTConvert (PKPaymentButton)
+ (PKPaymentButtonType)PKPaymentButtonType:(id)json;
+ (PKPaymentButtonStyle)PKPaymentButtonStyle:(id)json;
@end

@implementation RCTConvert (PKPaymentButton)

+ (PKPaymentButtonType)PKPaymentButtonType:(id)json {
    NSString *buttonType = [self NSString:json];

    if ([buttonType isEqualToString:@"buy"]) {
        return PKPaymentButtonTypeBuy;
    } else if ([buttonType isEqualToString:@"setup"]) {
        return PKPaymentButtonTypeSetUp;
    } else if ([buttonType isEqualToString:@"inStore"]) {
        return PKPaymentButtonTypeInStore;
    } else if ([buttonType isEqualToString:@"donate"]) {
        return PKPaymentButtonTypeDonate;
    } else if ([buttonType isEqualToString:@"checkout"]) {
        return PKPaymentButtonTypeCheckout;
    } else if ([buttonType isEqualToString:@"book"]) {
        return PKPaymentButtonTypeBook;
    } else if ([buttonType isEqualToString:@"subscribe"]) {
        return PKPaymentButtonTypeSubscribe;
    }

    return PKPaymentButtonTypePlain;
}

+ (PKPaymentButtonStyle)PKPaymentButtonStyle:(id)json {
    NSString *buttonStyle = [self NSString:json];

    if ([buttonStyle isEqualToString:@"white"]) {
        return PKPaymentButtonStyleWhite;
    } else if ([buttonStyle isEqualToString:@"whiteOutline"]) {
        return PKPaymentButtonStyleWhiteOutline;
    }

    return PKPaymentButtonStyleBlack;
}

@end

@interface ApplePayButtonManager : RCTViewManager
@end

@implementation ApplePayButtonManager

RCT_EXPORT_MODULE(ApplePayButton)

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_CUSTOM_VIEW_PROPERTY(type, NSString, ApplePayButtonView) {
    if (json) {
        [view setButtonType:[RCTConvert PKPaymentButtonType:json]];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(buttonStyle, NSString, ApplePayButtonView) {
    if (json) {
        [view setButtonStyle:[RCTConvert PKPaymentButtonStyle:json]];
    }
}

- (UIView *)view {
    return [[ApplePayButtonView alloc] init];
}

@end
