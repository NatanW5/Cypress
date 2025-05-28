describe('Shopify Storefront Prototype', () => {
  const storeUrl = 'https://r0983510-realbeans.myshopify.com/';
  const password = 'ingohd'; // Vervang dit met je echte wachtwoord

  beforeEach(() => {
    cy.visit(storeUrl);
    cy.location('pathname').then((path) => {
      if (path.includes('password')) {
        cy.get('input[type="password"]').type(password);
        cy.get('button[type="submit"]').click();
      }
    });
  });

  it('The product catalog page shows the correct items you entered.', () => {
    cy.visit(`${storeUrl}collections/all`);
    // Controleer of ul#product-grid 2 li's bevat
    cy.get('ul#product-grid').find('li').should('have.length', 2);

    // Eerste li bevat juiste productnaam en prijs
    cy.get('ul#product-grid li').eq(0).within(() => {
      cy.contains('Blended coffee 5kg');
      cy.contains('€55,00');
    });

    // Tweede li bevat juiste productnaam en prijs
    cy.get('ul#product-grid li').eq(1).within(() => {
      cy.contains('Roasted coffee beans 5kg');
      cy.contains('€40,00');
    });
  });

  it('The product catalog page shows the correct items you entered.', () => {
    cy.visit(`${storeUrl}collections/all`);
    // Sorteer op prijs (laag naar hoog)
    cy.get('#SortBy').select('price-ascending');
    cy.wait(1000); // wacht op herladen van producten

    // Check dat het eerste product "Roasted coffee beans 5kg" is (goedkoopste)
    cy.get('ul#product-grid li').eq(0).within(() => {
      cy.contains('Roasted coffee beans 5kg');
      cy.contains('€40,00');
    });

    // Sorteer op alfabetisch: Z-A
    cy.get('#SortBy').select('title-descending');
    cy.wait(1000);

    // Check dat het eerste product nu "Roasted coffee beans 5kg" is (alfabetisch Z-A)
    // Dit hangt af van je titels, dus als "Roasted coffee..." later komt dan "Blended...", dan moet je de verwachte volgorde aanpassen.
    cy.get('ul#product-grid li').eq(0).within(() => {
      cy.contains('Roasted coffee beans 5kg');
    });
  });

  it('The homepage intro text, and product list appear correctly', () => {
    cy.contains('Since 1801, RealBeans'); // Pas aan aan jouw echte tekst
    cy.get('div.collection')
    .find('li')
    .should('have.length', 2);
  });

  it('The About page includes the history paragraph.', () => {
    cy.visit(`${storeUrl}pages/about`);
    cy.contains('From a small Antwerp').should('exist'); // Pas aan aan jouw echte tekst
  });

  const products = [
  {
    handle: 'blended-coffee-5kg',
    name: 'Blended coffee 5kg',
    price: '€55,00',
    description: 'RealBeans coffee, ready to brew.',
    imageName: 'RealBeansBlendBag.png'
  },
  {
    handle: 'roasted-coffee-beans-5kg',
    name: 'Roasted coffee beans 5kg',
    price: '€40,00',
    description: 'Our best and sustainable real roasted beans.',
    imageName: 'RealBeansRoastedBag.png'
  }
  ];

  products.forEach((product) => {
    it(`Product detailpagina toont correcte info voor "${product.name}"`, () => {
      cy.visit(`https://r0983510-realbeans.myshopify.com/products/${product.handle}`);

      // Wachtwoord invullen als nodig
      cy.location('pathname').then((path) => {
        if (path.includes('password')) {
          cy.get('input[type="password"]').type('your_store_password_here');
          cy.get('button[type="submit"]').click();
        }
      });

      // Check productnaam
      cy.contains(product.name);

      // Check prijs
      cy.contains(product.price);

      // Check beschrijvingstekst
      cy.contains(product.description);

      // Check of de afbeeldingsnaam in de src voorkomt
      cy.get('img')
        .should('have.attr', 'src')
        .and('include', product.imageName);
    });
  });
});
