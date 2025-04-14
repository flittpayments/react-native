import { Dimensions, Platform } from 'react-native'
import packageInfo from '../package.json'

export class DeviceInfoProvider {
    async createDeviceFingerprint() {
        const root: any = {}
        const data: any = {}

        const deviceId = await this.getDeviceId()

        data.user_agent = this.getUserAgent()
        data.language = this.getDeviceLanguage()
        data.resolution = [this.getScreenWidth(), this.getScreenHeight()]
        data.timezone_offset = this.getTimezoneOffset()
        data.platform_name = 'react_native_sdk'
        data.platform_version = packageInfo.version
        data.platform_os = Platform.OS
        data.sdk = 'react_native_sdk'
        data.platform_product = this.getPlatformVersion()
        data.platform_type = this.getDeviceType()

        root.id = deviceId
        root.data = data

        return root
    }

    async getEncodedDeviceFingerprint(): Promise<string> {
        try {
            const fingerprint = await this.createDeviceFingerprint()
            return this.btoa(JSON.stringify(fingerprint))
        } catch (e) {
            console.error('Error creating device fingerprint', e)
            return ''
        }
    }

    private getUserAgent(): string {
        return `ReactNative/${Platform.OS} (${Platform.Version})`
    }

    private getDeviceLanguage(): string {
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


    private getScreenWidth(): number {
        try {
            return Dimensions.get('window').width
        } catch {
            return 0
        }
    }

    private getScreenHeight(): number {
        try {
            return Dimensions.get('window').height
        } catch {
            return 0
        }
    }

    private getTimezoneOffset(): number {
        try {
            return new Date().getTimezoneOffset()
        } catch {
            return 0
        }
    }

    private getPlatformVersion(): string {
        return Platform.Version?.toString() ?? 'unknown'
    }

    private getDeviceType(): string {
        try {
            const { width, height } = Dimensions.get('window')
            const aspectRatio = height / width
            return width >= 768 || aspectRatio < 1.6 ? 'tablet' : 'mobile'
        } catch {
            return 'mobile'
        }
    }

    private async getDeviceId(): Promise<string> {
        return this.generateUUID().replace(/-/g, '')
    }


    private btoa(str: string): string {
        try {
            const Buffer = require("buffer").Buffer;
            return new Buffer(str).toString("base64");
        } catch (e) {
            console.error('Error in btoa:', e);
            return '';
        }
    }

    private generateUUID(): string {
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
}
