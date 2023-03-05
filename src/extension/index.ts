import NodeCG from "@alvancamp/test-nodecg-types"
import { set } from '@nodecg-ticker/util/nodecg';
import { Configschema } from "@nodecg-ticker/types/schemas";

module.exports = (nodecg: NodeCG.ServerAPI<Configschema>) => {
    set(nodecg);

    require('./events');

    return require('./ticker');
}