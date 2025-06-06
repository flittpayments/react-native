import { Dimensions, Platform } from 'react-native'

const VERSION = '1.2.0'

export async function createDeviceFingerprint() {
    const root: any = {}
    const data: any = {}

    const deviceId = await getDeviceId()

    data.user_agent = getUserAgent()
    data.language = getDeviceLanguage()
    data.resolution = [getScreenWidth(), getScreenHeight()]
    data.timezone_offset = getTimezoneOffset()
    data.platform_name = 'react_native_sdk'
    data.platform_version = VERSION
    data.platform_os = Platform.OS
    data.sdk = 'react_native_sdk'
    data.platform_product = getPlatformVersion()
    data.platform_type = getDeviceType()

    root.id = deviceId
    root.data = data

    return root
}

export async function getEncodedDeviceFingerprint(): Promise<string> {
    try {
        const fingerprint = await createDeviceFingerprint()
        return btoa(JSON.stringify(fingerprint))
    } catch (e) {
        console.error('Error creating device fingerprint', e)
        return ''
    }
}

function getUserAgent(): string {
    return `ReactNative/${Platform.OS} (${Platform.Version})`
}

function getDeviceLanguage(): string {
    try {
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
            const locale = Intl.DateTimeFormat().resolvedOptions().locale
            return locale || 'en-US'
        }
        return 'en-US'
    } catch {
        return 'en-US'
    }
}

function getScreenWidth(): number {
    try {
        return Dimensions.get('window').width
    } catch {
        return 0
    }
}

function getScreenHeight(): number {
    try {
        return Dimensions.get('window').height
    } catch {
        return 0
    }
}

function getTimezoneOffset(): number {
    try {
        return new Date().getTimezoneOffset()
    } catch {
        return 0
    }
}

function getPlatformVersion(): string {
    return Platform.Version?.toString() ?? 'unknown'
}

function getDeviceType(): string {
    try {
        const { width, height } = Dimensions.get('window')
        const aspectRatio = height / width
        return width >= 768 || aspectRatio < 1.6 ? 'tablet' : 'mobile'
    } catch {
        return 'mobile'
    }
}

async function getDeviceId(): Promise<string> {
    return generateUUID().replace(/-/g, '')
}

function btoa(str: string): string {
    try {
        const Buffer = require("buffer").Buffer;
        return new Buffer(str).toString("base64");
    } catch (e) {
        console.error('Error in btoa:', e);
        return '';
    }
}

function generateUUID(): string {
    let d = new Date().getTime()
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now()
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}
