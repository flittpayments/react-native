#import <UIKit/UIKit.h>
#import <PassKit/PassKit.h>
#import <React/RCTComponent.h>

@interface ApplePayButtonView : UIView

// Properties
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@property (nonatomic, assign) PKPaymentButtonType buttonType;
@property (nonatomic, assign) PKPaymentButtonStyle buttonStyle;

// Methods
- (void)setButtonType:(PKPaymentButtonType)buttonType;
- (void)setButtonStyle:(PKPaymentButtonStyle)buttonStyle;
- (void)updateButton;

@end
