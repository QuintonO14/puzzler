
describe('Login test', () => {
    it('Register and/or Login a user', () => {
        cy.visit('https://puzzlers.vercel.app')
        cy.get('input[data-testid=username]').type('abc123{enter}')
        cy.get('input[data-testid=username]').should('have.value', 'abc123')
        cy.get('input[data-testid=password]').type('password{enter}')
        cy.get('input[data-testid=password]').should('have.value', 'password')
        cy.contains('Enter').click()
        cy.url().should('include', '/home')
    })
})

describe('Home Page Test', () => {
    it("Handles file upload, checks that puzzle saved, replays the puzzle, logs a user out", () => {
        cy.viewport(900, 700)
        cy.get("input[type=file]").attachFile('image.jpg')
        cy.wait(5000)
        cy.get(".jigsaw-puzzle__piece").click()
        cy.contains("Save").click()
        cy.get(".burger").click({force: true})
        cy.get(".toggle").click({force: true})
        cy.get(".thumbnail").first().realHover()
        cy.wait(1000)
        cy.get(".thumbnail > .difficulties > .thumb-controls > .replay").first().click({force: true})
        cy.get(".burger").click({force: true})
        cy.get(".logout").click()
    })
})