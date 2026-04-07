import { AppProvider } from './AppProvider'

import { Msgs } from './msgs';

export const AppCanvas = ({children}) => {
    return (
        <div className='container-fluid'>
            <AppProvider>
                <Msgs />
                {children}
            </AppProvider>
        </div>    
    )
}