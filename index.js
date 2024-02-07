const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process')
const swagger = require ('./swagger.json');

const foldersArray = []

// Read all the folders in 'docs' for all teams and create an array of the names.
const readAllDocFolders = (docsFolderPath) => {
    const folders = fs.readdirSync(docsFolderPath);
    folders.forEach(folder => {
        const folderPath = path.join(docsFolderPath, folder);
        const stats = fs.statSync(folderPath);
        if (stats.isDirectory()) {
            foldersArray.push(folder);
        }
    });
    return createTagsInJsonFiles();
}

// Check if the folder exists
const doesDirectoryExist = (path) => {
    try {
        return fs.statSync(path).isDirectory();
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false; // Path does not exist
        } else {
            throw error; // Other error (e.g., permission denied)
        }
    }
}

// Loop through each folder and it's tags create the JSON doc named as the
// folders structure from the template.
const createTagsInJsonFiles = () => {
    // Create deep clone of the JSON template
    const templateCopy = JSON.parse(JSON.stringify(swagger));
    let newTags = [];
    const newJSONFilesArray = [];

    // Get each folder and its embedded tags folder, get the tags JSON files in the
    // tags folder & inject them into the JSON document template.
    foldersArray.map(folder => {
        const directoryPath = `./docs/${folder}/tags`;

        if (!doesDirectoryExist(directoryPath)) return;

        // Read the contents of the tags folder
        const files = fs.readdirSync(directoryPath);
        // Filter out JSON files
        const jsonFiles = files.filter(file => {
            if (file === 'tagGroups.json') return;
            return path.extname(file).toLowerCase() === '.json';
        });

        // Read the content of each tag JSON file
        jsonFiles.forEach(jsonFile => {
            const filePath = path.join(directoryPath, jsonFile);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            // Combine all the JSON files to a single Array
            try {
                const jsonData = JSON.parse(fileContent);
                newTags.push(jsonData);
            } catch (error) {
                console.error(`Error parsing JSON file ${jsonFile}:`, error.message);
            }
        });

        const tagGroupPath = `${directoryPath}/tagGroups.json`;
        let tagGroupContent = [];

        try {
            tagGroupContent = JSON.parse(fs.readFileSync(tagGroupPath, 'utf8'));
        } catch (error) {
            console.error(`Error parsing JSON: ${error.message}. Using default value.`);
        }

        const newJSON = {...templateCopy, service: folder, tags: newTags, 'x-tagGroups': tagGroupContent }
        newJSONFilesArray.push(newJSON);
    })

    createNewSwaggerFiles(newJSONFilesArray)
}

// Create new swagger files for each tags group data and paths structure in document.
const createNewSwaggerFiles = (JSONFilesArray) => {
    JSONFilesArray.map(jsonFile => {
        readPathJsonFiles(jsonFile);
    })
}

// Fetch each paths structure and created JSON folders.
const readPathJsonFiles = (jsonData) => {
    const {paths} = jsonData;
    let newPath = {};
    const docsDirectory = `./docs/${jsonData.service}`;

    // Read the contents of the folder
    const files = fs.readdirSync(docsDirectory);

    // Filter out JSON files
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

    // Read the content of each JSON file
    jsonFiles.forEach(jsonFile => {
        const filePath = path.join(docsDirectory, jsonFile);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        // Combine all the JSON files to a single JSON
        try {
            const jsonData = JSON.parse(fileContent);
            newPath = {...paths, ...newPath, ...jsonData};
        } catch (error) {
            console.error(`Error parsing JSON file ${jsonFile}:`, error.message);
        }
    });
    createJSONFile({...jsonData, paths: newPath});
}

// Generate resulting final openAPI JSON file
const createJSONFile = (jsonData) => {
    const data = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(`dist/${jsonData.service}.json`, data);

    createHTMLServiceFile(jsonData.service)
}

// Generate resulting final HTML file
const createHTMLServiceFile = (service) => {
    execSync(`redocly build-docs dist/${service}.json --output=dist/${service}.html`);
}

const folderPath = './docs';
readAllDocFolders(folderPath);


