describe('The Home Page', () => {
    it('successfully loads', () => {
        cy.visit('/') // change URL to match your dev URL
    })
})

describe('Logging in with incorrect credentials', () => {
    it('fails to log in', () => {
        cy.get('#username')
        .type('abc')

        cy.get('#password')
        .type('1234');

        cy.get('.login-btn')
        .click()

        cy.get('.form-errors')
        .should('contain', 'Incorrect username or password')
    })
})

describe('Logging in with non-admin account', () => {
    it('fails to log in', () => {
        cy.get('#username')
        .clear()
        .type('bluefrog')

        cy.get('#password')
        .clear()
        .type('P@ssw0rd');

        cy.get('.login-btn')
        .click()

        cy.get('.form-errors')
        .should('contain', 'Only Administrators are allowed')
    })
})

describe('Logging in as lionadmin', () => {
    it('successfully logged in', () => {
        cy.get('#username')
        .clear()
        .type('lionadmin')

        cy.get('#password')
        .clear()
        .type('P@ssw0rd');

        cy.get('.login-btn')
        .click()

        cy.url().should('contain', '/dashboard')
    })
})

//do CRUD for announcements
describe('Navigating to Announcements Page', () => {
    it('redirected to Announcements', ()=> {
        cy.get('.sidenav > div > .nav-link')
        .eq(7)
        .click()

        cy.url().should('contain', '/announcement')
    })
})

describe('Creating an Announcement', () => {
    it('announcement created', () => {
        cy.get('#DataTable_filter > button')
        .click()

        cy.get('#message')
        .type('This is a test')

        cy.get('#checkA')
        .click({force: true})

        cy.get('.btn-success')
        .click()
        .then(() => {
            cy.wait(1000)
            cy.reload()
        })

        cy.get('#DataTable > tbody > tr')
        .eq(0).get('td')
        .eq(0).should('contain', 'This is a test')
    })
})

describe('Deleting an Announcement', ()=> {
    it('announcement deleted', ()=> {
        cy.get('#DataTable > tbody > tr').eq(0)
        .get('td > .text-danger').eq(0)
        .click()

        cy.get('.confirmation-buttons > div > a')
        .eq(0)
        .click()
    })
})