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
            'Project': 'database'
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
        const body = response.body as { id: number, name: string, number: number, invests: { id: number, contributorId: number }[], contains: { id: number, projectId: number }[] };
        //check body fields
        return {
            id: body.id,
            name: body.name,
            number: body.number,
            invests: body.invests.map(i => i.id),
            contains: body.contains.map(c => c.id),
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

function onNodeDoubleClicked(node: DataNode) {
    console.log(node);
    console.log('clicked');
    const id = parseInt(node.id);
    const contributor = cachedContributorEntities.find(c => c.id === id);
    const fund = cachedFundEntities.find(f => f.id === id);
    const project = cachedProjectEntities.find(p => p.id === id);
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


showFund(101).then(() => console.log('shown'));