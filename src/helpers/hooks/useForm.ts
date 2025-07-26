import { useRef, useCallback, useState } from 'react';

export interface FieldConfig {
    name: string;
    rules?: {
        required?: boolean | string;
        minLength?: number | { value: number; message: string };
        maxLength?: number | { value: number; message: string };
        pattern?: RegExp | { value: RegExp; message: string };
        validate?: (value: string) => boolean | string;
    };
    defaultValue?: string;
}

export interface FormError {
    [key: string]: string;
}

export interface FormValues {
    [key: string]: string;
}

export interface UseFormReturn {
    register: (config: FieldConfig) => {
        name: string;
        value: string;
        onChangeText: (text: string) => void;
        error?: string;
    };
    handleSubmit: (onSubmit: (data: FormValues) => void) => () => void;
    watch: {
        (fieldName: string): string;
        (): FormValues;
    };
    setValue: (name: string, value: string) => void;
    clearErrors: (name?: string) => void;
    reset: (values?: FormValues) => void;
    formState: {
        errors: FormError;
        isValid: boolean;
        isDirty: boolean;
        isSubmitting: boolean;
    };
    trigger: (name?: string) => Promise<boolean>;
}

export const useForm = (defaultValues: FormValues = {}): UseFormReturn => {
    const [values, setValues] = useState<FormValues>(defaultValues);
    const [errors, setErrors] = useState<FormError>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fieldsConfig = useRef<{ [key: string]: FieldConfig }>({});

    const validateField = useCallback((name: string, value: string): string | undefined => {
        const config = fieldsConfig.current[name];
        if (!config?.rules) return undefined;

        const { rules } = config;

        // Required validation
        if (rules.required) {
            if (!value.trim()) {
                return typeof rules.required === 'string' ? rules.required : `${name} is required`;
            }
        }

        // MinLength validation
        if (rules.minLength) {
            const minLength = typeof rules.minLength === 'number' ? rules.minLength : rules.minLength.value;
            const message = typeof rules.minLength === 'object' ? rules.minLength.message : `${name} must be at least ${minLength} characters`;

            if (value.length < minLength) {
                return message;
            }
        }

        // MaxLength validation
        if (rules.maxLength) {
            const maxLength = typeof rules.maxLength === 'number' ? rules.maxLength : rules.maxLength.value;
            const message = typeof rules.maxLength === 'object' ? rules.maxLength.message : `${name} must be no more than ${maxLength} characters`;

            if (value.length > maxLength) {
                return message;
            }
        }

        // Pattern validation
        if (rules.pattern) {
            const pattern = rules.pattern instanceof RegExp ? rules.pattern : rules.pattern.value;
            const message = rules.pattern instanceof RegExp ? `${name} format is invalid` : rules.pattern.message;

            if (!pattern.test(value)) {
                return message;
            }
        }

        // Custom validation
        if (rules.validate) {
            const result = rules.validate(value);
            if (typeof result === 'string') {
                return result;
            }
            if (result === false) {
                return `${name} is invalid`;
            }
        }

        return undefined;
    }, []);

    const register = useCallback((config: FieldConfig) => {
        fieldsConfig.current[config.name] = config;

        // Set default value if provided
        if (config.defaultValue && !values[config.name]) {
            setValues(prev => ({ ...prev, [config.name]: config.defaultValue || '' }));
        }

        return {
            name: config.name,
            value: values[config.name] || '',
            onChangeText: (text: string) => {
                setValues(prev => ({ ...prev, [config.name]: text }));
                setTouched(prev => ({ ...prev, [config.name]: true }));

                // Clear error when user starts typing
                if (errors[config.name]) {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[config.name];
                        return newErrors;
                    });
                }
            },
            onBlur: () => {
                // Validate field on blur
                const error = validateField(config.name, values[config.name] || '');
                if (error) {
                    setErrors(prev => ({ ...prev, [config.name]: error }));
                }
            },
            error: errors[config.name],
        };
    }, [values, errors, validateField]);

    const trigger = useCallback(async (name?: string): Promise<boolean> => {
        if (name) {
            // Validate single field
            const error = validateField(name, values[name] || '');
            if (error) {
                setErrors(prev => ({ ...prev, [name]: error }));
                return false;
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
                return true;
            }
        } else {
            // Validate all fields
            const newErrors: FormError = {};
            let isValid = true;

            Object.keys(fieldsConfig.current).forEach(fieldName => {
                const error = validateField(fieldName, values[fieldName] || '');
                if (error) {
                    newErrors[fieldName] = error;
                    isValid = false;
                }
            });

            setErrors(newErrors);
            return isValid;
        }
    }, [values, validateField]);

    const handleSubmit = useCallback((onSubmit: (data: FormValues) => void) => {
        return async () => {
            setIsSubmitting(true);
            const isValid = await trigger();

            if (isValid) {
                onSubmit(values);
            }

            setIsSubmitting(false);
        };
    }, [values, trigger]);

    const watch = useCallback(((fieldName?: string) => {
        if (fieldName) {
            return values[fieldName] || '';
        }
        return values;
    }) as UseFormReturn['watch'], [values]);

    const setValue = useCallback((name: string, value: string) => {
        setValues(prev => ({ ...prev, [name]: value }));
    }, []);

    const clearErrors = useCallback((name?: string) => {
        if (name) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        } else {
            setErrors({});
        }
    }, []);

    const reset = useCallback((newValues?: FormValues) => {
        setValues(newValues || defaultValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [defaultValues]);

    const isDirty = Object.keys(touched).length > 0;
    
    // Calculate isValid: no errors AND all required fields have values
    const isValid = (() => {
        // If there are errors, form is invalid
        if (Object.keys(errors).length > 0) {
            return false;
        }
        
        // Check if all required fields have values
        const requiredFields = Object.values(fieldsConfig.current).filter(field => field.rules?.required);
        const hasAllRequiredValues = requiredFields.every(field => {
            const value = values[field.name] || '';
            return value.trim().length > 0;
        });
        
        return hasAllRequiredValues;
    })();

    return {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        reset,
        formState: {
            errors,
            isValid,
            isDirty,
            isSubmitting,
        },
        trigger,
    };
};
