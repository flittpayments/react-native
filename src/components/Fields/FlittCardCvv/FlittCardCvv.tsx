import {isCvv4Length} from "../../../helpers/utils/isValidCardNumber";
import {useForm, UseFormReturn} from "../../../helpers/hooks/useForm";
import {FormField} from "../FormField/FormField";

interface FlittCardCvvProps {
    form?: UseFormReturn
}

export const FlittCardCvv: React.FC<FlittCardCvvProps> = ({ form }) => {
    const {register, watch} = form || useForm()

    const cardNumber = watch('cardNumber');

    return (
        <FormField
            label="CVV"
            placeholder="123"
            {...register({
                name: 'cvv',
                rules: {
                    required: 'CVV is required',
                    validate: (value: string) => {
                        const requiredLength = isCvv4Length(cardNumber as any) ? 4 : 3;
                        return value.length === requiredLength || `CVV must be ${requiredLength} digits`;
                    },
                },
            })}
            keyboardType="numeric"
            maxLength={isCvv4Length(cardNumber as any) ? 4 : 3}
            secureTextEntry
        />
    )
}
