import { TickerModule } from "@nodecg-ticker/api/ticker-module";

export const textModule = new TickerModule<{ text: string }>(
    "com.grantjbutler.ticker-module.text",
    "Text",
    "Displays static text in the ticker."
)
.onCreateInstance(instance => {
    instance.name = "Text";
    instance.description = instance.data.text;
    return instance;
});