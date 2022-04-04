/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
const path = require('path')
const fs = require('fs')
const outDir = path.join(path.relative('./', __filename), '..', '..', 'items')
const writeImage = async (item, res) => {
  try {
    await fs.promises.mkdir(outDir)
  } catch (e) {}
  
  const fileStream = fs.createWriteStream(path.join(outDir, item.img.split('/').pop()));
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  let allItems = {}

  on('task', {
    writeItems(items) {
      console.log('items', Object.keys(items))
      for (let i = 0; i < items.length; i++) {
        allItems[items[i].id] = {
          ...items[i]
        }
      }
      return allItems
    },
    addToId({ id, data }) {
      allItems[id + ''] = {
        ...data,
        ...allItems[id + '']
      }

      return allItems
    },
    async fetchImage(id) {
      const item = allItems[id + '']
      console.log('item', item)
      const { default: fetch } = await import('node-fetch')
      const res = await fetch(item.img)
      await writeImage(item, res)
      return item.img
    },
    serialize() {
      console.log('finished', 'all items', allItems)
      return null;
    }
  })
}
