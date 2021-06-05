#!/usr/bin/env node
const { program } = require('commander');
const pkg = require('../package.json')
const { upload } = require('../src/index')

program.version(pkg.version)

program.option('-f,--file <filepath>', 'file path to upload')

program.parse(process.argv);


const options = program.opts();

upload(options)
