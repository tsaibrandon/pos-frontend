import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('App', () => {
    it('renders button with initial counter state', () => {
        render(<App />)
        
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument;
        expect(button).toHaveTextContent(/count is 0/i);
    })

    it('increments counter by 2', async () => {
        render(<App />)

        const button = screen.getByRole('button');
        
        for(let i = 0; i < 5; i++) {
            const expectedCount = i * 2;
            expect(button).toHaveTextContent(`count is ${expectedCount}`);
            await userEvent.click(button);
        }

        expect(button).toHaveTextContent(/count is 10/i);
    })
})
