import { TickerModule } from "@nodecg-ticker/api/ticker-module";
import { get as nodecg } from '@nodecg-ticker/util/nodecg';

export const textModule = new TickerModule<{ text: string }>(
    "com.grantjbutler.nodecg-ticker.text",
    "Text",
    "Displays static text in the ticker."
)
.registerDialog('ticker-add-text', nodecg().bundleName)
.onCreateInstance(instance => {
    instance.name = "Text";
    instance.description = instance.data.text;
    return instance;
});