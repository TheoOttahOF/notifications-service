import {TrayIconClicked} from 'openfin/_v2/api/events/application';
import {Application} from 'openfin/_v2/main';
import {TrayInfo} from 'openfin/_v2/api/application/application';
import {Signal} from 'openfin-service-signal';
import {injectable} from 'inversify';

import {TrayIcon} from './TrayIcon';
import {DeferredPromise} from '../common/DeferredPromise';
import {Bounds} from 'openfin/_v2/shapes';

@injectable()
export class FinTrayIcon implements TrayIcon {
    public readonly onLeftClick: Signal<[]>;
    public readonly onRightClick: Signal<[]>;

    public padding: number = 0;
    public radius: number = 6;

    private readonly _application: Application;

    // Base image without badging
    private _iconURL?: string;
    private _badgeCount: number = 0;
    private _bounds!: Bounds;

    constructor() {
        this._application = fin.Application.getCurrentSync();

        this.onLeftClick = new Signal<[]>();
        this.onRightClick = new Signal<[]>();

        this.addListeners();
    }

    public async setIcon(url: string): Promise<void> {
        this._iconURL = url;
        await this._application.setTrayIcon(url);
        this._iconURL = url;
        const info = await this.getInfo();
        this._bounds = info.bounds;
    }

    /**
     * Retrieves information about the provider tray icon.
     */
    public async getInfo(): Promise<TrayInfo> {
        return this._application.getTrayIconInfo();
    }

    public async setBadgeCount(count: number): Promise<void> {
        count = count < 0 ? 0 : count; 
        const shouldUpdate = (this._badgeCount === 0 && count !== 0) || (this._badgeCount !== 0 && count === 0)
        this._badgeCount = count;
        if (shouldUpdate) {
            const data = await this.updateBadgeImage();
            return this._application.setTrayIcon(data);
        }
    }

    private async updateBadgeImage(): Promise<string> {
        if (!this._iconURL) {
            throw new Error('No tray icon, an image must be set first.');
        }
        return this.drawIcon(this._badgeCount > 0);
    }

    private drawIcon(badge: boolean = false): Promise<string> {
        const promise = new DeferredPromise<string>();
        const image = new Image();
        const {width, width: height} = this._bounds;
        const {padding, radius} = this;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d')!;

        image.onload = () => {
            context.drawImage(image, 0, 0, 32, 32, 0, 0, width, height);
            if (badge) {
                context.beginPath();
                context.arc(width - radius - padding, height - radius - padding, radius, 0, 360 * Math.PI, false);
                context.fillStyle = 'red';
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = 'black';
                context.stroke();
            }

            const data = canvas.toDataURL();
            promise.resolve(data);
        }
        // image.src = this._iconURL;
        image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABKVBMVEUAAABSTf9QTP9TUP9RTf9jXP9PS/9SUP9OSv9QTf9TTv9VUP9PSf9RTv9WTv9KRv9RTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTf9QTP9QTP9QTP9UUP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9TTv9RTf9QTP9QTP9QTP9QTP9RTf9QTP9QTP9QTf9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9RTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9RTf9QTP9QTP9QTP9QTf9QTP9QTP9QTP9TT/9QTP9UUf9QTP////+c69uyAAAAYXRSTlMAAAAAAAAAAAAAAAAAAAAADm3R+PnScA8QmZwSfP2AAR/a3CFHS1T8/l478n0Rwr9Q7QEDXexsDQJIPAEmb5qrzve+eVoe2/PDE1gN7i9uzxSs0FcOLg4S3voT3cBKAV8BobrzZQAAAAFiS0dEYiu5HTwAAAAHdElNRQfiAgQJJyMViSyGAAABjklEQVQ4y31TeV+CQBBdRzqorBQENDQTz9LSsLIShQ5LLY+s7DCN7/8lEmHXa3P+25n3e/vmzQxCJFyw6/VxvF8QwY1oAVKAM0fBB/eAVmdW5JA5jlB4n6ERRA5MJ6IKjQJiHAbwcSogkcSAVJoKODzCADMDFBGQPSaAE5FCwUAuT0R4TykUjFqIphzE2fnF6hrOFyOXiavsOoPY65JWruiGheBubu9i90XG8k+ucsmHx5xqkW5sqrW63+mFq8oSoEbA9u+psMWOGT3w7MNakoEGahrOo1oCrLaOc6bRRC3SWxO2nYbbOkm2EPHXLO8wuJ0OSXJTgI5KBRBBpt6GxS9ekEAojK49AXZKJCeg12AIv3xv4JltMxR8R9ALf3w6Dvu6NVX96mKj+O9wDyyrlXha7o9/MvQKtrovp3+UIksWWtTIKK3IayK4Zkc50PhJndcGC+MGqT8B9KXFhXFBZgLIzPHbFEO8LWZqSF3aOBHxz9or0eWHw/yGl5/eyNMgbx9vj3q8yA2i4Ofnz/8PB9agG+57b98AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDItMDRUMDk6Mzk6MzUrMDE6MDDl1ju7AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAyLTA0VDA5OjM5OjM1KzAxOjAwlIuDBwAAAFd6VFh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAB4nOPyDAhxVigoyk/LzEnlUgADIwsuYwsTIxNLkxQDEyBEgDTDZAMjs1Qgy9jUyMTMxBzEB8uASKBKLgDqFxF08kI1lQAAAABJRU5ErkJggg==';

        return promise.promise;
    }

    private addListeners(): void {
        this._application.addListener('tray-icon-clicked', (event: TrayIconClicked<string, string>) => {
            if (event.button === 0) {
                this.onLeftClick.emit();
            } else if (event.button === 2) {
                this.onRightClick.emit();
            }
        });
    }
}
