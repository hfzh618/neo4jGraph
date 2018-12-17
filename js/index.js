"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var superagent_1 = __importDefault(require("superagent"));
var neo4jd3Instance;
function init() {
    var eleId = "neo4jd3";
    document.getElementById(eleId).innerHTML = '';
    // @ts-ignore
    neo4jd3Instance = new Neo4jd3('#neo4jd3', {
        highlight: [
        // {
        //     class: 'Fund',
        //     property: 'name',
        //     value: '元亨祥股权1号投资基金'
        // }, {
        //     class: 'User',
        //     property: 'userId',
        //     value: 'eisman'
        // }
        ],
        // infoPanel:false,
        icons: {
            'Contributor': 'user',
            'Fund': 'money',
            'Project': 'database'
        },
        images: {
            'Contributor': 'https://eisman.github.io/neo4jd3/img/twemoji/1f38f.svg',
            'Project': 'https://eisman.github.io/neo4jd3/img/twemoji/1f5c3.svg'
        },
        minCollision: 60,
        neo4jData: { results: [], errors: [] },
        // neo4jDataUrl: 'json/ziguanjia.json',
        nodeRadius: 30,
        onNodeDoubleClick: onNodeDoubleClicked,
        // onNodeDoubleClick: () => {        },
        onRelationshipDoubleClick: onRelationshipDoubleClicked,
        zoomFit: false,
    });
}
var apiRoot = 'http://localhost:8081';
var cachedContributorEntities = [];
function getContributor(contributorId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundContributor, fetchedContributor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundContributor = cachedContributorEntities.find(function (c) { return c.id === contributorId; });
                    if (!foundContributor) return [3 /*break*/, 1];
                    return [2 /*return*/, foundContributor];
                case 1: return [4 /*yield*/, fetchContributor(contributorId)];
                case 2:
                    fetchedContributor = _a.sent();
                    cachedContributorEntities.push(fetchedContributor);
                    return [2 /*return*/, fetchedContributor];
            }
        });
    });
}
function fetchContributor(contributorId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/node/contributor/" + contributorId).then(function (response) {
                        var body = response.body;
                        //check body fields
                        return {
                            id: body.id,
                            name: body.name,
                            number: body.number,
                            invests: body.invests.map(function (i) { return i.id; }),
                        };
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function contributor2DataNode(contributor) {
    return {
        id: contributor.id.toString(),
        labels: ["Contributor"],
        properties: {
            name: contributor.name,
        }
    };
}
var cachedFundEntities = [];
function getFund(fundId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundFund, fetchedFund;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundFund = cachedFundEntities.find(function (f) { return f.id === fundId; });
                    if (!foundFund) return [3 /*break*/, 1];
                    return [2 /*return*/, foundFund];
                case 1: return [4 /*yield*/, fetchFund(fundId)];
                case 2:
                    fetchedFund = _a.sent();
                    cachedFundEntities.push(fetchedFund);
                    return [2 /*return*/, fetchedFund];
            }
        });
    });
}
function fetchFund(fundId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/node/fund/" + fundId).then(function (response) {
                        var body = response.body;
                        //check body fields
                        return {
                            id: body.id,
                            name: body.name,
                            number: body.number,
                            invests: body.invests.map(function (i) { return i.id; }),
                            contains: body.contains.map(function (c) { return c.id; }),
                        };
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fund2DataNode(fund) {
    return {
        id: fund.id.toString(),
        labels: ["Fund"],
        properties: {
            name: fund.name,
        }
    };
}
var cachedProjectEntities = [];
function getProject(projectId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundProject, fetchedProject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundProject = cachedProjectEntities.find(function (p) { return p.id === projectId; });
                    if (!foundProject) return [3 /*break*/, 1];
                    return [2 /*return*/, foundProject];
                case 1: return [4 /*yield*/, fetchProject(projectId)];
                case 2:
                    fetchedProject = _a.sent();
                    cachedProjectEntities.push(fetchedProject);
                    return [2 /*return*/, fetchedProject];
            }
        });
    });
}
function fetchProject(projectId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/node/project/" + projectId).then(function (response) {
                        var body = response.body;
                        //check body fields
                        return {
                            id: body.id,
                            name: body.name,
                            number: body.number,
                            contains: body.contains.map(function (c) { return c.id; }),
                        };
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function project2DataNode(project) {
    return {
        id: project.id.toString(),
        labels: ["Project"],
        properties: {
            name: project.name,
        }
    };
}
var cachedContainRelationships = [];
function getContain(containId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundContain, fetchedContain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundContain = cachedContainRelationships.find(function (c) { return c.id === containId; });
                    if (!foundContain) return [3 /*break*/, 1];
                    return [2 /*return*/, foundContain];
                case 1: return [4 /*yield*/, fetchContain(containId)];
                case 2:
                    fetchedContain = _a.sent();
                    cachedContainRelationships.push(fetchedContain);
                    return [2 /*return*/, fetchedContain];
            }
        });
    });
}
function fetchContain(containId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/relationship/fund-project/" + containId).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var body;
                        return __generator(this, function (_a) {
                            body = response.body;
                            //check body fields
                            return [2 /*return*/, {
                                    id: body.id,
                                    name: body.name,
                                    fund: body.fund.id,
                                    project: body.project.id,
                                }];
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function contain2DataRelationship(contain) {
    return {
        id: contain.id.toString(),
        type: "contains",
        startNode: contain.fund.id.toString(),
        endNode: contain.project.id.toString(),
        source: contain.fund.id.toString(),
        target: contain.project.id.toString(),
        properties: {
            name: contain.name,
        },
        linknum: 1,
    };
}
var cachedInvestRelationships = [];
function getInvest(investId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundInvest, fetchedInvest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundInvest = cachedInvestRelationships.find(function (i) { return i.id === investId; });
                    if (!foundInvest) return [3 /*break*/, 1];
                    return [2 /*return*/, foundInvest];
                case 1: return [4 /*yield*/, fetchInvest(investId)];
                case 2:
                    fetchedInvest = _a.sent();
                    cachedInvestRelationships.push(fetchedInvest);
                    return [2 /*return*/, fetchedInvest];
            }
        });
    });
}
function fetchInvest(investId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/relationship/contributor-fund/" + investId).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var body;
                        return __generator(this, function (_a) {
                            body = response.body;
                            //check body fields
                            return [2 /*return*/, {
                                    id: body.id,
                                    name: body.name,
                                    fund: body.fund.id,
                                    contributor: body.contributor.id,
                                }];
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function invest2DataRelationship(invest, linkNum) {
    return {
        id: invest.id.toString(),
        type: "invest",
        startNode: invest.contributor.id.toString(),
        endNode: invest.fund.id.toString(),
        source: invest.contributor.id.toString(),
        target: invest.fund.id.toString(),
        properties: {
            name: invest.name,
        },
        linknum: linkNum,
    };
}
/*
    TEST FETCH
 */
// fetchFund(69).then(console.log);
// fetchContributor(75).then(console.log);
// fetchProject(77).then(console.log);
// fetchContain(23).then(console.log);
// fetchInvest(20).then(console.log);
function showFund(fundId) {
    return __awaiter(this, void 0, void 0, function () {
        var center, promisesToFill, _loop_1, i, _loop_2, i, d3Data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFund(fundId)];
                case 1:
                    center = _a.sent();
                    promisesToFill = [];
                    _loop_1 = function (i) {
                        if (typeof center.contains[i] === "number") {
                            var containId_1 = center.contains[i];
                            promisesToFill.push(new Promise(function (resolve) {
                                getContain(containId_1).then(function (data) {
                                    center.contains[i] = data;
                                    resolve();
                                });
                            }));
                        }
                    };
                    for (i = 0; i < center.contains.length; i++) {
                        _loop_1(i);
                    }
                    _loop_2 = function (i) {
                        if (typeof center.invests[i] === "number") {
                            var investId_1 = center.invests[i];
                            promisesToFill.push(new Promise(function (resolve) {
                                getInvest(investId_1).then(function (data) {
                                    center.invests[i] = data;
                                    resolve();
                                });
                            }));
                        }
                    };
                    for (i = 0; i < center.invests.length; i++) {
                        _loop_2(i);
                    }
                    return [4 /*yield*/, Promise.all(promisesToFill)];
                case 2:
                    _a.sent();
                    promisesToFill = [];
                    center.contains.forEach(function (contain) {
                        contain.fund = center;
                        if (typeof contain.project === "number") {
                            var projectId_1 = contain.project;
                            promisesToFill.push(new Promise(function (resolve) {
                                getProject(projectId_1).then(function (data) {
                                    contain.project = data;
                                    resolve();
                                });
                            }));
                        }
                    });
                    center.invests.forEach(function (invest) {
                        invest.fund = center;
                        if (typeof invest.contributor === "number") {
                            var contributorId_1 = invest.contributor;
                            promisesToFill.push(new Promise(function (resolve) {
                                getContributor(contributorId_1).then(function (data) {
                                    invest.contributor = data;
                                    resolve();
                                });
                            }));
                        }
                    });
                    return [4 /*yield*/, Promise.all(promisesToFill)];
                case 3:
                    _a.sent();
                    console.log(center);
                    d3Data = {
                        nodes: [],
                        relationships: [],
                    };
                    d3Data.nodes.push(fund2DataNode(center));
                    center.invests.forEach(function (invest) {
                        var linkNum = center.invests.filter(function (i) {
                            var sameContributor = i.contributor.id === invest.contributor.id;
                            var sameFund = i.fund.id === invest.fund.id;
                            return sameContributor && sameFund;
                        }).length;
                        d3Data.relationships.push(invest2DataRelationship(invest, linkNum));
                        if (d3Data.nodes.findIndex(function (n) { return n.id === invest.contributor.id.toString(); }) === -1) {
                            d3Data.nodes.push(contributor2DataNode(invest.contributor));
                        }
                    });
                    center.contains.forEach(function (contain) {
                        d3Data.relationships.push(contain2DataRelationship(contain));
                        if (d3Data.nodes.findIndex(function (n) { return n.id === contain.project.id.toString(); }) === -1) {
                            d3Data.nodes.push(project2DataNode(contain.project));
                        }
                    });
                    console.log(d3Data);
                    init();
                    neo4jd3Instance.replaceWithD3Data(d3Data);
                    return [2 /*return*/];
            }
        });
    });
}
function showContributor(contributorId) {
    return __awaiter(this, void 0, void 0, function () {
        var center, promisesToFill, _loop_3, i, d3Data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getContributor(contributorId)];
                case 1:
                    center = _a.sent();
                    promisesToFill = [];
                    _loop_3 = function (i) {
                        if (typeof center.invests[i] === "number") {
                            var investId_2 = center.invests[i];
                            promisesToFill.push(new Promise(function (resolve) {
                                getInvest(investId_2).then(function (data) {
                                    center.invests[i] = data;
                                    resolve();
                                });
                            }));
                        }
                    };
                    for (i = 0; i < center.invests.length; i++) {
                        _loop_3(i);
                    }
                    return [4 /*yield*/, Promise.all(promisesToFill)];
                case 2:
                    _a.sent();
                    promisesToFill = [];
                    center.invests.forEach(function (invest) {
                        invest.contributor = center;
                        if (typeof invest.fund === "number") {
                            var fundId_1 = invest.fund;
                            promisesToFill.push(new Promise(function (resolve) {
                                getFund(fundId_1).then(function (data) {
                                    invest.fund = data;
                                    resolve();
                                });
                            }));
                        }
                    });
                    return [4 /*yield*/, Promise.all(promisesToFill)];
                case 3:
                    _a.sent();
                    console.log(center);
                    d3Data = {
                        nodes: [],
                        relationships: [],
                    };
                    d3Data.nodes.push(contributor2DataNode(center));
                    center.invests.forEach(function (invest) {
                        var linkNum = center.invests.filter(function (i) {
                            var sameContributor = i.contributor.id === invest.contributor.id;
                            var sameFund = i.fund.id === invest.fund.id;
                            return sameContributor && sameFund;
                        }).length;
                        d3Data.relationships.push(invest2DataRelationship(invest, linkNum));
                        if (d3Data.nodes.findIndex(function (n) { return n.id === invest.fund.id.toString(); }) === -1) {
                            d3Data.nodes.push(fund2DataNode(invest.fund));
                        }
                    });
                    console.log(d3Data);
                    init();
                    neo4jd3Instance.replaceWithD3Data(d3Data);
                    return [2 /*return*/];
            }
        });
    });
}
function showProject(projectId) {
    return __awaiter(this, void 0, void 0, function () {
        var center, promisesToFill, _loop_4, i, d3Data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getProject(projectId)];
                case 1:
                    center = _a.sent();
                    promisesToFill = [];
                    _loop_4 = function (i) {
                        if (typeof center.contains[i] === "number") {
                            var containId_2 = center.contains[i];
                            promisesToFill.push(new Promise(function (resolve) {
                                getContain(containId_2).then(function (data) {
                                    center.contains[i] = data;
                                    resolve();
                                });
                            }));
                        }
                    };
                    for (i = 0; i < center.contains.length; i++) {
                        _loop_4(i);
                    }
                    return [4 /*yield*/, Promise.all(promisesToFill)];
                case 2:
                    _a.sent();
                    promisesToFill = [];
                    center.contains.forEach(function (contain) {
                        contain.project = center;
                        if (typeof contain.fund === "number") {
                            var fundId_2 = contain.fund;
                            promisesToFill.push(new Promise(function (resolve) {
                                getFund(fundId_2).then(function (data) {
                                    contain.fund = data;
                                    resolve();
                                });
                            }));
                        }
                    });
                    return [4 /*yield*/, Promise.all(promisesToFill)];
                case 3:
                    _a.sent();
                    console.log(center);
                    d3Data = {
                        nodes: [],
                        relationships: [],
                    };
                    d3Data.nodes.push(project2DataNode(center));
                    center.contains.forEach(function (contain) {
                        d3Data.relationships.push(contain2DataRelationship(contain));
                        if (d3Data.nodes.findIndex(function (n) { return n.id === contain.fund.id.toString(); }) === -1) {
                            d3Data.nodes.push(fund2DataNode(contain.fund));
                        }
                    });
                    console.log(d3Data);
                    init();
                    neo4jd3Instance.replaceWithD3Data(d3Data);
                    return [2 /*return*/];
            }
        });
    });
}
function onNodeDoubleClicked(node) {
    console.log(node);
    console.log('clicked');
    var id = parseInt(node.id);
    var contributor = cachedContributorEntities.find(function (c) { return c.id === id; });
    var fund = cachedFundEntities.find(function (f) { return f.id === id; });
    var project = cachedProjectEntities.find(function (p) { return p.id === id; });
    if (contributor) {
        console.log('prepare contributor');
        showContributor(id).then(function () { return console.log('contributor shown'); });
    }
    else if (fund) {
        console.log('prepare fund');
        showFund(id).then(function () { return console.log('fund shown'); });
    }
    else if (project) {
        console.log('prepare project');
        showProject(id).then(function () { return console.log('project shown'); });
    }
}
function onRelationshipDoubleClicked(relationship) {
    console.log('double click on relationship: ' + JSON.stringify(relationship));
}
/*
    Search event listeners
 */
document.getElementById("search-fund-button").onclick = function () {
    var fundInput = document.getElementById("search-fund-input");
    var searchKeyword = fundInput.value;
    if (searchKeyword.length === 0) {
        alert('请输入搜索内容');
    }
    else {
        superagent_1.default.get(apiRoot + "/neo4j/node/fund/findOne?key=" + searchKeyword).then(function (response) {
            var body = response.body;
            var fundId = body.id;
            getFund(fundId).then(function () { return showFund(fundId); });
        });
    }
};
showFund(101).then(function () { return console.log('shown'); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQW9DO0FBOEJwQyxJQUFJLGVBQWdDLENBQUM7QUFFckMsU0FBUyxJQUFJO0lBQ1QsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDO0lBQ3ZCLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFvQixDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDbEUsYUFBYTtJQUNiLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7UUFDdEMsU0FBUyxFQUFFO1FBQ1AsSUFBSTtRQUNKLHFCQUFxQjtRQUNyQix3QkFBd0I7UUFDeEIsMkJBQTJCO1FBQzNCLE9BQU87UUFDUCxxQkFBcUI7UUFDckIsMEJBQTBCO1FBQzFCLHNCQUFzQjtRQUN0QixJQUFJO1NBQ1A7UUFDRCxtQkFBbUI7UUFDbkIsS0FBSyxFQUFFO1lBQ0gsYUFBYSxFQUFFLE1BQU07WUFDckIsTUFBTSxFQUFFLE9BQU87WUFDZixTQUFTLEVBQUUsVUFBVTtTQUN4QjtRQUNELE1BQU0sRUFBRTtZQUNKLGFBQWEsRUFBRSx3REFBd0Q7WUFDdkUsU0FBUyxFQUFFLHdEQUF3RDtTQUN0RTtRQUNELFlBQVksRUFBRSxFQUFFO1FBQ2hCLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUMsTUFBTSxFQUFDLEVBQUUsRUFBQztRQUNsQyx1Q0FBdUM7UUFDdkMsVUFBVSxFQUFFLEVBQUU7UUFDZCxpQkFBaUIsRUFBRSxtQkFBbUI7UUFDdEMsdUNBQXVDO1FBQ3ZDLHlCQUF5QixFQUFFLDJCQUEyQjtRQUN0RCxPQUFPLEVBQUUsS0FBSztLQUNqQixDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsSUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUM7QUFXeEMsSUFBTSx5QkFBeUIsR0FBd0IsRUFB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