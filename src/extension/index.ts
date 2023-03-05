import NodeCG from "@alvancamp/test-nodecg-types"
import { set } from '@nodecg-ticker/util/nodecg';
import { Configschema } from "@nodecg-ticker/types/schemas";
import { TickerModule } from "./api/ticker-module";

module.exports = (nodecg: NodeCG.ServerAPI<Configschema>) => {
    set(nodecg);

    require('./events');

    const Ticker = require('./ticker').default;
    const { textModule } = require("./modules/text");

    return {
        Ticker,
        TickerModule,
        modules: {
            text: textModule
        }
    };
}