import { config as lumosConfig } from "@ckb-lumos/lumos";
import { predefinedSporeConfigs, setSporeConfig } from "@spore-sdk/core";

const config = predefinedSporeConfigs.Aggron4;

lumosConfig.initializeConfig(config.lumos);
setSporeConfig(config);

export { config };
