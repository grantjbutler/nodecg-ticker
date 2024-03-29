import NodeCG from "@alvancamp/test-nodecg-types"
import { Configschema } from "@nodecg-ticker/types/schemas";

let nodecg: NodeCG.ServerAPI<Configschema>;

export function set(ctx: NodeCG.ServerAPI<Configschema>): void {
  nodecg = ctx;
}

export function get(): NodeCG.ServerAPI<Configschema> {
  return nodecg;
}