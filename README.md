# any-generator
A Starter Package for generating template-based project.

## What is this about
This is just a basic package. Dont expect too much from it!
I created this one to basically generate a template project out of a folder. 
The templates are located at the "templates" folder. By default, it has two folder just to feel that we have a choice when running the cli command.

## How to use 
Install dependencies using 

`npm install`

By default, you can run 

`npm run generate` 

to know whats the default behavior.

### Adding project templates

Create a new folder in the "\templates" folder. Make sure you have a meaningful folder name for it. 

**Adding custom names in the project template**

To replace project specific names inside your templates, make sure to add these markers in your template:

For dasherize formats:

`$[my-wc-name]`

For classify formats (for Class names):

`$[MyWcName]`


## Deploy as global package locally
If you want to deploy this one as a package locally, you can run

`npm install -g`

when you are inside the project's directory.


