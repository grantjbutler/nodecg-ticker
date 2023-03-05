import NodeCG from "@alvancamp/test-nodecg-types"
import { set } from '@nodecg-ticker/util/nodecg';
import { Configschema } from "@nodecg-ticker/types/schemas";
import { TickerModule } from "./api/ticker-module";
import { textModule } from "./modules/text";
import { Ticker } from "./ticker";

module.exports = (nodecg: NodeCG.ServerAPI<Configschema>) => {
    set(nodecg);

    require('./events');

    return {
        Ticker,
        TickerModule,
        modules: {
            text: textModule
        }
    };
}