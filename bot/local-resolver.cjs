"use strict";

const path = require("path");
const Module = require("module");

const root = path.resolve(__dirname, "..");
const hoistedRoot = path.join(root, "node_modules", ".pnpm", "node_modules");

const aliases = new Map([
  ["fast-deep-equal", path.join(hoistedRoot, "fast-deep-equal")],
  ["lodash.snakecase", path.join(hoistedRoot, "lodash.snakecase")],
  ["magic-bytes.js", path.join(hoistedRoot, "magic-bytes.js")],
  ["tslib", path.join(root, "node_modules", "tslib")],
  ["undici", path.join(hoistedRoot, "undici")],
  ["discord-api-types", path.join(hoistedRoot, "discord-api-types")],
  ["@discordjs/builders", path.join(hoistedRoot, "@discordjs", "builders")],
  ["@discordjs/rest", path.join(hoistedRoot, "@discordjs", "rest")],
  ["@discordjs/ws", path.join(hoistedRoot, "@discordjs", "ws")],
  ["@discordjs/collection", path.join(hoistedRoot, "@discordjs", "collection")],
  ["@discordjs/util", path.join(hoistedRoot, "@discordjs", "util")],
  ["@discordjs/formatters", path.join(hoistedRoot, "@discordjs", "formatters")],
  ["@sapphire/snowflake", path.join(hoistedRoot, "@sapphire", "snowflake")],
]);

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  const alias = aliases.get(request);
  if (alias) {
    return originalResolveFilename.call(this, alias, parent, isMain, options);
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
