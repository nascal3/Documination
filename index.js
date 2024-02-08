const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const swagger = require('./swagger.json');

const foldersArray = [];

const readAllDocFolders = (docsFolderPath) => {
    const folders = fs.readdirSync(docsFolderPath);
    folders.forEach((folder) => {
        const folderPath = path.join(docsFolderPath, folder);
        const stats = fs.statSync(folderPath);
        if (stats.isDirectory()) {
            foldersArray.push(folder);
        }
    });
    createTagsInJsonFiles();
};

const doesDirectoryExist = (directoryPath) => {
    try {
        return fs.statSync(directoryPath).isDirectory();
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false; // Path does not exist
        }
        throw error; // Other error (e.g., permission denied)
    }
};

const createTagsInJsonFiles = () => {
    const templateCopy = JSON.parse(JSON.stringify(swagger));
    const newTags = [];
    const newJSONFilesArray = [];

    foldersArray.forEach((folder) => {
        const directoryPath = `./docs/${folder}/tags`;

        if (!doesDirectoryExist(directoryPath)) return;

        const files = fs.readdirSync(directoryPath);
        const jsonFiles = files.filter((file) => path.extname(file).toLowerCase() === '.json' && file !== 'tagGroups.json');

        jsonFiles.forEach((jsonFile) => {
            const filePath = path.join(directoryPath, jsonFile);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            try {
                const jsonData = JSON.parse(fileContent);
                newTags.push(jsonData);
            } catch (error) {
                console.error(`Error parsing JSON file ${jsonFile}:`, error.message);
            }
        });

        const infoContent = getDocumentationInfo(`./docs/${folder}`);
        const baseServerContent = getBaseServerDocumentation(`./docs/${folder}`);
        const tagGroupPath = `${directoryPath}/tagGroups.json`;
        let tagGroupContent = [];

        try {
            tagGroupContent = JSON.parse(fs.readFileSync(tagGroupPath, 'utf8'));
        } catch (error) {
            console.error(`Error parsing JSON: ${error.message}. Using default value.`);
        }

        const { info } = templateCopy;
        const newJSON = {
            ...templateCopy,
            servers: [...baseServerContent],
            info: {
                ...info,
                ...infoContent,
            },
            service: folder,
            tags: newTags,
            'x-tagGroups': tagGroupContent,
        };
        newJSONFilesArray.push(newJSON);
    });

    createNewSwaggerFiles(newJSONFilesArray);
};

const getDocumentationInfo = (directoryPath) => {
    const infoFilePath = `${directoryPath}/info.json`;
    return doesFileExist(infoFilePath) ? JSON.parse(fs.readFileSync(infoFilePath, 'utf8')) : {};
};
const getBaseServerDocumentation = (directoryPath) => {
    const serversInfoFilePath = `${directoryPath}/servers/servers.json`;
    return doesFileExist(serversInfoFilePath) ? JSON.parse(fs.readFileSync(serversInfoFilePath, 'utf8')) : [];
};

const doesFileExist = (filePath) => {
    try {
        return fs.statSync(filePath).isFile();
    } catch (error) {
        return false;
    }
};

const createNewSwaggerFiles = (JSONFilesArray) => {
    JSONFilesArray.forEach((jsonFile) => {
        readPathJsonFiles(jsonFile);
    });
};

const readPathJsonFiles = (jsonData) => {
    const { paths } = jsonData;
    let newPath = {};
    const docsDirectory = `./docs/${jsonData.service}`;
    const files = fs.readdirSync(docsDirectory);

    const jsonFiles = files.filter((file) => path.extname(file).toLowerCase() === '.json' && file !== 'info.json');

    jsonFiles.forEach((jsonFile) => {
        const filePath = path.join(docsDirectory, jsonFile);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        try {
            const jsonData = JSON.parse(fileContent);
            newPath = { ...paths, ...newPath, ...jsonData };
        } catch (error) {
            console.error(`Error parsing JSON file: ${jsonFile}:`, error.message);
        }
    });
    createJSONFile({ ...jsonData, paths: newPath });
};

const createJSONFile = (jsonData) => {
    const data = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(`dist/${jsonData.service}.json`, data);
    createHTMLServiceFile(jsonData.service);
};

const createHTMLServiceFile = (service) => {
    execSync(`redocly build-docs dist/${service}.json --output=dist/${service}.html`);
};

const folderPath = './docs';
readAllDocFolders(folderPath);
