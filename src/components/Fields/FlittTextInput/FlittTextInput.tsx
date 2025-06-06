// Updated functional version of all components with 'cloudipsp' renamed to 'flitt'

// 1. FlittFieldBase.tsx
import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'

export type FlittInputProps = TextInputProps

export interface FlittFieldBaseHandle {
    _selfName(): string
    _setEnable(value: boolean): void
    _setText(text: string): void
    _getText(): string
    _setMaxLength(value: number): void
    focus(): void
    isValid(): boolean
    __onChangeText__?: (text: string) => void
}

interface Props extends FlittInputProps {
    getSelfName: () => string
    isSecure?: boolean
    maxLengthDefault: number
    validate?: (text: string) => boolean
}

export const FlittFieldBase = forwardRef<FlittFieldBaseHandle, Props>(
    ({ getSelfName, isSecure = false, maxLengthDefault, validate, ...rest }, ref) => {
        const [text, setText] = useState('')
        const [enabled, setEnabled] = useState(true)
        const [maxLength, setMaxLength] = useState(maxLengthDefault)

        const inputRef = useRef<TextInput>(null)

        useImperativeHandle(ref, () => ({
            _selfName: () => getSelfName(),
            _setEnable: (value: boolean) => setEnabled(value),
            _setText: (value: string) => setText(value),
            _getText: () => text,
            _setMaxLength: (value: number) => setMaxLength(value),
            focus: () => inputRef.current?.focus(),
            isValid: () => (validate ? validate(text) : true)
        }))

        return (
            <TextInput
                ref={inputRef}
                {...rest}
                maxLength={maxLength}
                secureTextEntry={isSecure}
                editable={enabled}
                keyboardType="numeric"
                value={text}
                onChangeText={(val) => {
                    setText(val)
                    rest.onChangeText?.(val)
                }}
            />
        )
    }
)

