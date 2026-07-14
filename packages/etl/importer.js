"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("@color-corpus/db");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, sourceId, CHUNK_SIZE, i, chunk, stmts, _i, chunk_1, color, colorId, nameId, assignmentId, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting import process...");
                    // 1. Fetch the dataset
                    console.log("Fetching color-name-list...");
                    return [4 /*yield*/, fetch("https://unpkg.com/color-name-list@latest/dist/colornames.json")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log("Fetched ".concat(data.length, " colors."));
                    sourceId = "src_color_name_list";
                    // 2. Insert source
                    return [4 /*yield*/, db_1.db.execute({
                            sql: "\n      INSERT INTO sources (id, slug, name, kind, language, source_url) \n      VALUES (?, ?, ?, ?, ?, ?)\n      ON CONFLICT DO NOTHING\n    ",
                            args: [
                                sourceId,
                                "color-name-list",
                                "Color Name List",
                                "web_collection",
                                "en",
                                "https://unpkg.com/color-name-list@latest/dist/colornames.json"
                            ]
                        })];
                case 3:
                    // 2. Insert source
                    _a.sent();
                    console.log("Inserted source record.");
                    // 3. Prepare bulk insert
                    console.log("Preparing batch inserts...");
                    CHUNK_SIZE = 100;
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < data.length)) return [3 /*break*/, 9];
                    chunk = data.slice(i, i + CHUNK_SIZE);
                    stmts = [];
                    for (_i = 0, chunk_1 = chunk; _i < chunk_1.length; _i++) {
                        color = chunk_1[_i];
                        colorId = "sc_".concat(color.hex.replace("#", ""), "_").concat(color.name.toLowerCase().replace(/[^a-z0-9]/g, "_"));
                        nameId = "n_".concat(color.name.toLowerCase().replace(/[^a-z0-9]/g, "_"));
                        assignmentId = "cna_".concat(colorId, "_").concat(nameId);
                        stmts.push({
                            sql: "INSERT INTO source_colors (id, source_id, primary_name_raw, hex_color) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING",
                            args: [colorId, sourceId, color.name, color.hex]
                        });
                        stmts.push({
                            sql: "INSERT INTO names (id, normalized_form, display_form, language) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING",
                            args: [nameId, color.name.toLowerCase(), color.name, "en"]
                        });
                        stmts.push({
                            sql: "INSERT INTO color_name_assignments (id, source_color_id, name_id, role) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING",
                            args: [assignmentId, colorId, nameId, "primary"]
                        });
                    }
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, db_1.db.batch(stmts, "write")];
                case 6:
                    _a.sent();
                    console.log("Inserted chunk ".concat(Math.floor(i / CHUNK_SIZE) + 1, " of ").concat(Math.ceil(data.length / CHUNK_SIZE)));
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    console.error("Batch failed at index", i, err_1);
                    return [3 /*break*/, 9];
                case 8:
                    i += CHUNK_SIZE;
                    return [3 /*break*/, 4];
                case 9:
                    console.log("\nImport process complete.");
                    return [2 /*return*/];
            }
        });
    });
}
run().catch(console.error);
