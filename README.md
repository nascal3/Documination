## Documination: An API Illumination💡
This project generates documentation for APIs done **OpenAPI** standards and creates a _Redoc_ HTML file
with a corresponding JSON representation of the same documentation.
### Set-up
Once you have cloned the project file on your preferred location. Navigate to the root folder and on CLI run `npm install`. That's all!

### Generate documentation
Now on to the fun part, generate your documentation. Navigate to the `docs` folder that 
is in the root folder. Create a new folder where your documentation files will live.

#### Documentation file structure:
The naming convention of your documentation file <span style="color:red">**MUST NOT**</span> contain any spaces or special characters for a better experience.
Create a `tags` folder under your main documentation folder. This file will contain the JSON files that will be used to create tags used to help group/arrange 
your documentation. Below is an image with an example of the structure:

![file_structure.png](assets%2Ffile_structure.png)

This example above takes to account the main documentation folder is named `example_services`. In the `tags` folder create the
`tagGroups.json` file to be used to group your tags. If you choose to exempt grouping your tags
this file can be left with an empty array. If not, here is an example of how to format of its contents based on
this example.
```json
[
  {
    "name": "User Management",
    "tags": ["user"]
  },
  {
    "name": "Statistics",
    "tags": ["store", "pet"]
  }
]
```
As for the other _JSON_ folders holding information about the endpoints documentation tag content. Their contents must
be in the following format e.g. for the `pet.json` file (which represents a tag).
```json
{
  "name": "pet",
  "description": "Everything about your Pets",
  "externalDocs": {
    "description": "Find out more",
    "url": "http://swagger.io"
  }
}
```
#### Endpoints documentation:
The _JSON_ files to document endpoints will be under your documentation directory.
Here's an example of how the *JSON* structure would look like in the `user.json` file:
```json
{
  "/user/createWithArray": {...},
  "/user/createWithList": {...},
  "/user/{username}": {...},
  "/user/login": {...},
  "/user": {...}
}
```
To explore further information on the JSON endpoint representation structure, look at the 
file `user.json` under the `example_services` directory.

**NB:** The JSON structure follows _openAPI 2.0_, but will also work with _openAPI 3.0_ JSON format.
