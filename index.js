#!/usr/bin/env/ node

const inquirer = require('inquirer');
const fs = require('fs');

const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const CURR_DIR = process.cwd();
const replace = require('replace-in-file');
const dasherize = require("underscore.string/dasherize");
const trim = require("underscore.string/trim");
const classify = require("underscore.string/classify");

const _wc_prefix = 'my-wc-';

// Setup your questions here
const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  }
];

// start the generator
function init() {
	inquirer.prompt(QUESTIONS)
	  .then(answers => {
		const projectChoice = answers['project-choice'];
		const projectName = generateProjectName(answers['project-name']);
		const templatePath = `${__dirname}/templates/${projectChoice}`;
	  
		fs.mkdirSync(`${CURR_DIR}/${projectName}`);	
		beginCopy(templatePath, projectName);
	});
}

// Generate project name based on the project choice
function generateProjectName(choice) {
	const trimmedName = trim(dasherize(choice), '-');
	if(choice.indexOf('component') > -1) {
		return _wc_prefix + trimmedName;
	}
	
	return trimmedName;
}

// Async function for copying template files and replacing necessary project names.
async function beginCopy(templatePath, projectName) {
	await createDirectoryContents(templatePath, projectName);
	replaceNames(projectName);
}

// Main async and recursive function for copying template files.
async function createDirectoryContents (templatePath, newProjectPath) {
//const createDirectoryContents = async (templatePath, newProjectPath) => {
  const filesToCreate = fs.readdirSync(templatePath);
	
  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;
    
    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');
	  
	  // Rename
	  if (file === '.npmignore') file = '.gitignore';
      
      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
      
      // recursive call
      createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
    }
  });
}

// Replace names after copy the template files
function replaceNames(projectName) {
	const className = classify(projectName).replace(/ /g, '');
	const options = {
	  files: `${CURR_DIR}\\${projectName}\\**\\*.*`,
	  from: [/\$\[my\-wc\-name\]/g, /\$\[MyWcName\]/g],
	  to: [`${projectName}`, className],
	};
	
	// console.log("Replacing the names using: ");
	// console.log(options);
	
	
	replace(options).then(results => {
		// console.log(results);
		console.log('Project Generation Successful!');
	  })
	  .catch(error => {
		console.error('Error occurred:', error);
	  });
}

init();