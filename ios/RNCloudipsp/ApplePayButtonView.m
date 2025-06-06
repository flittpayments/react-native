#import "ApplePayButtonView.h"

@implementation ApplePayButtonView {
    PKPaymentButton *_paymentButton;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _buttonType = PKPaymentButtonTypePlain;
        _buttonStyle = PKPaymentButtonStyleBlack;
        [self updateButton];
    }
    return self;
}

- (void)updateButton {
    // Remove existing button if any
    if (_paymentButton) {
        [_paymentButton removeFromSuperview];
    }

    // Create new button with current type and style
    _paymentButton = [PKPaymentButton buttonWithType:_buttonType style:_buttonStyle];
    [_paymentButton addTarget:self
                      action:@selector(buttonTapped)
            forControlEvents:UIControlEventTouchUpInside];

    // Add to view and update layout
    [self addSubview:_paymentButton];
    [self setNeedsLayout];
}

- (void)setButtonType:(PKPaymentButtonType)buttonType {
    if (_buttonType != buttonType) {
        _buttonType = buttonType;
        [self updateButton];
    }
}

- (void)setButtonStyle:(PKPaymentButtonStyle)buttonStyle {
    if (_buttonStyle != buttonStyle) {
        _buttonStyle = buttonStyle;
        [self updateButton];
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    _paymentButton.frame = self.bounds;
}

- (void)buttonTapped {
    if (self.onPress) {
        self.onPress(@{});
    }
}

@end
