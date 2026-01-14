import { Button } from '@financeflow/ui';
import { SHARED_CONSTANT } from '@financeflow/shared';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-base flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-primary-600 mb-4">FinanceFlow Web</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{SHARED_CONSTANT}</p>
            <Button>Shared Button Component</Button>
        </div>
    )
}

export default App
