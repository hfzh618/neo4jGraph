import superagent from 'superagent';


interface StringIndexedObject {
    [index: string]: any
}

interface DataNode {
    "id": string,
    "labels": string[],
    "properties": StringIndexedObject
}

interface DataRelationship {
    "id": string,
    "type": string,
    "startNode": string,
    "endNode": string,
    "source": string,
    "target": string,
    "properties": StringIndexedObject,
    "linknum": number
}

interface D3Data {
    nodes: DataNode[],
    relationships: DataRelationship[],
}

type Neo4jD3Instance = any;
let neo4jd3Instance: Neo4jD3Instance;

function init() {
    const eleId = "neo4jd3";
    (document.getElementById(eleId) as HTMLDivElement).innerHTML = '';
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
            'Company':'university',
            'People':'handshake-o',
            'stock':'credit-card',

        },
        images: {
            'Contributor': 'https://eisman.github.io/neo4jd3/img/twemoji/1f38f.svg',
            'Project': 'https://eisman.github.io/neo4jd3/img/twemoji/1f5c3.svg'
        },
        minCollision: 60,
        neo4jData: {results: [],errors:[]},
        // neo4jDataUrl: 'json/ziguanjia.json',
        nodeRadius: 30,
        onNodeDoubleClick: onNodeDoubleClicked,
        // onNodeDoubleClick: () => {        },
        onRelationshipDoubleClick: onRelationshipDoubleClicked,
        zoomFit: false,
    });
}

const apiRoot = 'http://localhost:8081';

/*
    CONTRIBUTORS
 */
type ContributorEntity = {
    id: number,
    name: string,
    number: number,
    invests: InvestRelationship[] | number[],
}
const cachedContributorEntities: ContributorEntity[] = [];

async function getContributor(contributorId: number): Promise<ContributorEntity> {
    let foundContributor = cachedContributorEntities.find(c => c.id === contributorId);
    if (foundContributor) {
        return foundContributor;
    } else {
        const fetchedContributor = await fetchContributor(contributorId);
        cachedContributorEntities.push(fetchedContributor);
        return fetchedContributor;
    }
}

async function fetchContributor(contributorId: number): Promise<ContributorEntity> {
    return await superagent.get(`${apiRoot}/neo4j/node/contributor/${contributorId}`).then(response => {
        const body = response.body as { id: number, name: string, number: number, invests: { id: number, fundId: number }[] };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            number: body.number,
            invests: body.invests.map(i => i.id),
        };
    });
}

function contributor2DataNode(contributor: ContributorEntity): DataNode {
    return {
        id: contributor.id.toString(),
        labels: ["Contributor"],
        properties: {
            name: contributor.name,
        }
    };
}

/*
    FUNDS
 */
type FundEntity = {
    id: number,
    name: string,
    number: number,
    invests: InvestRelationship[] | number[],
    contains: ContainRelationship[] | number[],
    corporates:CorporateRelationship[] | number[],
}
const cachedFundEntities: FundEntity[] = [];

async function getFund(fundId: number): Promise<FundEntity> {
    let foundFund = cachedFundEntities.find(f => f.id === fundId);
    if (foundFund) {
        return foundFund;
    } else {
        const fetchedFund = await fetchFund(fundId);
        cachedFundEntities.push(fetchedFund);
        return fetchedFund;
    }
}

async function fetchFund(fundId: number): Promise<FundEntity> {
    return await superagent.get(`${apiRoot}/neo4j/node/fund/${fundId}`).then(response => {
        const body = response.body as { id: number, name: string, number: number, invests: { id: number, contributorId: number }[], contains: { id: number, projectId: number }[], corporates: { id: number, companyId: number }[] };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            number: body.number,
            invests: body.invests.map(i => i.id),
            contains: body.contains.map(c => c.id),
            corporates:body.corporates.map(h =>h.id),
        };
    });
}


function fund2DataNode(fund: FundEntity): DataNode {
    return {
        id: fund.id.toString(),
        labels: ["Fund"],
        properties: {
            name: fund.name,
        }
    };
}

/*
    PROJECTS
 */
type ProjectEntity = {
    id: number,
    name: string,
    number: number,
    contains: ContainRelationship[] | number[],
}
const cachedProjectEntities: ProjectEntity[] = [];

async function getProject(projectId: number): Promise<ProjectEntity> {
    let foundProject = cachedProjectEntities.find(p => p.id === projectId);
    if (foundProject) {
        return foundProject;
    } else {
        const fetchedProject = await fetchProject(projectId);
        cachedProjectEntities.push(fetchedProject);
        return fetchedProject;
    }
}

async function fetchProject(projectId: number): Promise<ProjectEntity> {
    return await superagent.get(`${apiRoot}/neo4j/node/project/${projectId}`).then(response => {
        const body = response.body as { id: number, name: string, number: number, contains: { id: number, fundId: number }[] };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            number: body.number,
            contains: body.contains.map(c => c.id),
        };
    });
}

function project2DataNode(project: ProjectEntity): DataNode {
    return {
        id: project.id.toString(),
        labels: ["Project"],
        properties: {
            name: project.name,
        }
    };
}

/*
   PEOPLE
 */
type PeopleEntity = {
    id: number,
    name: string,
    number: number,
    manages: ManageRelationship[] | number[],
}

const cachedPeopleEntities: PeopleEntity[] = [];

async function getPeople(peopleId: number): Promise<PeopleEntity> {
    let foundPeople = cachedPeopleEntities.find(c => c.id === peopleId);
    if (foundPeople) {
        return foundPeople;
    } else {
        const fetchedPeople = await fetchPeople(peopleId);
        cachedPeopleEntities.push(fetchedPeople);
        return fetchedPeople;
    }
}

async function fetchPeople(peopleId: number): Promise<PeopleEntity> {
    return await superagent.get(`${apiRoot}/neo4j/node/people/${peopleId}`).then(response => {
        const body = response.body as { id: number, name: string, number: number, manages: { id: number, companyid: number }[] };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            number: body.number,
            manages: body.manages.map(i => i.id),
        };
    });
}

function people2DataNode(people: PeopleEntity): DataNode {
    return {
        id: people.id.toString(),
        labels: ["People"],
        properties: {
            name: people.name,
        }
    };
}

/*
    Stock
 */
type StockEntity = {
    id: number,
    name: string,
    number: number,
    releases: ReleaseRelationship[] | number[],
}
const cachedStockEntities: StockEntity[] = [];

async function getStock(stockId: number): Promise<StockEntity> {
    let foundStock = cachedStockEntities.find(p => p.id === stockId);
    if (foundStock) {
        return foundStock;
    } else {
        const fetchedStock = await fetchStock(stockId);
        cachedStockEntities.push(fetchedStock);
        return fetchedStock;
    }
}

async function fetchStock(stockId: number): Promise<StockEntity> {
    return await superagent.get(`${apiRoot}/neo4j/node/stock/${stockId}`).then(response => {
        const body = response.body as { id: number, name: string, number: number, releases: { id: number, stockId: number }[] };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            number: body.number,
            releases: body.releases.map(c => c.id),
        };
    });
}

function stock2DataNode(stock: StockEntity): DataNode {
    return {
        id: stock.id.toString(),
        labels: ["stock"],
        properties: {
            name: stock.name,
        }
    };
}


/*
    CompanyS
 */
type CompanyEntity = {
    id: number,
    name: string,
    number: number,
    manages: ManageRelationship[] | number[],
    releases: ReleaseRelationship[] | number[],
    corporates:CorporateRelationship[] | number[],
}
const cachedCompanyEntities: CompanyEntity[] = [];

async function getCompany(companyId: number): Promise<CompanyEntity> {
    let foundCompany = cachedCompanyEntities.find(f => f.id === companyId);
    if (foundCompany) {
        return foundCompany;
    } else {
        const fetchedCompany = await fetchCompany(companyId);
        cachedCompanyEntities.push(fetchedCompany);
        return fetchedCompany;
    }
}

async function fetchCompany(companyId: number): Promise<CompanyEntity> {
    return await superagent.get(`${apiRoot}/neo4j/node/company/${companyId}`).then(response => {
        const body = response.body as { id: number, name: string, number: number, corporates: { id: number, fundId: number }[], manages:{ id: number, peopleId: number }[], releases:{ id: number, stockId: number }[] };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            number: body.number,
            releases: body.releases.map(i => i.id),
            corporates: body.corporates.map(c => c.id),
            manages:body.manages.map(c => c.id),
        };
    });
}


function company2DataNode(company: CompanyEntity): DataNode {
    return {
        id: company.id.toString(),
        labels: ["Company"],
        properties: {
            name: company.name,
        }
    };
}

/*
    FUND CONTAIN PROJECT
 */
type ContainRelationship = {
    id: number,
    name: string,
    fund: FundEntity | number,
    project: ProjectEntity | number,
};
const cachedContainRelationships: ContainRelationship[] = [];

async function getContain(containId: number): Promise<ContainRelationship> {
    const foundContain = cachedContainRelationships.find(c => c.id === containId);
    if (foundContain) {
        return foundContain;
    } else {
        const fetchedContain = await fetchContain(containId);
        cachedContainRelationships.push(fetchedContain);
        return fetchedContain;
    }
}

async function fetchContain(containId: number): Promise<ContainRelationship> {
    return await superagent.get(`${apiRoot}/neo4j/relationship/fund-project/${containId}`).then(async response => {
        const body = response.body as { id: number, name: 'contain', fund: { id: number, name: string, number: string }, project: { id: number, name: string, number: number } };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            fund: body.fund.id,
            project: body.project.id,
        };
    });
}

function contain2DataRelationship(contain: ContainRelationship): DataRelationship {
    return {
        id: contain.id.toString(),
        type: "contains",
        startNode: (contain.fund as FundEntity).id.toString(),
        endNode: (contain.project as ProjectEntity).id.toString(),
        source: (contain.fund as FundEntity).id.toString(),
        target: (contain.project as ProjectEntity).id.toString(),
        properties: {
            name: contain.name,
        },
        linknum: 1,
    };
}

/*
    CONTRIBUTOR INVEST FUND
 */
type InvestRelationship = {
    id: number,
    name: string,
    fund: FundEntity | number,
    contributor: ContributorEntity | number,
};
const cachedInvestRelationships: InvestRelationship[] = [];

async function getInvest(investId: number): Promise<InvestRelationship> {
    const foundInvest = cachedInvestRelationships.find(i => i.id === investId);
    if (foundInvest) {
        return foundInvest;
    } else {
        const fetchedInvest = await fetchInvest(investId);
        cachedInvestRelationships.push(fetchedInvest);
        return fetchedInvest;
    }
}

async function fetchInvest(investId: number): Promise<InvestRelationship> {
    return await superagent.get(`${apiRoot}/neo4j/relationship/contributor-fund/${investId}`).then(async response => {
        const body = response.body as { id: number, name: 'contain', fund: { id: number, name: string, number: string }, contributor: { id: number, name: string, number: number } };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            fund: body.fund.id,
            contributor: body.contributor.id,
        };
    });
}


function invest2DataRelationship(invest: InvestRelationship, linkNum: number): DataRelationship {
    return {
        id: invest.id.toString(),
        type: "invest",
        startNode: (invest.contributor as ContributorEntity).id.toString(),
        endNode: (invest.fund as FundEntity).id.toString(),
        source: (invest.contributor as ContributorEntity).id.toString(),
        target: (invest.fund as FundEntity).id.toString(),
        properties: {
            name: invest.name,
        },
        linknum: linkNum,
    };
}
/*
  People manage company
*/

type ManageRelationship = {
    id: number,
    name: string,
    people: PeopleEntity | number,
    company: CompanyEntity | number,
};
const cachedManageRelationships: ManageRelationship[] = [];

async function getManage(manageId: number): Promise<ManageRelationship> {
    const foundManage = cachedManageRelationships.find(i => i.id === manageId);
    if (foundManage) {
        return foundManage;
    } else {
        const fetchedManage = await fetchManage(manageId);
        cachedManageRelationships.push(fetchedManage);
        return fetchedManage;
    }
}

async function fetchManage(manageId: number): Promise<ManageRelationship> {
    return await superagent.get(`${apiRoot}/neo4j/relationship/people-company/${manageId}`).then(async response => {
        const body = response.body as { id: number, name: 'manage', people: { id: number, name: string, number: string }, company: { id: number, name: string, number: number } };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            company: body.company.id,
            people: body.people.id,
        };
    });
}

function manage2DataRelationship(manage: ManageRelationship, linkNum: number): DataRelationship {
    return {
        id: manage.id.toString(),
        type: "manage",
        startNode: (manage.people as PeopleEntity).id.toString(),
        endNode: (manage.company as CompanyEntity).id.toString(),
        source: (manage.people as PeopleEntity).id.toString(),
        target: (manage.company as CompanyEntity).id.toString(),
        properties: {
            name: manage.name,
        },
        linknum: linkNum,
    };
}

/*
    company release stock
 */
type ReleaseRelationship = {
    id: number,
    name: string,
    company: CompanyEntity | number,
    stock: StockEntity | number,
};
const cachedReleaseRelationships: ReleaseRelationship[] = [];

async function getRelease(releaseId: number): Promise<ReleaseRelationship> {
    const foundRelease = cachedReleaseRelationships.find(c => c.id === releaseId);
    if (foundRelease) {
        return foundRelease;
    } else {
        const fetchedRelease = await fetchRelease(releaseId);
        cachedReleaseRelationships.push(fetchedRelease);
        return fetchedRelease;
    }
}

async function fetchRelease(releaseId: number): Promise<ReleaseRelationship> {
    return await superagent.get(`${apiRoot}/neo4j/relationship/company-stock/${releaseId}`).then(async response => {
        const body = response.body as { id: number, name: 'release', company: { id: number, name: string, number: string }, stock: { id: number, name: string, number: number } };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            company: body.company.id,
            stock: body.stock.id,
        };
    });
}

function release2DataRelationship(release: ReleaseRelationship): DataRelationship {
    return {
        id: release.id.toString(),
        type: "release",
        startNode: (release.company as CompanyEntity).id.toString(),
        endNode: (release.stock as StockEntity).id.toString(),
        source: (release.company as CompanyEntity).id.toString(),
        target: (release.stock as StockEntity).id.toString(),
        properties: {
            name: release.name,
        },
        linknum: 1,
    };
}

/*
    company corporate fund
 */
type CorporateRelationship = {
    id: number,
    name: string,
    company: CompanyEntity | number,
    fund: FundEntity | number,
};
const cachedCorporateRelationships: CorporateRelationship[] = [];

async function getCorporate(corporateId: number): Promise<CorporateRelationship> {
    const foundCorporate = cachedCorporateRelationships.find(c => c.id === corporateId);
    if (foundCorporate) {
        return foundCorporate;
    } else {
        const fetchedCorporate = await fetchCorporate(corporateId);
        cachedCorporateRelationships.push(fetchedCorporate);
        return fetchedCorporate;
    }
}

async function fetchCorporate(corporateId: number): Promise<CorporateRelationship> {
    return await superagent.get(`${apiRoot}/neo4j/relationship/company-fund/${corporateId}`).then(async response => {
        const body = response.body as { id: number, name: 'release', company: { id: number, name: string, number: string }, fund: { id: number, name: string, number: number } };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            company: body.company.id,
            fund: body.fund.id,
        };
    });
}

function corporate2DataRelationship(corporate: CorporateRelationship): DataRelationship {
    return {
        id: corporate.id.toString(),
        type: "corporate",
        startNode: (corporate.company as CompanyEntity).id.toString(),
        endNode: (corporate.fund as FundEntity).id.toString(),
        source: (corporate.company as CompanyEntity).id.toString(),
        target: (corporate.fund as FundEntity).id.toString(),
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

async function showFund(fundId: number): Promise<any> {
    const center: FundEntity = await getFund(fundId);
    let promisesToFill: Promise<any>[] = [];
    for (let i = 0; i < center.contains.length; i++) {
        if (typeof center.contains[i] === "number") {
            const containId = center.contains[i] as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getContain(containId).then(data => {
                    center.contains[i] = data;
                    resolve();
                });
            }));
        }
    }
    for (let i = 0; i < center.invests.length; i++) {
        if (typeof center.invests[i] === "number") {
            const investId = center.invests[i] as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getInvest(investId).then(data => {
                    center.invests[i] = data;
                    resolve();
                });
            }));
        }
    }
    for (let i = 0; i < center.corporates.length; i++) {
        if (typeof center.corporates[i] === "number") {
            const corporateId = center.corporates[i] as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getCorporate(corporateId).then(data => {
                    center.corporates[i] = data;
                    resolve();
                });
            }));
        }
    }
    await Promise.all(promisesToFill);
    promisesToFill = [];
    (center.contains as ContainRelationship[]).forEach(contain => {
        contain.fund = center;
        if (typeof contain.project === "number") {
            const projectId = contain.project as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getProject(projectId).then(data => {
                    contain.project = data;
                    resolve();
                });
            }));
        }
    });
    (center.invests as InvestRelationship[]).forEach(invest => {
        invest.fund = center;
        if (typeof invest.contributor === "number") {
            const contributorId = invest.contributor as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getContributor(contributorId).then(data => {
                    invest.contributor = data;
                    resolve();
                });
            }));
        }
    });
    (center.corporates as CorporateRelationship[]).forEach(corporate => {
        corporate.fund = center;
        if (typeof corporate.company === "number") {
            const contributorId = corporate.company as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getCompany(contributorId).then(data => {
                    corporate.company = data;
                    resolve();
                });
            }));
        }
    });
    await Promise.all(promisesToFill);
    console.log(center);
    const d3Data: D3Data = {
        nodes: [],
        relationships: [],
    };
    d3Data.nodes.push(fund2DataNode(center));
    (center.invests as InvestRelationship[]).forEach(invest => {
        const linkNum = (center.invests as InvestRelationship[]).filter(i => {
                const sameContributor = (i.contributor as ContributorEntity).id === (invest.contributor as ContributorEntity).id;
                const sameFund = (i.fund as FundEntity).id === (invest.fund as FundEntity).id;
                return sameContributor && sameFund;
            }
        ).length;
        d3Data.relationships.push(invest2DataRelationship(invest, linkNum));
        if (d3Data.nodes.findIndex(n => n.id === (invest.contributor as ContributorEntity).id.toString()) === -1) {
            d3Data.nodes.push(contributor2DataNode(invest.contributor as ContributorEntity));
        }
    });
    (center.contains as ContainRelationship[]).forEach(contain => {
        d3Data.relationships.push(contain2DataRelationship(contain));
        if (d3Data.nodes.findIndex(n => n.id === (contain.project as ProjectEntity).id.toString()) === -1) {
            d3Data.nodes.push(project2DataNode(contain.project as ProjectEntity));
        }
    });
    (center.corporates as CorporateRelationship[]).forEach(contain => {
        d3Data.relationships.push(corporate2DataRelationship(contain));
        if (d3Data.nodes.findIndex(n => n.id === (contain.company as CompanyEntity).id.toString()) === -1) {
            d3Data.nodes.push(company2DataNode(contain.company as CompanyEntity));
        }
    });
    console.log(d3Data);
    init();
    neo4jd3Instance.replaceWithD3Data(d3Data);
}

async function showContributor(contributorId: number): Promise<any> {
    const center: ContributorEntity = await getContributor(contributorId);
    let promisesToFill: Promise<any>[] = [];
    for (let i = 0; i < center.invests.length; i++) {
        if (typeof center.invests[i] === "number") {
            const investId = center.invests[i] as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getInvest(investId).then(data => {
                    center.invests[i] = data;
                    resolve();
                });
            }));
        }
    }
    await Promise.all(promisesToFill);
    promisesToFill = [];
    (center.invests as InvestRelationship[]).forEach(invest => {
        invest.contributor = center;
        if (typeof invest.fund === "number") {
            const fundId = invest.fund as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getFund(fundId).then(data => {
                    invest.fund = data;
                    resolve();
                });
            }));
        }
    });
    await Promise.all(promisesToFill);
    console.log(center);
    const d3Data: D3Data = {
        nodes: [],
        relationships: [],
    };
    d3Data.nodes.push(contributor2DataNode(center));
    (center.invests as InvestRelationship[]).forEach(invest => {
        const linkNum = (center.invests as InvestRelationship[]).filter(i => {
                const sameContributor = (i.contributor as ContributorEntity).id === (invest.contributor as ContributorEntity).id;
                const sameFund = (i.fund as FundEntity).id === (invest.fund as FundEntity).id;
                return sameContributor && sameFund;
            }
        ).length;
        d3Data.relationships.push(invest2DataRelationship(invest, linkNum));
        if (d3Data.nodes.findIndex(n => n.id === (invest.fund as FundEntity).id.toString()) === -1) {
            d3Data.nodes.push(fund2DataNode(invest.fund as FundEntity));
        }
    });
    console.log(d3Data);
    init();
    neo4jd3Instance.replaceWithD3Data(d3Data);
}

async function showProject(projectId: number): Promise<any> {
    const center: ProjectEntity = await getProject(projectId);
    let promisesToFill: Promise<any>[] = [];
    for (let i = 0; i < center.contains.length; i++) {
        if (typeof center.contains[i] === "number") {
            const containId = center.contains[i] as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getContain(containId).then(data => {
                    center.contains[i] = data;
                    resolve();
                });
            }));
        }
    }
    await Promise.all(promisesToFill);
    promisesToFill = [];
    (center.contains as ContainRelationship[]).forEach(contain => {
        contain.project = center;
        if (typeof contain.fund === "number") {
            const fundId = contain.fund as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getFund(fundId).then(data => {
                    contain.fund = data;
                    resolve();
                });
            }));
        }
    });
    await Promise.all(promisesToFill);
    console.log(center);
    const d3Data: D3Data = {
        nodes: [],
        relationships: [],
    };
    d3Data.nodes.push(project2DataNode(center));
    (center.contains as ContainRelationship[]).forEach(contain => {
        d3Data.relationships.push(contain2DataRelationship(contain));
        if (d3Data.nodes.findIndex(n => n.id === (contain.fund as FundEntity).id.toString()) === -1) {
            d3Data.nodes.push(fund2DataNode(contain.fund as FundEntity));
        }
    });
    console.log(d3Data);
    init();
    neo4jd3Instance.replaceWithD3Data(d3Data);
}

//添加people
async function showPeople(peopleId: number): Promise<any> {
    const center: PeopleEntity = await getPeople(peopleId);
    let promisesToFill: Promise<any>[] = [];
    for (let i = 0; i < center.manages.length; i++) {
        if (typeof center.manages[i] === "number") {
            const manageId = center.manages[i] as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getManage(manageId).then(data => {
                    center.manages[i] = data;
                    resolve();
                });
            }));
        }
    }
    await Promise.all(promisesToFill);
    promisesToFill = [];
    (center.manages as ManageRelationship[]).forEach(manage => {
        manage.people = center;
        if (typeof manage.company === "number") {
            const companyId = manage.company as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getCompany(companyId).then(data => {
                    manage.company = data;
                    resolve();
                });
            }));
        }
    });
    await Promise.all(promisesToFill);
    console.log(center);
    const d3Data: D3Data = {
        nodes: [],
        relationships: [],
    };
    d3Data.nodes.push(people2DataNode(center));
    (center.manages as ManageRelationship[]).forEach(manage => {
        const linkNum = (center.manages as ManageRelationship[]).filter(i => {
                const samePeople = (i.people as PeopleEntity).id === (manage.people as PeopleEntity).id;
                const sameCompany = (i.company as CompanyEntity).id === (manage.company as CompanyEntity).id;
                return samePeople && sameCompany;
            }
        ).length;
        d3Data.relationships.push(manage2DataRelationship(manage, linkNum));
        if (d3Data.nodes.findIndex(n => n.id === (manage.company as CompanyEntity).id.toString()) === -1) {
            d3Data.nodes.push(company2DataNode(manage.company as CompanyEntity));
        }
    });
    console.log(d3Data);
    init();
    neo4jd3Instance.replaceWithD3Data(d3Data);
}

//添加stock
async function showStock(stockId: number): Promise<any> {
    const center: StockEntity = await getStock(stockId);
    let promisesToFill: Promise<any>[] = [];
    for (let i = 0; i < center.releases.length; i++) {
        if (typeof center.releases[i] === "number") {
            const releaseId = center.releases[i] as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getRelease(releaseId).then(data => {
                    center.releases[i] = data;
                    resolve();
                });
            }));
        }
    }
    await Promise.all(promisesToFill);
    promisesToFill = [];
    (center.releases as ReleaseRelationship[]).forEach(release => {
        release.stock = center;
        if (typeof release.company === "number") {
            const companyId = release.company as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getCompany(companyId).then(data => {
                    release.company = data;
                    resolve();
                });
            }));
        }
    });
    await Promise.all(promisesToFill);
    console.log(center);
    const d3Data: D3Data = {
        nodes: [],
        relationships: [],
    };
    d3Data.nodes.push(stock2DataNode(center));
    (center.releases as ReleaseRelationship[]).forEach(release => {
        d3Data.relationships.push(release2DataRelationship(release));
        if (d3Data.nodes.findIndex(n => n.id === (release.company as CompanyEntity).id.toString()) === -1) {
            d3Data.nodes.push(company2DataNode(release.company as CompanyEntity));
        }
    });
    console.log(d3Data);
    init();
    neo4jd3Instance.replaceWithD3Data(d3Data);
}

//添加公司
async function showCompany(companyId: number): Promise<any> {
    const center: CompanyEntity = await getCompany(companyId);
    let promisesToFill: Promise<any>[] = [];
    for (let i = 0; i < center.manages.length; i++) {
        if (typeof center.manages[i] === "number") {
            const manageId = center.manages[i] as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getManage(manageId).then(data => {
                    center.manages[i] = data;
                    resolve();
                });
            }));
        }
    }
    for (let i = 0; i < center.releases.length; i++) {
        if (typeof center.releases[i] === "number") {
            const releaseId = center.releases[i] as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getRelease(releaseId).then(data => {
                    center.releases[i] = data;
                    resolve();
                });
            }));
        }
    }
    for (let i = 0; i < center.corporates.length; i++) {
        if (typeof center.corporates[i] === "number") {
            const corporateId = center.corporates[i] as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getCorporate(corporateId).then(data => {
                    center.corporates[i] = data;
                    resolve();
                });
            }));
        }
    }
    await Promise.all(promisesToFill);
    promisesToFill = [];
    (center.manages as ManageRelationship[]).forEach(contain => {
        contain.company = center;
        if (typeof contain.people === "number") {
            const projectId = contain.people as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getPeople(projectId).then(data => {
                    contain.people = data;
                    resolve();
                });
            }));
        }
    });
    (center.releases as ReleaseRelationship[]).forEach(invest => {
        invest.company = center;
        if (typeof invest.stock === "number") {
            const contributorId = invest.stock as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getStock(contributorId).then(data => {
                    invest.stock = data;
                    resolve();
                });
            }));
        }
    });
    (center.corporates as CorporateRelationship[]).forEach(invest => {
        invest.company = center;
        if (typeof invest.fund === "number") {
            const contributorId = invest.fund as number;
            promisesToFill.push(new Promise<any>(resolve => {
                getFund(contributorId).then(data => {
                    invest.fund = data;
                    resolve();
                });
            }));
        }
    });
    await Promise.all(promisesToFill);
    console.log(center);
    const d3Data: D3Data = {
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
    (center.releases as ReleaseRelationship[]).forEach(contain => {
        d3Data.relationships.push(release2DataRelationship(contain));
        if (d3Data.nodes.findIndex(n => n.id === (contain.stock as StockEntity).id.toString()) === -1) {
            d3Data.nodes.push(stock2DataNode(contain.stock as StockEntity));
        }
    });
    (center.manages as ManageRelationship[]).forEach(contain => {
        d3Data.relationships.push(manage2DataRelationship(contain,1));
        if (d3Data.nodes.findIndex(n => n.id === (contain.people as PeopleEntity).id.toString()) === -1) {
            d3Data.nodes.push(people2DataNode(contain.people as PeopleEntity));
        }
    });
    (center.corporates as CorporateRelationship[]).forEach(contain => {
        d3Data.relationships.push(corporate2DataRelationship(contain));
        if (d3Data.nodes.findIndex(n => n.id === (contain.fund as FundEntity).id.toString()) === -1) {
            d3Data.nodes.push(fund2DataNode(contain.fund as FundEntity));
        }
    });
    console.log(d3Data);
    init();
    neo4jd3Instance.replaceWithD3Data(d3Data);
}




function onNodeDoubleClicked(node: DataNode) {
    console.log(node);
    console.log('clicked');
    const id = parseInt(node.id);
    const contributor = cachedContributorEntities.find(c => c.id === id);
    const fund = cachedFundEntities.find(f => f.id === id);
    const project = cachedProjectEntities.find(p => p.id === id);
    const people = cachedPeopleEntities.find(p => p.id === id);
    const company = cachedCompanyEntities.find(p => p.id === id);
    const stock = cachedStockEntities.find(p => p.id === id);

    if (contributor) {
        console.log('prepare contributor');
        showContributor(id).then(() => console.log('contributor shown'));
    } else if (fund) {
        console.log('prepare fund');
        showFund(id).then(() => console.log('fund shown'));
    } else if (project) {
        console.log('prepare project');
        showProject(id).then(() => console.log('project shown'));
    }
    else if (people) {
        console.log('prepare people');
        showPeople(id).then(() => console.log('project shown'));
    }
    else if (stock) {
        console.log('prepare project');
        showStock(id).then(() => console.log('project shown'));
    }
    else if (company) {
        console.log('prepare project');
        showCompany(id).then(() => console.log('project shown'));
    }

}

function onRelationshipDoubleClicked(relationship: DataRelationship) {
    console.log('double click on relationship: ' + JSON.stringify(relationship));
}


/*
    Search event listeners
 */
(document.getElementById("search-fund-button") as HTMLButtonElement).onclick = ()=>{
    const fundInput =   (document.getElementById("search-fund-input") as HTMLInputElement);
    const searchKeyword = fundInput.value;
    if(searchKeyword.length === 0){
        alert('请输入搜索内容');
    }else{
        superagent.get(`${apiRoot}/neo4j/node/fund/findOne?key=${searchKeyword}`).then(response=>{
            const body = response.body as { id: number, name: string, number: number, invests: { id: number, contributorId: number }[], contains: { id: number, projectId: number }[] };
            const fundId = body.id;
            getFund(fundId).then(()=>showFund(fundId));
        })
    }
};
showCompany(886).then(() => console.log('shown'));

// showFund(386).then(() => console.log('shown'));