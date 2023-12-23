"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnsAvatar = void 0;
const parseAvatarRecord_js_1 = require("../../utils/ens/avatar/parseAvatarRecord.js");
const getAction_js_1 = require("../../utils/getAction.js");
const getEnsText_js_1 = require("./getEnsText.js");
async function getEnsAvatar(client, { blockNumber, blockTag, gatewayUrls, name, universalResolverAddress, }) {
    const record = await (0, getAction_js_1.getAction)(client, getEnsText_js_1.getEnsText, 'getEnsText')({
        blockNumber,
        blockTag,
        key: 'avatar',
        name,
        universalResolverAddress,
    });
    if (!record)
        return null;
    try {
        return await (0, parseAvatarRecord_js_1.parseAvatarRecord)(client, { record, gatewayUrls });
    }
    catch {
        return null;
    }
}
exports.getEnsAvatar = getEnsAvatar;
//# sourceMappingURL=getEnsAvatar.js.map