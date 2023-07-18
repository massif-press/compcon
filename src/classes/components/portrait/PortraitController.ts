import { Mech } from '@/class';
import { getImagePath, ImageTag } from '@/io/ImageManagement';
import { IPortraitContainer } from '..';

interface IPortraitData {
  portrait: string;
  avatar?: any;
  cloud_portrait: string;
}

class PortraitController {
  public readonly Parent: IPortraitContainer;

  private _portrait: string;
  private _avatar?: any;
  private _cloud_portrait: string;

  public constructor(parent: IPortraitContainer) {
    this.Parent = parent;
    this._portrait = '';
    this._cloud_portrait = '';
  }

  public SetLocalImage(src: string): void {
    this._portrait = src;
    this.Parent.SaveController.save();
  }

  public get LocalImage(): string {
    return this._portrait;
  }

  public get Image(): string {
    return this.Portrait;
  }

  public get Avatar(): any {
    return this._avatar;
  }

  public set Avatar(data: any) {
    this._avatar = data;
  }

  public get Portrait(): string {
    if (this._cloud_portrait) return this._cloud_portrait;
    if (!this.Parent.ImageTag) return getImagePath(ImageTag.Frame, 'nodata.png');
    else if (this._portrait) return getImagePath(this.Parent.ImageTag, this._portrait);
    else if (this.Parent.ImageTag === ImageTag.Mech) {
      return (this.Parent as Mech).Frame.DefaultImage;
    } else return getImagePath(this.Parent.ImageTag, 'nodata.png');
  }

  public get CloudImage(): string {
    return this._cloud_portrait;
  }

  public set CloudImage(src: string) {
    this._cloud_portrait = src;
    this.Parent.SaveController.save();
  }

  public SetCloudImage(src: string): void {
    this._cloud_portrait = src;
    this.Parent.SaveController.save();
  }

  public static Serialize(parent: IPortraitContainer, target: any) {
    if (!target.img) target.img = {};
    target.img.portrait = parent.PortraitController._portrait;
    target.img.avatar = parent.PortraitController._avatar;
    target.img.cloud_portrait = parent.PortraitController._cloud_portrait;
  }

  public static Deserialize(parent: IPortraitContainer, data: IPortraitData) {
    if (!parent.PortraitController)
      throw new Error(
        `PortraitController not found on parent (${typeof parent}). New PortraitControllers must be instantiated in the parent's constructor method.`
      );

    parent.PortraitController._portrait = data.portrait || '';
    parent.PortraitController._avatar = data.avatar ? data.avatar : undefined;
    parent.PortraitController._cloud_portrait = data.cloud_portrait || '';
  }
}

export { PortraitController };
export type { IPortraitData };
