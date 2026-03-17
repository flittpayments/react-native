import React from 'react';
import {View, Text, StyleSheet, TextStyle, StyleProp} from 'react-native';

import {Card} from './models';
import {CardLayout} from './CardLayout';
import {CardFieldNumber} from './CardFieldNumber';
import {CardFieldExpMm} from './CardFieldExpMm';
import {CardFieldExpYy} from './CardFieldExpYy';
import {CardFieldCvv} from './CardFieldCvv';
import { Cloudipsp } from './Cloudipsp';
import { IFeeCalculationResponse } from './types/flitt.types';

type Props = {
  labelCardNumber?: string;
  placeholderCardNumber?: string;
  labelExpirity?: string;
  placeholderMM?: string;
  placeholderYY?: string;
  labelCVV?: string;
  placeholderCVV?: string;
  debug?: boolean;
  textStyle?: StyleProp<TextStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  onCardNumberChange?: (text: string) => void;
  cvv2Requirement?: string | null;
  onCompletion?: (input: CardInput) => void;
  amount?: number;
  currency?: string;
  onFeeResult?: (fee: { feeAmount: number | null; totalAmount: number | null; cvv2Requirement: string | null }) => void;
};

export class CardInput extends React.Component<Props> {
  private readonly _cardLayoutRef = React.createRef<CardLayout>();
  private readonly _cardFieldNumberRef = React.createRef<CardFieldNumber>();
  private readonly _cardFieldExpMmRef = React.createRef<CardFieldExpMm>();
  private readonly _cardFieldExpYyRef = React.createRef<CardFieldExpYy>();
  private readonly _cardFieldCvvRef = React.createRef<CardFieldCvv>();
  private _lastBin: string | null = null;

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.amount !== this.props.amount && this._lastBin) {
      this._fetchCardFee(this._lastBin);
    }
  }

  componentWillUnmount(): void {
    this._lastBin = null;
  }

  public readonly getCard = (): Card | null => {
    return this._cardLayoutRef.current?.getCard() ?? null;
  };

  public readonly showCard = (card: Card): void => {
    this._cardLayoutRef.current?.showCard(card);
  };

  public readonly test = (): void => {
    this._cardLayoutRef.current?.test();
  };

  public readonly focus = (): void => {
    this._cardFieldNumberRef.current?.focus();
  };

  private readonly _onSubmitCardFieldNumber = (): void => {
    this._cardFieldExpMmRef.current?.focus();
  };

  private readonly _onSubmitCardFieldExpMm = (): void => {
    this._cardFieldExpYyRef.current?.focus();
  };

  private readonly _onSubmitCardFieldExpYy = (): void => {
    this._cardFieldCvvRef.current?.focus();
  };

  private readonly _onSubmitCardFieldCvv = (): void => {
    this.props.onCompletion?.(this);
  };

  private readonly _fetchCardFee = async (cardBin: string): Promise<void> => {
    const { amount, currency, onFeeResult } = this.props;

    if (!amount || !cardBin || !currency) {
      return;
    }

    try {
      const cloudipsp = new Cloudipsp();
      const responseData = await cloudipsp.calculateFee({
        amount,
        currency,
        cardBin,
      });

      if (!responseData) {
        return;
      }

      onFeeResult?.({
        feeAmount: responseData.fee_amount ?? null,
        totalAmount: responseData.total_amount ?? null,
        cvv2Requirement: (responseData as IFeeCalculationResponse).cvv2_requirement ?? null,
      });
    } catch (e) {
      console.warn('Failed to fetch card fee', e);
    }
  };
  


  private readonly _onCardNumberChange = (text: string): void => {
    this.props.onCardNumberChange?.(text);

    const bin = text.replace(/\s/g, '').slice(0, 6);
    if (bin.length === 6) {
      this._lastBin = bin;
      this._fetchCardFee(bin);
    } else {
      this._lastBin = null; 
    }
  };

  
  render() {
    return (
      <CardLayout
        ref={this._cardLayoutRef}
        inputNumber={this._inputNumberProvider}
        inputExpMm={this._inputExpMmProvider}
        inputExpYy={this._inputExpYyProvider}
        inputCvv={this._inputCvvProvider}
      >
        <Text
          style={this.props.textStyle}
          onPress={this.props.debug ? this.test : undefined}>
          {this.props.labelCardNumber || 'Card Number:'}
        </Text>
        <CardFieldNumber
          ref={this._cardFieldNumberRef}
          placeholder={this.props.placeholderCardNumber}
          onChangeText={this._onCardNumberChange}
          onSubmitEditing={this._onSubmitCardFieldNumber}
          style={this.props.textInputStyle}
        />
        <Text style={this.props.textStyle}>{this.props.labelExpirity || 'Expiry:'}</Text>
        <View style={styles.row}>
          <CardFieldExpMm
            ref={this._cardFieldExpMmRef}
            placeholder={this.props.placeholderMM || 'MM'}
            onSubmitEditing={this._onSubmitCardFieldExpMm}
            style={[styles.flex1, this.props.textInputStyle]}
          />
          <CardFieldExpYy
            ref={this._cardFieldExpYyRef}
            placeholder={this.props.placeholderYY || 'YY'}
            onSubmitEditing={this._onSubmitCardFieldExpYy}
            style={[styles.flex1, this.props.textInputStyle]}/>
        </View>
        {this.props.cvv2Requirement !== 'absent' && (
          <>
            <Text style={this.props.textStyle}>{this.props.labelCVV || 'CVV:'}</Text>
            <CardFieldCvv
              ref={this._cardFieldCvvRef}
              placeholder={this.props.placeholderCVV}
              onSubmitEditing={this._onSubmitCardFieldCvv}
              style={this.props.textInputStyle}
            />
          </>
        )}
      </CardLayout>
    );
  }

  private readonly _inputNumberProvider = () => {
    return this._cardFieldNumberRef.current!;
  };

  private readonly _inputExpMmProvider = () => {
    return this._cardFieldExpMmRef.current!;
  };

  private readonly _inputExpYyProvider = () => {
    return this._cardFieldExpYyRef.current!;
  };

  private readonly _inputCvvProvider = () => {
    return this._cardFieldCvvRef.current!;
  };
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  flex1: {
    flex: 1
  }
});
