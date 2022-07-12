"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructClientAgents = void 0;
const version_1 = require("../version");
const constructClientAgents = (clientAgents = []) => {
    const firebaseAgent = `Meilisearch Firebase (v${version_1.version})`;
    return clientAgents.concat(firebaseAgent);
};
exports.constructClientAgents = constructClientAgents;
