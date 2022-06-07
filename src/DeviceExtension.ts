import { Reflection } from '@kezziny/reflection';
import { Yeelight as YL } from 'yeelight-awesome'
import { DataBindingConverter, DataPublishingConverter, Device, DeviceExtension, IDeviceConfig, Property, PropertyChangeEventArgs } from '@kezziny/smart-hut';

export interface IYeelightDeviceConfig extends IDeviceConfig {
	IPAddress: string;
    Port?: number;
}

export enum YeelightProperty {
    State,
    Brightness,
    Kelvin
}

export class Yeelight extends DeviceExtension {
	private static readonly BindKey = "Yeelight.Bind";
	private static readonly PublishKey = "Yeelight.Control";

    Yeelight: YL;

	public override Configure(config: IYeelightDeviceConfig) {
		super.Configure(config);
		console.log("Configure device extension: Yeelight");

        this.Yeelight = new YL({ lightIp: config.IPAddress });
        this.Yeelight.autoReconnect = true;
        this.Yeelight.connect();
	}

	public static Extension<T extends { new (...args: any[]): Device }>(constructor: T) {
		return class extends constructor {
			constructor(...args:any[]) {
				super(args);
				this.Extensions.push(new Yeelight(this));
			}
		};
	}

	public static Bind(property: YeelightProperty, converter: DataBindingConverter<any> = null) {
		return function (device: Device, property: string) {
			Reflection.SetPropertyMetadata(device, property, Yeelight.BindKey, { property, converter });
		}
	}
	
	public static Publish(property: YeelightProperty, converter: DataPublishingConverter = null) {
		return function (device: Device, property: string) {
			Reflection.SetPropertyMetadata(device, property, Yeelight.PublishKey, { property, converter });
		}
	}
}
