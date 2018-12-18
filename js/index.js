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
            'Project': 'database',
            'Company': 'university',
            'People': 'handshake-o',
            'stock': 'credit-card',
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
                            corporates: body.corporates.map(function (h) { return h.id; }),
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
var cachedPeopleEntities = [];
function getPeople(peopleId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundPeople, fetchedPeople;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundPeople = cachedPeopleEntities.find(function (c) { return c.id === peopleId; });
                    if (!foundPeople) return [3 /*break*/, 1];
                    return [2 /*return*/, foundPeople];
                case 1: return [4 /*yield*/, fetchPeople(peopleId)];
                case 2:
                    fetchedPeople = _a.sent();
                    cachedPeopleEntities.push(fetchedPeople);
                    return [2 /*return*/, fetchedPeople];
            }
        });
    });
}
function fetchPeople(peopleId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/node/people/" + peopleId).then(function (response) {
                        var body = response.body;
                        //check body fields
                        return {
                            id: body.id,
                            name: body.name,
                            number: body.number,
                            manages: body.manages.map(function (i) { return i.id; }),
                        };
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function people2DataNode(people) {
    return {
        id: people.id.toString(),
        labels: ["People"],
        properties: {
            name: people.name,
        }
    };
}
var cachedStockEntities = [];
function getStock(stockId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundStock, fetchedStock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundStock = cachedStockEntities.find(function (p) { return p.id === stockId; });
                    if (!foundStock) return [3 /*break*/, 1];
                    return [2 /*return*/, foundStock];
                case 1: return [4 /*yield*/, fetchStock(stockId)];
                case 2:
                    fetchedStock = _a.sent();
                    cachedStockEntities.push(fetchedStock);
                    return [2 /*return*/, fetchedStock];
            }
        });
    });
}
function fetchStock(stockId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/node/stock/" + stockId).then(function (response) {
                        var body = response.body;
                        //check body fields
                        return {
                            id: body.id,
                            name: body.name,
                            number: body.number,
                            releases: body.releases.map(function (c) { return c.id; }),
                        };
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function stock2DataNode(stock) {
    return {
        id: stock.id.toString(),
        labels: ["stock"],
        properties: {
            name: stock.name,
        }
    };
}
var cachedCompanyEntities = [];
function getCompany(companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundCompany, fetchedCompany;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundCompany = cachedCompanyEntities.find(function (f) { return f.id === companyId; });
                    if (!foundCompany) return [3 /*break*/, 1];
                    return [2 /*return*/, foundCompany];
                case 1: return [4 /*yield*/, fetchCompany(companyId)];
                case 2:
                    fetchedCompany = _a.sent();
                    cachedCompanyEntities.push(fetchedCompany);
                    return [2 /*return*/, fetchedCompany];
            }
        });
    });
}
function fetchCompany(companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/node/company/" + companyId).then(function (response) {
                        var body = response.body;
                        //check body fields
                        return {
                            id: body.id,
                            name: body.name,
                            number: body.number,
                            releases: body.releases.map(function (i) { return i.id; }),
                            corporates: body.corporates.map(function (c) { return c.id; }),
                            manages: body.manages.map(function (c) { return c.id; }),
                        };
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function company2DataNode(company) {
    return {
        id: company.id.toString(),
        labels: ["Company"],
        properties: {
            name: company.name,
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
var cachedManageRelationships = [];
function getManage(manageId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundManage, fetchedManage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundManage = cachedManageRelationships.find(function (i) { return i.id === manageId; });
                    if (!foundManage) return [3 /*break*/, 1];
                    return [2 /*return*/, foundManage];
                case 1: return [4 /*yield*/, fetchManage(manageId)];
                case 2:
                    fetchedManage = _a.sent();
                    cachedManageRelationships.push(fetchedManage);
                    return [2 /*return*/, fetchedManage];
            }
        });
    });
}
function fetchManage(manageId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/relationship/people-company/" + manageId).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var body;
                        return __generator(this, function (_a) {
                            body = response.body;
                            //check body fields
                            return [2 /*return*/, {
                                    id: body.id,
                                    name: body.name,
                                    company: body.company.id,
                                    people: body.people.id,
                                }];
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function manage2DataRelationship(manage, linkNum) {
    return {
        id: manage.id.toString(),
        type: "manage",
        startNode: manage.people.id.toString(),
        endNode: manage.company.id.toString(),
        source: manage.people.id.toString(),
        target: manage.company.id.toString(),
        properties: {
            name: manage.name,
        },
        linknum: linkNum,
    };
}
var cachedReleaseRelationships = [];
function getRelease(releaseId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundRelease, fetchedRelease;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundRelease = cachedReleaseRelationships.find(function (c) { return c.id === releaseId; });
                    if (!foundRelease) return [3 /*break*/, 1];
                    return [2 /*return*/, foundRelease];
                case 1: return [4 /*yield*/, fetchRelease(releaseId)];
                case 2:
                    fetchedRelease = _a.sent();
                    cachedReleaseRelationships.push(fetchedRelease);
                    return [2 /*return*/, fetchedRelease];
            }
        });
    });
}
function fetchRelease(releaseId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/relationship/company-stock/" + releaseId).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var body;
                        return __generator(this, function (_a) {
                            body = response.body;
                            //check body fields
                            return [2 /*return*/, {
                                    id: body.id,
                                    name: body.name,
                                    company: body.company.id,
                                    stock: body.stock.id,
                                }];
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function release2DataRelationship(release) {
    return {
        id: release.id.toString(),
        type: "release",
        startNode: release.company.id.toString(),
        endNode: release.stock.id.toString(),
        source: release.company.id.toString(),
        target: release.stock.id.toString(),
        properties: {
            name: release.name,
        },
        linknum: 1,
    };
}
var cachedCorporateRelationships = [];
function getCorporate(corporateId) {
    return __awaiter(this, void 0, void 0, function () {
        var foundCorporate, fetchedCorporate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foundCorporate = cachedCorporateRelationships.find(function (c) { return c.id === corporateId; });
                    if (!foundCorporate) return [3 /*break*/, 1];
                    return [2 /*return*/, foundCorporate];
                case 1: return [4 /*yield*/, fetchCorporate(corporateId)];
                case 2:
                    fetchedCorporate = _a.sent();
                    cachedCorporateRelationships.push(fetchedCorporate);
                    return [2 /*return*/, fetchedCorporate];
            }
        });
    });
}
function fetchCorporate(corporateId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, superagent_1.default.get(apiRoot + "/neo4j/relationship/company-fund/" + corporateId).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var body;
                        return __generator(this, function (_a) {
                            body = response.body;
                            //check body fields
                            return [2 /*return*/, {
                                    id: body.id,
                                    name: body.name,
                                    company: body.company.id,
                                    fund: body.fund.id,
                                }];
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function corporate2DataRelationship(corporate) {
    return {
        id: corporate.id.toString(),
        type: "corporate",
        startNode: corporate.company.id.toString(),
        endNode: corporate.fund.id.toString(),
        source: corporate.company.id.toString(),
        target: corporate.fund.id.toString(),
        properties: {
            name: corporate.name,
        },
        linknum: 1,
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
        var center, promisesToFill, _loop_1, i, _loop_2, i, _loop_3, i, d3Data;
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
                    _loop_3 = function (i) {
                        if (typeof center.corporates[i] === "number") {
                            var corporateId_1 = center.corporates[i];
                            promisesToFill.push(new Promise(function (resolve) {
                                getCorporate(corporateId_1).then(function (data) {
                                    center.corporates[i] = data;
                                    resolve();
                                });
                            }));
                        }
                    };
                    for (i = 0; i < center.corporates.length; i++) {
                        _loop_3(i);
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
                    center.corporates.forEach(function (corporate) {
                        corporate.fund = center;
                        if (typeof corporate.company === "number") {
                            var contributorId_2 = corporate.company;
                            promisesToFill.push(new Promise(function (resolve) {
                                getCompany(contributorId_2).then(function (data) {
                                    corporate.company = data;
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
                    center.corporates.forEach(function (contain) {
                        d3Data.relationships.push(corporate2DataRelationship(contain));
                        if (d3Data.nodes.findIndex(function (n) { return n.id === contain.company.id.toString(); }) === -1) {
                            d3Data.nodes.push(company2DataNode(contain.company));
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
        var center, promisesToFill, _loop_4, i, d3Data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getContributor(contributorId)];
                case 1:
                    center = _a.sent();
                    promisesToFill = [];
                    _loop_4 = function (i) {
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
                        _loop_4(i);
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
        var center, promisesToFill, _loop_5, i, d3Data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getProject(projectId)];
                case 1:
                    center = _a.sent();
                    promisesToFill = [];
                    _loop_5 = function (i) {
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
                        _loop_5(i);
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
//添加people
function showPeople(peopleId) {
    return __awaiter(this, void 0, void 0, function () {
        var center, promisesToFill, _loop_6, i, d3Data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPeople(peopleId)];
                case 1:
                    center = _a.sent();
                    promisesToFill = [];
                    _loop_6 = function (i) {
                        if (typeof center.manages[i] === "number") {
                            var manageId_1 = center.manages[i];
                            promisesToFill.push(new Promise(function (resolve) {
                                getManage(manageId_1).then(function (data) {
                                    center.manages[i] = data;
                                    resolve();
                                });
                            }));
                        }
                    };
                    for (i = 0; i < center.manages.length; i++) {
                        _loop_6(i);
                    }
                    return [4 /*yield*/, Promise.all(promisesToFill)];
                case 2:
                    _a.sent();
                    promisesToFill = [];
                    center.manages.forEach(function (manage) {
                        manage.people = center;
                        if (typeof manage.company === "number") {
                            var companyId_1 = manage.company;
                            promisesToFill.push(new Promise(function (resolve) {
                                getCompany(companyId_1).then(function (data) {
                                    manage.company = data;
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
                    d3Data.nodes.push(people2DataNode(center));
                    center.manages.forEach(function (manage) {
                        var linkNum = center.manages.filter(function (i) {
                            var samePeople = i.people.id === manage.people.id;
                            var sameCompany = i.company.id === manage.company.id;
                            return samePeople && sameCompany;
                        }).length;
                        d3Data.relationships.push(manage2DataRelationship(manage, linkNum));
                        if (d3Data.nodes.findIndex(function (n) { return n.id === manage.company.id.toString(); }) === -1) {
                            d3Data.nodes.push(company2DataNode(manage.company));
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
//添加stock
function showStock(stockId) {
    return __awaiter(this, void 0, void 0, function () {
        var center, promisesToFill, _loop_7, i, d3Data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getStock(stockId)];
                case 1:
                    center = _a.sent();
                    promisesToFill = [];
                    _loop_7 = function (i) {
                        if (typeof center.releases[i] === "number") {
                            var releaseId_1 = center.releases[i];
                            promisesToFill.push(new Promise(function (resolve) {
                                getRelease(releaseId_1).then(function (data) {
                                    center.releases[i] = data;
                                    resolve();
                                });
                            }));
                        }
                    };
                    for (i = 0; i < center.releases.length; i++) {
                        _loop_7(i);
                    }
                    return [4 /*yield*/, Promise.all(promisesToFill)];
                case 2:
                    _a.sent();
                    promisesToFill = [];
                    center.releases.forEach(function (release) {
                        release.stock = center;
                        if (typeof release.company === "number") {
                            var companyId_2 = release.company;
                            promisesToFill.push(new Promise(function (resolve) {
                                getCompany(companyId_2).then(function (data) {
                                    release.company = data;
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
                    d3Data.nodes.push(stock2DataNode(center));
                    center.releases.forEach(function (release) {
                        d3Data.relationships.push(release2DataRelationship(release));
                        if (d3Data.nodes.findIndex(function (n) { return n.id === release.company.id.toString(); }) === -1) {
                            d3Data.nodes.push(company2DataNode(release.company));
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
//添加公司
function showCompany(companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var center, promisesToFill, _loop_8, i, _loop_9, i, _loop_10, i, d3Data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCompany(companyId)];
                case 1:
                    center = _a.sent();
                    promisesToFill = [];
                    _loop_8 = function (i) {
                        if (typeof center.manages[i] === "number") {
                            var manageId_2 = center.manages[i];
                            promisesToFill.push(new Promise(function (resolve) {
                                getManage(manageId_2).then(function (data) {
                                    center.manages[i] = data;
                                    resolve();
                                });
                            }));
                        }
                    };
                    for (i = 0; i < center.manages.length; i++) {
                        _loop_8(i);
                    }
                    _loop_9 = function (i) {
                        if (typeof center.releases[i] === "number") {
                            var releaseId_2 = center.releases[i];
                            promisesToFill.push(new Promise(function (resolve) {
                                getRelease(releaseId_2).then(function (data) {
                                    center.releases[i] = data;
                                    resolve();
                                });
                            }));
                        }
                    };
                    for (i = 0; i < center.releases.length; i++) {
                        _loop_9(i);
                    }
                    _loop_10 = function (i) {
                        if (typeof center.corporates[i] === "number") {
                            var corporateId_2 = center.corporates[i];
                            promisesToFill.push(new Promise(function (resolve) {
                                getCorporate(corporateId_2).then(function (data) {
                                    center.corporates[i] = data;
                                    resolve();
                                });
                            }));
                        }
                    };
                    for (i = 0; i < center.corporates.length; i++) {
                        _loop_10(i);
                    }
                    return [4 /*yield*/, Promise.all(promisesToFill)];
                case 2:
                    _a.sent();
                    promisesToFill = [];
                    center.manages.forEach(function (contain) {
                        contain.company = center;
                        if (typeof contain.people === "number") {
                            var projectId_2 = contain.people;
                            promisesToFill.push(new Promise(function (resolve) {
                                getPeople(projectId_2).then(function (data) {
                                    contain.people = data;
                                    resolve();
                                });
                            }));
                        }
                    });
                    center.releases.forEach(function (invest) {
                        invest.company = center;
                        if (typeof invest.stock === "number") {
                            var contributorId_3 = invest.stock;
                            promisesToFill.push(new Promise(function (resolve) {
                                getStock(contributorId_3).then(function (data) {
                                    invest.stock = data;
                                    resolve();
                                });
                            }));
                        }
                    });
                    center.corporates.forEach(function (invest) {
                        invest.company = center;
                        if (typeof invest.fund === "number") {
                            var contributorId_4 = invest.fund;
                            promisesToFill.push(new Promise(function (resolve) {
                                getFund(contributorId_4).then(function (data) {
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
                    d3Data.nodes.push(company2DataNode(center));
                    // (center.manages as ManageRelationship[]).forEach(invest => {
                    //     const linkNum = (center.invests as InvestRelationship[]).filter(i => {
                    //             const sameContributor = (i.contributor as ContributorEntity).id === (invest.contributor as ContributorEntity).id;
                    //             const sameFund = (i.fund as FundEntity).id === (invest.fund as FundEntity).id;
                    //             return sameContributor && sameFund;
                    //         }
                    //     ).length;
                    //     d3Data.relationships.push(invest2DataRelationship(invest, linkNum));
                    //     if (d3Data.nodes.findIndex(n => n.id === (invest.contributor as ContributorEntity).id.toString()) === -1) {
                    //         d3Data.nodes.push(contributor2DataNode(invest.contributor as ContributorEntity));
                    //     }
                    // });
                    center.releases.forEach(function (contain) {
                        d3Data.relationships.push(release2DataRelationship(contain));
                        if (d3Data.nodes.findIndex(function (n) { return n.id === contain.stock.id.toString(); }) === -1) {
                            d3Data.nodes.push(stock2DataNode(contain.stock));
                        }
                    });
                    center.manages.forEach(function (contain) {
                        d3Data.relationships.push(manage2DataRelationship(contain, 1));
                        if (d3Data.nodes.findIndex(function (n) { return n.id === contain.people.id.toString(); }) === -1) {
                            d3Data.nodes.push(people2DataNode(contain.people));
                        }
                    });
                    center.corporates.forEach(function (contain) {
                        d3Data.relationships.push(corporate2DataRelationship(contain));
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
    var people = cachedPeopleEntities.find(function (p) { return p.id === id; });
    var company = cachedCompanyEntities.find(function (p) { return p.id === id; });
    var stock = cachedStockEntities.find(function (p) { return p.id === id; });
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
    else if (people) {
        console.log('prepare people');
        showPeople(id).then(function () { return console.log('project shown'); });
    }
    else if (stock) {
        console.log('prepare project');
        showStock(id).then(function () { return console.log('project shown'); });
    }
    else if (company) {
        console.log('prepare project');
        showCompany(id).then(function () { return console.log('project shown'); });
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
showCompany(886).then(function () { return console.log('shown'); });
// showFund(386).then(() => console.log('shown'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQW9DO0FBOEJwQyxJQUFJLGVBQWdDLENBQUM7QUFFckMsU0FBUyxJQUFJO0lBQ1QsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDO0lBQ3ZCLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFvQixDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDbEUsYUFBYTtJQUNiLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7UUFDdEMsU0FBUyxFQUFFO1FBQ1AsSUFBSTtRQUNKLHFCQUFxQjtRQUNyQix3QkFBd0I7UUFDeEIsMkJBQTJCO1FBQzNCLE9BQU87UUFDUCxxQkFBcUI7UUFDckIsMEJBQTBCO1FBQzFCLHNCQUFzQjtRQUN0QixJQUFJO1NBQ1A7UUFDRCxtQkFBbUI7UUFDbkIsS0FBSyxFQUFFO1lBQ0gsYUFBYSxFQUFFLE1BQU07WUFDckIsTUFBTSxFQUFFLE9BQU87WUFDZixTQUFTLEVBQUUsVUFBVTtZQUNyQixTQUFTLEVBQUMsWUFBWTtZQUN0QixRQUFRLEVBQUMsYUFBYTtZQUN0QixPQUFPLEVBQUMsYUFBYTtTQUV4QjtRQUNELE1BQU0sRUFBRTtZQUNKLGFBQWEsRUFBRSx3REFBd0Q7WUFDdkUsU0FBUyxFQUFFLHdEQUF3RDtTQUN0RTtRQUNELFlBQVksRUFBRSxFQUFFO1FBQ2hCLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUMsTUFBTSxFQUFDLEVBQUUsRUFBQztRQUNsQyx1Q0FBdUM7UUFDdkMsVUFBVSxFQUFFLEVBQUU7UUFDZCxpQkFBaUIsRUFBRSxtQkFBbUI7UUFDdEMsdUNBQXVDO1FBQ3ZDLHlCQUF5QixFQUFFLDJCQUEyQjtRQUN0RCxPQUFPLEVBQUUsS0FBSztLQUNqQixDQUFDLENBQUM7QUFDUCxD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