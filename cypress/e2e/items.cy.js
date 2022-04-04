it('works', () => {
  let numberOfPages
  cy.intercept('*analytics*', {
    statusCode: 500,
    body: 'console.log'
  }).intercept('*ad*', {
    statusCode: 500,
    body: 'console.log'
  })
  .visit('https://www.runehq.com/item/search/A%25/name/asc/name')
  .get('.pagination').first().children()
  .get('[href*="/database.php?type=item"]')
  .then(($results) => {
    const buildItem = (_, node) => {
      return {
        url: node.href,
        id: node.href.split('&id=').pop(),
        name: node.innerText
      }
    }

    const items = $results.map(buildItem)
  
    cy.task('writeItems', items)
      .wrap(items).each((i) => {
        const id = i.id
        cy.visit(i.url)
          .get('.content-intro-image img')
          .then(($imgs) => {
            console.log($imgs)
            cy.task('addToId', { id, data: { img: $imgs[0].src } })
            .task('fetchImage', id)
            .then(result => {
              console.log(result);
              // debugger
            })
          })
      })
  })

})